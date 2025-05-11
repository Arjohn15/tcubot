"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_login = exports.admin_login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";
const admins = db_1.db.collection("admins");
const users = db_1.db.collection("users");
const admin_login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await admins.findOne({ username });
        if (!admin || !(await bcryptjs_1.default.compare(password, admin.hashedPassword))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id.toString(), role: "admin" }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};
exports.admin_login = admin_login;
const user_login = async (req, resp) => {
    const { school_assigned_number, password } = req.body;
    try {
        const user = await users.findOne({ school_assigned_number });
        if (!user || !(await bcryptjs_1.default.compare(password, user.hashedPassword))) {
            resp.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: "user" }, JWT_SECRET, {
            expiresIn: "5h",
        });
        resp.status(200).json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        resp.status(401).json({ message: "Invalid credentials" });
    }
};
exports.user_login = user_login;
