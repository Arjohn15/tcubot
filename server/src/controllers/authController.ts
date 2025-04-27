import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConfig } from "../config/dbConfig";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

export const admin_login = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, password } = req.body;
    const [rows]: any = await dbConfig.execute(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later" });
  }
};

export const user_login = async (
  req: Request,
  resp: Response
): Promise<any> => {
  const { school_assigned_number, password } = req.body;

  try {
    const [result]: any = await dbConfig.execute(
      "SELECT school_assigned_number, password, id FROM users WHERE school_assigned_number = ?",
      [school_assigned_number]
    );

    const user = result[0];

    if (
      !user.school_assigned_number ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return resp.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: "user" }, JWT_SECRET, {
      expiresIn: "5h",
    });

    return resp.status(200).json({ token });
  } catch (err: any) {
    console.error("Login error:", err);
    return resp.status(401).json({ message: "Invalid credentials" });
  }
};
