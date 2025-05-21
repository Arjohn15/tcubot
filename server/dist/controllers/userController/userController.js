"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWeekdaySchedule = exports.userVisit = exports.userProfessorDeleteSchedule = exports.userProfessorEditSchedule = exports.userProfessorAllSchedule = exports.userProfessorSchedule = exports.userChatHistory = exports.userChatAI = exports.userUpdateByAdmin = exports.userDelete = exports.userUpdatePassword = exports.userUpdate = exports.user_register = exports.user_data = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dayjs_1 = __importDefault(require("dayjs"));
const passwordUpdateSchema_1 = require("../../schema/passwordUpdateSchema");
const zod_1 = __importDefault(require("zod"));
const userWithAI_1 = __importDefault(require("./userWithAI"));
const db_1 = require("../../config/db");
const mongodb_1 = require("mongodb");
const registrants = db_1.db.collection("registrants");
const users = db_1.db.collection("users");
const messages = db_1.db.collection("messages");
const schedules = db_1.db.collection("schedules");
const user_data = async (req, resp) => {
    const user_id = req.user.id;
    try {
        const userData = await users.findOne({ _id: new mongodb_1.ObjectId(`${user_id}`) }, {
            projection: {
                hashedPassword: 0,
            },
        });
        resp.status(200).json({ user: userData });
    }
    catch (err) {
        console.error(err);
        resp.status(500).json({ message: "Internal server error" });
    }
};
exports.user_data = user_data;
const user_register = async (req, resp) => {
    console.log(req.body);
    try {
        const { first_name, last_name, email, phone_number, birthday, role, year, course, school_assigned_number, password, section, } = req.body;
        const formattedBirthday = (0, dayjs_1.default)(birthday).format("YYYY-MM-DD");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const isStudent = role === "student";
        await registrants.insertOne({
            first_name,
            last_name,
            email,
            phone_number,
            formattedBirthday,
            role,
            year: isStudent ? year : null,
            course: isStudent ? course : null,
            section: isStudent ? section : null,
            school_assigned_number,
            hashedPassword,
            show_birthday: 1,
            show_phone_number: 1,
        });
        resp.status(201).json({ message: "Registrant registered successfully!" });
    }
    catch (err) {
        console.error("Error during user registration:", err);
        resp.status(500).json({
            message: "An error occurred during registration.",
            error: err.message,
        });
    }
};
exports.user_register = user_register;
const userUpdate = async (req, resp) => {
    try {
        const values = [];
        const allowedFields = ["show_birthday", "show_phone_number"];
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                if (allowedFields.includes(column)) {
                    values.push([column, value]);
                }
                else {
                    resp.status(400).json({ message: `Invalid field: ${key}` });
                    return;
                }
            }
        }
        const userID = req.user.id;
        const formattedValues = Object.fromEntries(values);
        await users.updateOne({ _id: new mongodb_1.ObjectId(`${userID}`) }, { $set: formattedValues });
        resp.status(200).json({ message: "Update successful!" });
    }
    catch (err) {
        console.error(err);
        resp
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
        const user = await users.findOne({ _id: new mongodb_1.ObjectId(`${userId}`) });
        if (!user) {
            resp.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.hashedPassword);
        if (!isMatch) {
            resp.status(401).json({ message: "Incorrect old password" });
            return;
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await users.updateOne({ _id: new mongodb_1.ObjectId(`${user._id}`) }, { $set: { hashedPassword: hashedNewPassword } });
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
const userDelete = async (req, resp) => {
    const userID = req.params.id;
    try {
        const result = await users.deleteOne({ _id: new mongodb_1.ObjectId(`${userID}`) });
        if (result.deletedCount === 0) {
            resp.status(404).json({ message: "User not found" });
            return;
        }
        resp.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "An error occurred while deleting the user" });
    }
};
exports.userDelete = userDelete;
const userUpdateByAdmin = async (req, resp) => {
    try {
        const values = [];
        const allowedFields = [
            "first_name",
            "last_name",
            "formatted_birthday",
            "email",
            "phone_number",
            "year",
            "course",
            "school_assigned_number",
            "role",
            "section",
        ];
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                if (allowedFields.includes(column)) {
                    values.push([column, value]);
                }
                else {
                    resp.status(400).json({ message: `Invalid field: ${key}` });
                    return;
                }
            }
        }
        if (values.length === 0) {
            resp.status(400).json({ message: "No valid fields to update." });
            return;
        }
        const userID = req.params.id;
        const formattedValues = Object.fromEntries(values);
        await users.updateOne({ _id: new mongodb_1.ObjectId(`${userID}`) }, { $set: formattedValues });
        resp.status(200).json({ message: "Update successful" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userUpdateByAdmin = userUpdateByAdmin;
const userChatAI = async (req, resp) => {
    const { message } = req.body;
    (0, userWithAI_1.default)(req, resp, message);
};
exports.userChatAI = userChatAI;
const userChatHistory = async (req, resp) => {
    const userID = req.user.id;
    try {
        const chatHistory = await messages.find({ user_id: userID }).toArray();
        resp.status(200).json({ chatHistory });
    }
    catch (err) {
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userChatHistory = userChatHistory;
const userProfessorSchedule = async (req, resp) => {
    delete req.body.timeRange;
    const userID = req.user.id;
    try {
        const values = [];
        const allowedFields = [
            "time_start",
            "time_end",
            "room",
            "subject",
            "assigned_section",
            "code",
            "day",
        ];
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                if (allowedFields.includes(column)) {
                    values.push([column, value]);
                }
                else {
                    resp.status(400).json({ message: `Invalid field: ${key}` });
                    return;
                }
            }
        }
        const formattedValues = Object.fromEntries(values);
        await schedules.insertOne({ ...formattedValues, professor_id: userID });
        resp.status(200).json({ message: "New schedule successfully created" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userProfessorSchedule = userProfessorSchedule;
const userProfessorAllSchedule = async (req, resp) => {
    const { day } = req.body;
    const userID = req.user.id;
    try {
        const allSchedules = await schedules
            .find({ professor_id: userID, day }, { projection: { professor_id: 0 } })
            .toArray();
        resp.status(200).json({ schedules: allSchedules });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userProfessorAllSchedule = userProfessorAllSchedule;
const userProfessorEditSchedule = async (req, resp) => {
    const userID = req.params.id;
    try {
        const values = [];
        const allowedFields = [
            "time_start",
            "time_end",
            "room",
            "subject",
            "assigned_section",
            "code",
            "day",
        ];
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                const column = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                if (allowedFields.includes(column)) {
                    values.push([column, value]);
                }
                else {
                    resp.status(400).json({ message: `Invalid field: ${key}` });
                    return;
                }
            }
        }
        if (values.length === 0) {
            resp.status(400).json({ message: "No valid fields to update." });
            return;
        }
        const formattedValues = Object.fromEntries(values);
        await schedules.updateOne({ _id: new mongodb_1.ObjectId(`${userID}`) }, { $set: formattedValues });
        resp.status(200).json({ message: "Schedule updated successfully!" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userProfessorEditSchedule = userProfessorEditSchedule;
const userProfessorDeleteSchedule = async (req, resp) => {
    const id = req.params.id;
    try {
        const deletedSchedule = await schedules.deleteOne({
            _id: new mongodb_1.ObjectId(`${id}`),
        });
        if (!deletedSchedule.acknowledged) {
            resp.status(404).json({
                message: "Schedule delete not successful. Schedule not found",
            });
            return;
        }
        resp.status(200).json({ message: "Schedule successfully deleted!" });
    }
    catch (err) {
        console.error(err);
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userProfessorDeleteSchedule = userProfessorDeleteSchedule;
const userVisit = async (req, resp) => {
    const userID = req.params.id;
    try {
        const userInfo = await users.findOne({ _id: new mongodb_1.ObjectId(`${userID}`) }, {
            projection: {
                hashedPassword: 0,
            },
        });
        if (!userInfo) {
            resp.status(404).json({ message: "User not found." });
            return;
        }
        resp.status(200).json({ userInfo });
    }
    catch (err) {
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userVisit = userVisit;
const userWeekdaySchedule = async (req, resp) => {
    const weekDay = req.query.weekDay;
    const section = req.query.section;
    const role = req.query.role;
    const userID = req.query.id;
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    try {
        let weekDaySchedule;
        if (role === "student") {
            weekDaySchedule = await schedules
                .find({
                assigned_section: section,
                day: Number(weekDay),
            })
                .toArray();
        }
        if (role === "professor") {
            weekDaySchedule = await schedules
                .find({
                professor_id: userID,
                day: Number(weekDay),
            })
                .toArray();
        }
        if (!weekDaySchedule || weekDaySchedule.length === 0) {
            resp
                .status(404)
                .json({ message: `No ${weekdays[Number(weekDay)]} schedule.` });
            return;
        }
        resp.status(200).json({ weekDaySchedule });
    }
    catch (err) {
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.userWeekdaySchedule = userWeekdaySchedule;
