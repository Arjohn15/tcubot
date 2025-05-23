import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI!);

export const db = client.db(process.env.MONGODB_DB);

export async function connectToDB() {
  await client.connect();
}
