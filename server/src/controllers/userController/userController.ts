import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { passwordUpdateSchema } from "../../schema/passwordUpdateSchema";
import z from "zod";
import userWithAI from "./userWithAI";
import { db } from "../../config/db";
import { ObjectId } from "mongodb";

const registrants = db.collection("registrants");
const users = db.collection("users");
const messages = db.collection("messages");
const schedules = db.collection("schedules");
const recent_visits = db.collection("recent_visits");

export const user_data = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const user_id = (req as any).user.id;

  try {
    const userData = await users.findOne(
      { _id: new ObjectId(`${user_id}`) },
      {
        projection: {
          hashedPassword: 0,
        },
      }
    );

    resp.status(200).json({ user: userData });
  } catch (err: any) {
    console.error(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

export const user_register = async (req: Request, resp: Response) => {
  console.log(req.body);
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      birthday,
      role,
      year,
      course,
      school_assigned_number,
      password,
      section,
    } = req.body;

    const formattedBirthday = dayjs(birthday).format("YYYY-MM-DD");
    const hashedPassword = await bcrypt.hash(password, 10);
    const isStudent = role === "student";

    await registrants.insertOne({
      first_name,
      last_name,
      email,
      phone_number,
      formattedBirthday,
      role,
      year: isStudent ? year : null,
      course: isStudent ? course : null,
      section: isStudent ? section : null,
      school_assigned_number,
      hashedPassword,
      show_birthday: 1,
      show_phone_number: 1,
    });

    resp.status(201).json({ message: "Registrant registered successfully!" });
  } catch (err: any) {
    console.error("Error during user registration:", err);

    resp.status(500).json({
      message: "An error occurred during registration.",
      error: err.message,
    });
  }
};

export const userUpdate = async (
  req: Request,
  resp: Response
): Promise<void> => {
  try {
    const values: any[][] = [];

    const allowedFields = ["show_birthday", "show_phone_number"];

    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined) {
        const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (allowedFields.includes(column)) {
          values.push([column, value]);
        } else {
          resp.status(400).json({ message: `Invalid field: ${key}` });
          return;
        }
      }
    }

    const userID = (req as any).user.id;

    const formattedValues = Object.fromEntries(values);

    await users.updateOne(
      { _id: new ObjectId(`${userID}`) },
      { $set: formattedValues }
    );

    resp.status(200).json({ message: "Update successful!" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userUpdatePassword = async (
  req: Request,
  resp: Response
): Promise<void> => {
  try {
    passwordUpdateSchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      resp.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    } else {
      resp.status(500).json({ message: "Unexpected error" });
    }
    return;
  }

  const { oldPassword, newPassword } = req.body;
  const userId = (req as any).user.id;

  try {
    const user = await users.findOne({ _id: new ObjectId(`${userId}`) });

    if (!user) {
      resp.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);

    if (!isMatch) {
      resp.status(401).json({ message: "Incorrect old password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await users.updateOne(
      { _id: new ObjectId(`${user._id}`) },
      { $set: { hashedPassword: hashedNewPassword } }
    );

    resp.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later" });
  }
};

export const userDelete = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const userID = req.params.id;

  try {
    const result = await users.deleteOne({ _id: new ObjectId(`${userID}`) });

    if (result.deletedCount === 0) {
      resp.status(404).json({ message: "User not found" });
      return;
    }

    resp.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "An error occurred while deleting the user" });
  }
};

export const userUpdateByAdmin = async (
  req: Request,
  resp: Response
): Promise<void> => {
  try {
    const values: any[][] = [];

    const allowedFields = [
      "first_name",
      "last_name",
      "formatted_birthday",
      "email",
      "phone_number",
      "year",
      "course",
      "school_assigned_number",
      "role",
      "section",
    ];

    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined) {
        const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (allowedFields.includes(column)) {
          values.push([column, value]);
        } else {
          resp.status(400).json({ message: `Invalid field: ${key}` });
          return;
        }
      }
    }

    if (values.length === 0) {
      resp.status(400).json({ message: "No valid fields to update." });
      return;
    }

    const userID = req.params.id;

    const formattedValues = Object.fromEntries(values);

    await users.updateOne(
      { _id: new ObjectId(`${userID}`) },
      { $set: formattedValues }
    );

    resp.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userChatAI = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const { message } = req.body;

  userWithAI(req, resp, message);
};

