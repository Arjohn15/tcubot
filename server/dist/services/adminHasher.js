"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHasher = adminHasher;
// hash-admin-password.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbConfig_1 = require("../config/dbConfig");
const uuid_1 = require("uuid");
const id = (0, uuid_1.v4)();
const username = "";
const password = "";
const first_name = "";
const last_name = "";
async function adminHasher() {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await dbConfig_1.dbConfig.execute("INSERT INTO admins (id, username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)", [id, username, hashedPassword, first_name, last_name, "Admin"]);
}
adminHasher();
