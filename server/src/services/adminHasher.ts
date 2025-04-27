// hash-admin-password.ts
import bcrypt from "bcryptjs";
import { dbConfig } from "../config/dbConfig";
import { v4 as uuidv4 } from "uuid";

const id = uuidv4();

const username = "";
const password = "";
const first_name = "";
const last_name = "";

export async function adminHasher() {
  const hashedPassword = await bcrypt.hash(password, 10);
  await dbConfig.execute(
    "INSERT INTO admins (id, username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)",
    [id, username, hashedPassword, first_name, last_name, "Admin"]
  );
}

adminHasher();
