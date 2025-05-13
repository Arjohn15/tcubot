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
  try {
  } catch (err: any) {}
};
