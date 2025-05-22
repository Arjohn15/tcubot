import { FC } from "react";
import ScheduleDate from "./ScheduleDate";
import WeekDaySchedule from "./WeekDaySchedule";
import SchoolMap from "./SchoolMap";
import { useSchedule } from "./ScheduleProvider";
import { allFloorAreas } from "../../../utils/getSchoolMaps";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SchoolActivity: FC<{ section: string; role: string }> = ({
  section,
  role,
}) => {
  const { schedule } = useSchedule();

  const selectedRoom = schedule.weekdaySchedule.find(
    (weekDay: { _id: string }) => weekDay._id === schedule.scheduleID
  ) as
    | {
        room: string;
        code: string;
        subject: string;
        professor_name: string;
        professor_id: string;
      }
    | undefined;

  const currentFloorLevel = allFloorAreas.find(
    (fl) => fl.id === selectedRoom?.room
  );
  return (
    <div className="grow-1 px-[3rem] py-[2rem] border-gray-half border-b-2 border-l-2">
      <h2 className="text-2xl font-bold pb-[2.5rem]">
        School Activity Details ({weekdays[schedule.weekday]})
      </h2>

      <div className="flex">
        <div className="w-[20%]">
          <div className="flex justify-between items-center h-[3rem]">
            <h3 className="font-bold">Schedule</h3>
          </div>
          <WeekDaySchedule section={section} role={role} />
        </div>
        <div className="w-[80%]">
          <div className="flex justify-between items-center h-[3rem]">
            <h3 className="font-bold">Assigned room/area</h3>
            <ScheduleDate />
          </div>
          <SchoolMap />
        </div>
      </div>

      <div className="border-2 border-gray-half mt-[3rem] p-[1rem] rounded-lg">
        <h3 className="font-bold">Room Information</h3>

        <ul className="flex flex-col gap-y-3 py-[1rem]">
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
            <span>Class subject:</span>
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
                {selectedRoom?.professor_name}
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SchoolActivity;
