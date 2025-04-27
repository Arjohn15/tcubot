"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdatePassword = exports.userUpdate = exports.user_register = exports.user_data = void 0;
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbConfig_1 = require("../config/dbConfig");
const dayjs_1 = __importDefault(require("dayjs"));
const errorHandlerMySQL_1 = __importDefault(require("../utils/errorHandlerMySQL"));
const passwordUpdateSchema_1 = require("../schema/passwordUpdateSchema");
const zod_1 = __importDefault(require("zod"));
const user_data = async (req, resp) => {
    const user_id = req.user.id;
    try {
        const [user] = await dbConfig_1.dbConfig.execute("SELECT * from users WHERE id = ?", [user_id]);
        if (!user || user.length === 0) {
            return resp.status(404).json({ message: "User not found" });
        }
        return resp.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        return resp.status(500).json({ message: "Internal server error" });
    }
};
exports.user_data = user_data;
const user_register = async (req, resp) => {
    try {
        const { first_name, last_name, email, phone_number, birthday, role, year, course, school_assigned_number, password, } = req.body;
        const query = `
        INSERT INTO registrants 
        (first_name, last_name, email, phone_number, birthday, role, year, course, school_assigned_number, password, id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const formattedBirthday = (0, dayjs_1.default)(birthday).format("YYYY-MM-DD");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const id = (0, uuid_1.v4)();
        const values = [
            first_name,
            last_name,
            email,
            phone_number,
            formattedBirthday,
            role,
            role === "student" ? year : null,
            role === "student" ? course : null,
            school_assigned_number,
            hashedPassword,
            id,
        ];
        await dbConfig_1.dbConfig.execute(query, values);
        resp.status(201).json({ message: "Registrant registered successfully!" });
    }
    catch (err) {
        (0, errorHandlerMySQL_1.default)(req, resp, err.sqlMessage, err.errno);
    }
};
exports.user_register = user_register;
const userUpdate = async (req, resp) => {
    const { data } = req.body;
    try {
        const fields = [];
        const values = [];
        const allowedFields = ["show_birthday", "show_phone_number"];
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                if (allowedFields.includes(column)) {
                    fields.push(`${column} = ?`);
                    values.push(value);
                }
                else {
                    return resp.status(400).json({ message: `Invalid field: ${key}` });
                }
            }
        }
        if (fields.length === 0) {
            return resp.status(400).json({ message: "No valid fields to update." });
        }
        values.push(req.user.id);
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        await dbConfig_1.dbConfig.execute(query, values);
        return resp.status(200).json({ message: "Update successful!" });
    }
    catch (err) {
        console.error(err);
        return resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userUpdate = userUpdate;
const userUpdatePassword = async (req, resp) => {
    try {
        passwordUpdateSchema_1.passwordUpdateSchema.parse(req.body);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            resp.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        else {
            resp.status(500).json({ message: "Unexpected error" });
        }
        return;
    }
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const [result] = await dbConfig_1.dbConfig.execute(`SELECT password FROM users WHERE id = ?`, [userId]);
        const user = result[0];
        if (!user) {
            resp.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            resp.status(401).json({ message: "Incorrect password" });
            return;
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const query = `UPDATE users SET password = ? WHERE id = ?`;
        const values = [hashedNewPassword, userId];
        await dbConfig_1.dbConfig.execute(query, values);
        resp.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};
exports.userUpdatePassword = userUpdatePassword;
