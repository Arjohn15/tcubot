"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHasher = adminHasher;
// hash-admin-password.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const admins = db_1.db.collection("admins");
const username = "aj";
const password = "aj123";
const first_name = "Arjohn";
const last_name = "Banado";
async function adminHasher() {
  const hashedPassword = await bcryptjs_1.default.hash(password, 10);
  try {
    await admins.insertOne({ username, hashedPassword, first_name, last_name });
    console.log("Admin registration successful!");
  } catch (err) {
    console.error("Error during admin registration:", err);
  }
}
adminHasher();
