"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const dayjs_1 = __importDefault(require("dayjs"));
const handleUserRegister = async (req, resp) => {
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
            year,
            course,
            school_assigned_number,
            hashedPassword,
            id,
        ];
        await db_1.db.execute(query, values);
        resp.status(201).json({ message: "Registrant registered successfully!" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ error: "Something went wrong during registration." });
    }
};
exports.default = handleUserRegister;
