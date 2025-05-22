import { useEffect, useState } from "react";
import getSchoolMaps, { allFloorAreas } from "../../../utils/getSchoolMaps";
import { Button } from "@mui/material";
import { useSchedule } from "./ScheduleProvider";

type FloorLevelType = "1st" | "2nd" | "3rd" | "4th";

const imageMaps = [
  {
    src: "/images/maps/first-floor.png",
    alt: "First Floor Map",
    floorLevel: "1st",
  },
  {
    src: "/images/maps/second-floor.png",
    alt: "Second Floor Map",
    floorLevel: "2nd",
  },
  {
    src: "/images/maps/third-floor.png",
    alt: "Third Floor Map",
    floorLevel: "3rd",
  },
  {
    src: "/images/maps/fourth-floor.png",
    alt: "Fourth Floor Map",
    floorLevel: "4th",
  },
];

const floorLevels: { name: string; id: FloorLevelType }[] = [
  { name: "4", id: "4th" },
  { name: "3", id: "3rd" },
  { name: "2", id: "2nd" },
  { name: "1", id: "1st" },
];

const SchoolMap = () => {
  const [floorLevel, setFloorLevel] = useState<FloorLevelType>("1st");

  const { schedule } = useSchedule();

  let maps;

  switch (floorLevel) {
    case "1st": {
      maps = getSchoolMaps(1786, 363, floorLevel);
      break;
    }
    case "2nd": {
      maps = getSchoolMaps(1788, 365, floorLevel);
      break;
    }
    case "3rd": {
      maps = getSchoolMaps(1791, 365, floorLevel);
      break;
    }
    case "4th": {
      maps = getSchoolMaps(1788, 361, floorLevel);
      break;
    }
    default: {
      maps = getSchoolMaps(1786, 363, floorLevel);
    }
  }

  const selectedRoom = schedule.weekdaySchedule.find(
    (weekDay: { _id: string }) => weekDay._id === schedule.scheduleID
  ) as { room: string } | undefined;

  const currentFloorLevel = allFloorAreas.find(
    (fl) => fl.id === selectedRoom?.room
  );

  useEffect(() => {
    if (
      currentFloorLevel &&
      ["1st", "2nd", "3rd", "4th"].includes(currentFloorLevel.floorLevel)
    ) {
      setFloorLevel(currentFloorLevel.floorLevel as FloorLevelType);
    }
  }, []);

  useEffect(() => {
    if (
      currentFloorLevel &&
      ["1st", "2nd", "3rd", "4th"].includes(currentFloorLevel.floorLevel)
    ) {
      setFloorLevel(currentFloorLevel.floorLevel as FloorLevelType);
    }
  }, [currentFloorLevel?.floorLevel]);

  return (
    <div className="relative flex items-center border-2 border-gray-half rounded-lg my-[1rem] p-[1rem]">
      <h3 className="absolute top-[1.25rem] right-[50%] translate-x-[-50%] font-bold">
        {floorLevel} Floor
      </h3>
      <div className="w-[85%] relative">
        {imageMaps.map((map) => {
          const isCurrentFloorLevl = map.floorLevel === floorLevel;
          return (
            <img
              key={map.floorLevel}
              src={map.src}
              alt={map.alt}
              style={{ display: isCurrentFloorLevl ? "inline" : "none" }}
            />
          );
        })}
        {maps.map(
          ({
            id,
            topPercent,
            leftPercent,
            widthPercent,
            heightPercent,
            label,
          }) => (
            <div
              className="opacity-[0.5]"
              key={id}
              style={{
                background: selectedRoom?.room === id ? "#4aef97ff" : "none",
                position: "absolute",
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                transition: "background-color 0.3s, border-color 0.3s",
              }}
              title={label}
            />
          )
        )}
      </div>
      <div className="w-[15%]">
        <h3 className="text-center font-bold">Floor levels:</h3>
        <ul className="flex flex-col items-center gap-y-3 my-[0.5rem]">
          {floorLevels.map((fl) => {
            const isCurrentFloorLevl = fl.id === floorLevel;
            return (
              <li key={fl.id}>
                <Button
                  style={{
                    minWidth: "0",
                    minHeight: "0",
                    padding: "0",
                    borderRadius: "100%",
                    color: isCurrentFloorLevl ? "#efefef" : "black",
                    background: isCurrentFloorLevl ? "#eb7373" : "none",
                    fontWeight: isCurrentFloorLevl ? "bold" : "normal",
                  }}
                  onClick={() => {
                    setFloorLevel(fl.id);
                  }}
                >
                  <div className="flex items-center justify-center rounded-full border-1 borde-black w-[2.5rem] h-[2.5rem]">
                    <span>{fl.name}</span>
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SchoolMap;
