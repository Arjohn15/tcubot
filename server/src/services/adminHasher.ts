// hash-admin-password.ts
import bcrypt from "bcryptjs";
import { db } from "../config/db";

const admins = db.collection("admins");

const username = "aj";
const password = "aj123";
const first_name = "Arjohn";
const last_name = "Banado";

export async function adminHasher() {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await admins.insertOne({ username, hashedPassword, first_name, last_name });
    console.log("Admin registration successful!");
  } catch (err: any) {
    console.error("Error during admin registration:", err);
  }
}

adminHasher();
