import { FC, useEffect, useState } from "react";
import { useSchedule } from "./ScheduleProvider";
import axios from "axios";
import { HOST } from "../../../utils/getHost";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoMdArrowDropright } from "react-icons/io";
import { isTimeInRange } from "../../../utils/getTimeRange";

dayjs.extend(customParseFormat);

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
  const [errMessage, setErrMessage] = useState(null);
  const [weekDaySchedule, setWeekDaySchedule] = useState<WeekDaySchedule[]>([]);

  const { id } = useParams();
  const { schedule, onChangeScheduleID, onChangeWeekDaySchedule } =
    useSchedule();

  useEffect(() => {
    async function getWeekDaySchedule(): Promise<void> {
      try {
        const response = await axios.get(
          `http://${HOST}/user/schedule-weekday?weekDay=${schedule.weekday}&section=${section}&id=${id}&role=${role}`,
          {
            headers: {
              Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
            },
          }
        );

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

        setErrMessage(null);
      } catch (err: any) {
        setErrMessage(err.response.data.message);
        setWeekDaySchedule([]);
      }
    }
    getWeekDaySchedule();
  }, [schedule.weekday, section, id, role, HOST]);

  if (errMessage) {
    return <p className="text-gray">{errMessage}</p>;
  }

  return (
    <div className="mt-[1rem]">
      <ul className="grid gap-y-3.5">
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
                <div className="text-black flex min-w-[10rem] justify-center">
                  {dayjs(weekDay.time_start, "HH:mm").format("h:mm A")}
                  <span className="block mx-[0.5rem]">-</span>
                  {dayjs(weekDay.time_end, "HH:mm").format("h:mm A")}
                </div>
              </Button>
              {isSelected && (
                <span className="text-red text-xl absolute left-[-1.5rem] top-[50%] translate-y-[-50%]">
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
