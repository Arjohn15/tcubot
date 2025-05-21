import { FC } from "react";
import ScheduleDate from "./ScheduleDate";
import WeekDaySchedule from "./WeekDaySchedule";
import SchoolMap from "./SchoolMap";

const SchoolActivity: FC<{ section: string; role: string }> = ({
  section,

  role,
}) => {
  return (
    <div className="grow-1 px-[3rem] py-[2rem] border-gray-half border-b-2 border-l-2">
      <h2 className="text-2xl font-bold pb-[2.5rem]">
        School Activity Details
      </h2>

      <div className="flex">
        <div className="w-[20%]">
          <div className="flex justify-between items-center h-[3rem]">
            <h3 className="font-bold">Class Schedule</h3>
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
    </div>
  );
};

export default SchoolActivity;
