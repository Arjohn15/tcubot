"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHasher = adminHasher;
// hash-admin-password.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const id = (0, uuid_1.v4)();
const username = "";
const password = "";
async function adminHasher() {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await db_1.db.execute("INSERT INTO admins (id, username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)", [id, username, hashedPassword, "Arjohn", "Banado", "Admin"]);
}
adminHasher();
