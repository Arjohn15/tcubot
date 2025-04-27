"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_login = exports.admin_login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConfig_1 = require("../config/dbConfig");
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";
const admin_login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await dbConfig_1.dbConfig.execute("SELECT * FROM admins WHERE username = ?", [username]);
        const user = rows[0];
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: "admin" }, JWT_SECRET, {
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
        const [result] = await dbConfig_1.dbConfig.execute("SELECT school_assigned_number, password, id FROM users WHERE school_assigned_number = ?", [school_assigned_number]);
        const user = result[0];
        if (!user.school_assigned_number ||
            !(await bcryptjs_1.default.compare(password, user.password))) {
            return resp.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: "user" }, JWT_SECRET, {
            expiresIn: "5h",
        });
        return resp.status(200).json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        return resp.status(401).json({ message: "Invalid credentials" });
    }
};
exports.user_login = user_login;