export const userChatHistory = async (req: Request, resp: Response) => {
  const userID = (req as any).user.id;

  try {
    const chatHistory = await messages.find({ user_id: userID }).toArray();

    resp.status(200).json({ chatHistory });
  } catch (err: any) {
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userProfessorSchedule = async (req: Request, resp: Response) => {
  delete req.body.timeRange;

  const userID = (req as any).user.id;

  try {
    const values: any[][] = [];

    const allowedFields = [
      "time_start",
      "time_end",
      "room",
      "subject",
      "assigned_section",
      "code",
      "day",
      "professor_name",
    ];

    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined) {
        const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (allowedFields.includes(column)) {
          values.push([column, value]);
        } else {
          resp.status(400).json({ message: `Invalid field: ${key}` });
          return;
        }
      }
    }

    const formattedValues = Object.fromEntries(values);

    await schedules.insertOne({ ...formattedValues, professor_id: userID });

    resp.status(200).json({ message: "New schedule successfully created" });
  } catch (err: any) {
    console.error(err);

    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userProfessorAllSchedule = async (
  req: Request,
  resp: Response
) => {
  const { day } = req.body;
  const userID = (req as any).user.id;

  try {
    const allSchedules = await schedules
      .find({ professor_id: userID, day }, { projection: { professor_id: 0 } })
      .toArray();

    resp.status(200).json({ schedules: allSchedules });
  } catch (err: any) {
    console.error(err);

    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userProfessorEditSchedule = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const userID = req.params.id;

  try {
    const values: any[][] = [];

    const allowedFields = [
      "time_start",
      "time_end",
      "room",
      "subject",
      "assigned_section",
      "code",
      "day",
    ];

    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined) {
        const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (allowedFields.includes(column)) {
          values.push([column, value]);
        } else {
          resp.status(400).json({ message: `Invalid field: ${key}` });
          return;
        }
      }
    }

    if (values.length === 0) {
      resp.status(400).json({ message: "No valid fields to update." });
      return;
    }

    const formattedValues = Object.fromEntries(values);

    await schedules.updateOne(
      { _id: new ObjectId(`${userID}`) },
      { $set: formattedValues }
    );

    resp.status(200).json({ message: "Schedule updated successfully!" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userProfessorDeleteSchedule = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const id = req.params.id;

  try {
    const deletedSchedule = await schedules.deleteOne({
      _id: new ObjectId(`${id}`),
    });

    if (!deletedSchedule.acknowledged) {
      resp.status(404).json({
        message: "Schedule delete not successful. Schedule not found",
      });
      return;
    }
    resp.status(200).json({ message: "Schedule successfully deleted!" });
  } catch (err: any) {
    console.error(err);

    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userVisit = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const userID = req.params.id;

  try {
    const userInfo = await users.findOne(
      { _id: new ObjectId(`${userID}`) },
      {
        projection: {
          hashedPassword: 0,
        },
      }
    );

    if (!userInfo) {
      resp.status(404).json({ message: "User not found." });
      return;
    }

    resp.status(200).json({ userInfo });
  } catch (err: any) {
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const userWeekdaySchedule = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const weekDay = req.query.weekDay;
  const section = req.query.section;
  const role = req.query.role;
  const userID = req.query.id;

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  try {
    let weekDaySchedule;

    if (role === "student") {
      weekDaySchedule = await schedules
        .find({
          assigned_section: section,
          day: Number(weekDay),
        })
        .toArray();
    }

    if (role === "professor") {
      weekDaySchedule = await schedules
        .find({
          professor_id: userID,
          day: Number(weekDay),
        })
        .toArray();
    }

    if (!weekDaySchedule || weekDaySchedule.length === 0) {
      resp
        .status(404)
        .json({ message: `No ${weekdays[Number(weekDay)]} schedule.` });
      return;
    }

    resp.status(200).json({ weekDaySchedule });
  } catch (err) {
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getUser = async (req: Request, resp: Response): Promise<void> => {
  const userID = req.params.id;

  try {
    const user = await users.findOne(
      { _id: new ObjectId(`${userID}`) },
      {
        projection: {
          _id: 0,
          first_name: 1,
          last_name: 1,
        },
      }
    );

    if (!user) {
      resp.status(404).json({ message: "User not found." });
      return;
    }

    resp.status(200).json({ user });
  } catch (err: any) {
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const addRecentUserVisit = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const { visitee_id, visitee_name } = req.body;
  const userID = (req as any).user.id;

  try {
    const recentVisit = await recent_visits.findOne({
      visitor_id: userID,
      visitee_id: visitee_id,
    });

    if (!recentVisit) {
      const recentVisitInsert = await recent_visits.insertOne({
        visitor_id: userID,
        visitee_id,
        visitee_name,
      });

      if (!recentVisitInsert.acknowledged || !recentVisitInsert.insertedId) {
        throw new Error(
          "Recent visit information is not successfully inserted."
        );
      }

      resp.status(200).json({
        message: "Recent visit information is successfully inserted.",
      });
    }
  } catch (err: any) {
    resp.status(500).json({
      message: err.message || "Something went wrong. Please try again later.",
    });
  }
};

export const getRecentUserVisits = async (
  req: Request,
  resp: Response
): Promise<void> => {
  const userID = (req as any).user.id;

  try {
    const visits = await recent_visits.find({ visitor_id: userID }).toArray();
    resp.status(200).json({ visits });
  } catch (err: any) {
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
