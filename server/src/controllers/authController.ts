import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

const admins = db.collection("admins");
const users = db.collection("users");

export const admin_login = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, password } = req.body;

    const admin = await admins.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.hashedPassword))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), role: "admin" },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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
): Promise<void> => {
  const { school_assigned_number, password } = req.body;

  try {
    const user = await users.findOne({ school_assigned_number });

    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      resp.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: "user" },
      JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    resp.status(200).json({ token });
  } catch (err: any) {
    console.error("Login error:", err);
    resp.status(401).json({ message: "Invalid credentials" });
  }
};
