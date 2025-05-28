import { FC, useEffect, useState } from "react";
import { useSchedule } from "./ScheduleProvider";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoMdArrowDropright } from "react-icons/io";
import { isTimeInRange } from "../../../utils/getTimeRange";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";

const HOST = import.meta.env.VITE_API_URL;

dayjs.extend(customParseFormat);

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface WeekDaySchedule {
  time_start: string;
  time_end: string;
  room: string;
  subject: string;
  code: string;
  assigned_section: string;
  day: number;
  professor_id: string;
  _id: string;
}

const WeekDaySchedule: FC<{ section: string; role: string }> = ({
  section,
  role,
}) => {
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [weekDaySchedule, setWeekDaySchedule] = useState<WeekDaySchedule[]>([]);

  const { id } = useParams();
  const { schedule, onChangeScheduleID, onChangeWeekDaySchedule } =
    useSchedule();

  const { user } = useAppSelector(selectUserState);

  useEffect(() => {
    async function getWeekDaySchedule(): Promise<void> {
      try {
        const response = await axios.get(
          `${HOST}/user/schedule-weekday?weekDay=${schedule.weekday}&section=${
            section ? section : user.section
          }&id=${id}&role=${user.role}&visitee_role=${role}`,
          {
            headers: {
              Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
            },
          }
        );

        if (response.data.weekDaySchedule.length === 0) {
          setErrMessage(`No ${weekdays[Number(schedule.weekday)]} schedule.`);
        } else {
          setErrMessage(null);
          setWeekDaySchedule(response.data.weekDaySchedule);

          const currentSchedule = response.data.weekDaySchedule.find(
            (weekday: { time_start: string; time_end: string; day: number }) =>
              isTimeInRange(
                dayjs().format("HH:mm"),
                weekday.time_start,
                weekday.time_end
              ) && weekday.day === dayjs(new Date()).day()
          );

          onChangeWeekDaySchedule(response.data.weekDaySchedule);

          if (currentSchedule) {
            onChangeScheduleID(currentSchedule._id);
          }
        }
      } catch (err: any) {
        setErrMessage(err.response.data.message);
        setWeekDaySchedule([]);
      }
    }
    getWeekDaySchedule();
  }, [schedule.weekday, section, id, user.role, user.section, HOST, role]);

  if (errMessage) {
    return (
      <p className="w-max mt-[1rem] text-gray max-md:text-xs">{errMessage}</p>
    );
  }

  return (
    <div className="mt-[1rem]">
      <ul className="grid gap-y-3.5 max-sm:grid-cols-2 max-lg:gap-x-5">
        {weekDaySchedule.map((weekDay) => {
          const isSelected = weekDay._id === schedule.scheduleID;

          return (
            <li key={weekDay._id} className="relative">
              <Button
                style={{
                  border: isSelected ? "1px solid #eb7373" : "1px solid black",
                  padding: "0.25rem 1rem",
                  borderRadius: "5rem",
                }}
                onClick={() => onChangeScheduleID(weekDay._id)}
              >
                <div className="text-black flex min-w-[10rem] justify-center max-md:text-[0.65rem] max-md:min-w-[7.5rem]">
                  {dayjs(weekDay.time_start, "HH:mm").format("h:mm A")}
                  <span className="block mx-[0.5rem]">-</span>
                  {dayjs(weekDay.time_end, "HH:mm").format("h:mm A")}
                </div>
              </Button>
              {isSelected && (
                <span className="text-red text-xl absolute left-[-1.5rem] top-[50%] translate-y-[-50%] max-md:text-lg max-md:left-[-1rem]">
                  <IoMdArrowDropright />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WeekDaySchedule;
