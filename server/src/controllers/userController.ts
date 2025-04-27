import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { dbConfig } from "../config/dbConfig";
import dayjs from "dayjs";
import errorHandlerMySQL from "../utils/errorHandlerMySQL";
import { passwordUpdateSchema } from "../schema/passwordUpdateSchema";
import z from "zod";

export const user_data = async (req: Request, resp: Response): Promise<any> => {
  const user_id = (req as any).user.id;

  try {
    const [user]: any = await dbConfig.execute(
      "SELECT * from users WHERE id = ?",
      [user_id]
    );
    if (!user || user.length === 0) {
      return resp.status(404).json({ message: "User not found" });
    }

    return resp.status(200).json(user);
  } catch (err: any) {
    console.error(err);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

export const user_register = async (req: Request, resp: Response) => {
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
    } = req.body;

    const query = `
        INSERT INTO registrants 
        (first_name, last_name, email, phone_number, birthday, role, year, course, school_assigned_number, password, id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const formattedBirthday = dayjs(birthday).format("YYYY-MM-DD");
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const values = [
      first_name,
      last_name,
      email,
      phone_number,
      formattedBirthday,
      role,
      role === "student" ? year : null,
      role === "student" ? course : null,
      school_assigned_number,
      hashedPassword,
      id,
    ];

    await dbConfig.execute(query, values);

    resp.status(201).json({ message: "Registrant registered successfully!" });
  } catch (err: any) {
    errorHandlerMySQL(req, resp, err.sqlMessage, err.errno);
  }
};

export const userUpdate = async (
  req: Request,
  resp: Response
): Promise<any> => {
  const { data } = req.body;

  try {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = ["show_birthday", "show_phone_number"];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (allowedFields.includes(column)) {
          fields.push(`${column} = ?`);
          values.push(value);
        } else {
          return resp.status(400).json({ message: `Invalid field: ${key}` });
        }
      }
    }

    if (fields.length === 0) {
      return resp.status(400).json({ message: "No valid fields to update." });
    }

    values.push((req as any).user.id);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await dbConfig.execute(query, values);

    return resp.status(200).json({ message: "Update successful!" });
  } catch (err) {
    console.error(err);
    return resp
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
    const [result]: any[] = await dbConfig.execute(
      `SELECT password FROM users WHERE id = ?`,
      [userId]
    );

    const user = result[0];

    if (!user) {
      resp.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      resp.status(401).json({ message: "Incorrect password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const query = `UPDATE users SET password = ? WHERE id = ?`;
    const values = [hashedNewPassword, userId];

    await dbConfig.execute(query, values);

    resp.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    resp
      .status(500)
      .json({ message: "Something went wrong. Please try again later" });
  }
};
