import { ObjectId } from "mongodb";
import { db } from "../../../config/db";
import { UserInfoType } from "./setUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const users = db.collection("users");
const schedules = db.collection("schedules");

export interface UserScheduleType {
  day: number;
  time_start: string;
  time_end: string;
  room: string;
  subject: string;
  code: string;
  assigned_section: string;
  professor_id: string;
  first_name: string;
  last_name: string;
}

const dayMap: { [key: number]: string } = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

async function setUserSchedule(userID: string) {
  try {
    const selfInfo = await users.findOne<UserInfoType>(
      { _id: new ObjectId(userID) },
      { projection: { hashedPassword: 0 } }
    );

    const selfSchedule = await schedules
      .find<UserScheduleType>(
        {
          $or: [
            { assigned_section: selfInfo?.section },
            { professor_id: selfInfo?._id?.toString() },
          ],
        },
        { projection: { _id: 0 } }
      )
      .toArray();

    const selfProfsSchedule = await Promise.all(
      selfSchedule.map(async ({ professor_id, ...ss }) => {
        const selfProfSchedule = await users.findOne(
          {
            _id: new ObjectId(professor_id),
          },
          { projection: { _id: 0, first_name: 1, last_name: 1 } }
        );

        return { ...ss, ...selfProfSchedule };
      })
    );

    if (selfProfsSchedule.length === 0) {
      return "Schedule not available";
    } else {
      return selfProfsSchedule
        .map((item) => {
          const startTime = dayjs(item.time_start, "HH:mm").format("h:mm A");
          const endTime = dayjs(item.time_end, "HH:mm").format("h:mm A");
          return `
          ------------------------
Day                  : ${dayMap[item.day] || "Unknown"}
Time                 : ${startTime} - ${endTime}
Room                 : ${item.room}
Subject              : ${item.subject}
Code                 : ${item.code}
Section              : ${item.assigned_section.toUpperCase()}
Professor            : ${item.first_name} ${item.last_name}
`.trim();
        })
        .join("\n\n");
    }
  } catch {
    return "Schedule not available";
  }
}

export default setUserSchedule;
