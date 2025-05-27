import { FC, useEffect, useState } from "react";
import ScheduleDate from "./ScheduleDate";
import WeekDaySchedule from "./WeekDaySchedule";
import SchoolMap from "./SchoolMap";
import { useSchedule } from "./ScheduleProvider";
import { allFloorAreas } from "../../../utils/getSchoolMaps";
import axios from "axios";

const HOST = import.meta.env.VITE_API_URL;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface UserType {
  first_name: string;
  last_name: string;
}
const SchoolActivity: FC<{ section: string; role: string }> = ({
  section,
  role,
}) => {
  const [user, setUser] = useState<UserType>({
    first_name: "",
    last_name: "",
  });
  const { schedule } = useSchedule();

  const selectedRoom = schedule.weekdaySchedule.find(
    (weekDay: { _id: string }) => weekDay._id === schedule.scheduleID
  ) as
    | {
        room: string;
        code: string;
        subject: string;
        professor_id: string;
        assigned_section: string;
      }
    | undefined;

  const currentFloorLevel = allFloorAreas.find(
    (fl) => fl.id === selectedRoom?.room
  );

  useEffect(() => {
    const getUserData = async () => {
      try {
        const resp = await axios.get<{ user: UserType }>(
          `${HOST}/user/visit/${selectedRoom?.professor_id}`,
          {
            headers: {
              Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
            },
          }
        );

        setUser(resp.data.user);
      } catch (err: any) {
        console.error(
          err.response.data.message ||
            "Something went wrong. Please try again later."
        );
      }
    };

    if (selectedRoom?.professor_id) {
      getUserData();
    } else {
      setUser({ first_name: "", last_name: "" });
    }
  }, [selectedRoom?.professor_id]);

  return (
    <div className="grow-1 px-[3rem] py-[2rem] border-gray-half border-l-2 max-lg:py-[1rem] max-lg:px-[2rem]">
      <h2 className="text-2xl font-bold pb-[2.5rem] max-lg:text-lg max-lg:text-center max-lg:pb-[2.5rem]">
        School Activity Details ({weekdays[schedule.weekday]})
      </h2>

      <div className="flex max-lg:flex-col">
        <div className="pr-[1rem] max-lg:w-[100%] max-lg:mb-[1rem]">
          <div className="flex justify-between items-center h-[3rem] max-lg:h-0 max-lg:pb-[1rem]">
            <h3 className="font-bold max-lg:text-sm">Schedule</h3>
          </div>
          <WeekDaySchedule section={section} role={role} />
        </div>
        <div>
          <div className="flex justify-between items-center h-[3rem]">
            <h3 className="font-bold max-lg:text-sm">Assigned room/area</h3>
            <ScheduleDate />
          </div>
          <SchoolMap />
        </div>
      </div>

      <div className="border-2 border-gray-half mt-[3rem] p-[1rem] rounded-lg max-lg:text-xs max-lg:mt-[0.5rem]">
        <h3 className="font-bold max-lg:text-sm">Room Information</h3>

        <ul className="flex flex-col gap-y-3 py-[1rem] max-lg:gap-y-2 max-lg:py-[0.5rem]">
          <li className="flex mt-[0.25rem]">
            <span>Room number:</span>
            <span className="font-bold block ml-[0.5rem]">
              {selectedRoom?.room}
            </span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span>Floor level:</span>
            <span className="font-bold block ml-[0.5rem]">
              {currentFloorLevel?.floorLevel &&
                `${currentFloorLevel?.floorLevel} floor`}
            </span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span className="text-nowrap">Class section:</span>
            <span className="font-bold block ml-[0.5rem] uppercase">
              {selectedRoom?.assigned_section}
            </span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span className="text-nowrap">Class subject:</span>
            <span className="font-bold block ml-[0.5rem]">
              {selectedRoom?.subject}{" "}
              {selectedRoom?.code && `(${selectedRoom.code})`}
            </span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span>Class professor:</span>
            <span className="font-bold block ml-[0.5rem]">
              <a
                href={`/user/visit/${selectedRoom?.professor_id}`}
                className="underline text-blue"
              >
                {user.first_name} {user.last_name}
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SchoolActivity;
