import dayjs from "dayjs";
import { db } from "../../../config/db";
import { ObjectId } from "mongodb";

const users = db.collection("users");

export interface UserInfoType {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  formattedBirthday: string;
  role: "student" | "professor" | "personnel";
  year: string | null;
  course: string | null;
  section: string | null;
  school_assigned_number: string;
  show_birthday: 0 | 1;
  show_phone_number: 0 | 1;
}

async function setUserInfo(userID: string): Promise<string> {
  try {
    const selfInfo = await users.findOne<UserInfoType>(
      { _id: new ObjectId(`${userID}`) },
      { projection: { hashedPassword: 0, _id: 0 } }
    );

    return `
------------------------
User ID              : ${userID} (Don't provide this to response directly.)
First Name           : ${selfInfo?.first_name}
Last Name            : ${selfInfo?.last_name}
Email                : ${selfInfo?.email}
Phone Number         : ${
      selfInfo?.show_phone_number ? selfInfo?.phone_number : "not available"
    }
Birthday             : ${
      selfInfo?.show_birthday
        ? dayjs(selfInfo?.formattedBirthday).format("MMMM D, YYYY")
        : "not available"
    }
Role                 : ${selfInfo?.role.toUpperCase()}
Year Level           : ${
      selfInfo?.year ? selfInfo.year : "(No year due to being a professor)"
    }
Course               : ${
      selfInfo?.course
        ? selfInfo.course.toUpperCase()
        : "(No course due to being a professor)"
    }
Section              : ${
      selfInfo?.section
        ? selfInfo.section.toUpperCase()
        : "(No section due to being a professor)"
    }
School ID Number     : ${selfInfo?.school_assigned_number}`.trim();
  } catch {
    return "Not available";
  }
}

export default setUserInfo;
