"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChatAI = exports.userUpdateByAdmin = exports.userDelete = exports.userUpdatePassword = exports.userUpdate = exports.user_register = exports.user_data = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dayjs_1 = __importDefault(require("dayjs"));
const passwordUpdateSchema_1 = require("../../schema/passwordUpdateSchema");
const zod_1 = __importDefault(require("zod"));
const userStudent_1 = __importDefault(require("./userStudent/userStudent"));
const db_1 = require("../../config/db");
const mongodb_1 = require("mongodb");
const registrants = db_1.db.collection("registrants");
const users = db_1.db.collection("users");
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
    try {
        const { first_name, last_name, email, phone_number, birthday, role, year, course, school_assigned_number, password, } = req.body;
        const formattedBirthday = (0, dayjs_1.default)(birthday).format("YYYY-MM-DD");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const addedYear = role === "student" ? year : null;
        const addedCourse = role === "student" ? course : null;
        await registrants.insertOne({
            first_name,
            last_name,
            email,
            phone_number,
            formattedBirthday,
            role,
            year: addedYear,
            course: addedCourse,
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
    const userID = req.user.id;
    const { subject, message } = req.body;
    switch (subject) {
        case "student": {
            (0, userStudent_1.default)(req, resp, message);
            break;
        }
        case "professor": {
            break;
        }
        case "personnel": {
            break;
        }
        default: {
        }
    }
};
exports.userChatAI = userChatAI;
// const userID = (req as any).user.id;
// const { subject, message } = req.body;
// let prompt;
// try {
//   switch (subject) {
//     case "student": {
//       const [userMessage]: [ResultSetHeader, any] = await dbConfig.query(
//         "INSERT INTO messages (id, user_id, sender, message) VALUES (?, ?, ?, ?)",
//         [uuidv4(), userID, "user", message]
//       );
//       if (!userMessage || userMessage.affectedRows === 0) {
//         throw new Error(
//           "An error occured. User message was not successfully inserted 1."
//         );
//       }
//       const initPrompt = `You have a MySQL table (users) with columns (first_name, last_name, email, phone_number, role, year, course, school_assigned_number, id).
//       The user is inquiring about a student: ${message}. Make a MySQL query based on this. Answer only no explanation. If user's message is not a question or just a general statement, don't create a query and just response back and say "nonquery"`;
//       const initAIQuery = await sendToOpenChat(initPrompt);
//       if (initAIQuery.status !== 200) {
//         resp.status(initAIQuery.status).json({ error: initAIQuery.message });
//         return;
//       }
//       if (initAIQuery.message === "nonquery") {
//         const scopeMessage =
//           "Oops! That’s not something we’re built for, but we’re happy to help with anything that’s within our scope.";
//         const [aiMessage]: [ResultSetHeader, any] = await dbConfig.query(
//           "INSERT INTO messages (id, user_id, sender, message) VALUES (?, ?, ?, ?)",
//           [uuidv4(), userID, "ai", scopeMessage]
//         );
//         if (!aiMessage || aiMessage.affectedRows === 0) {
//           throw new Error(
//             "An error occured. AI message was not successfully inserted."
//           );
//         }
//         resp.status(200).json({ aiResponse: scopeMessage });
//         return;
//       }
//       console.log(initAIQuery.message, initPrompt);
//       const [initAIQueryResult]: any[] = await dbConfig.execute(
//         initAIQuery.message
//       );
//       if (!initAIQueryResult || initAIQueryResult.length === 0) {
//         const notFoundResponse = await sendToOpenChat(
//           "The query didn't find any result from the database. Make a statement informing user about it."
//         );
//         if (notFoundResponse.status !== 200) {
//           resp
//             .status(notFoundResponse.status)
//             .json({ error: notFoundResponse.message });
//           return;
//         }
//         resp.status(200).json({
//           aiResponse: notFoundResponse.message,
//         });
//         return;
//       }
//       const [messages]: any[] = await dbConfig.execute(
//         "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC",
//         [userID]
//       );
//       if (!messages || messages.length === 0) {
//         resp.status(404).json({
//           message: "Chat history was not retrieved. User can't be found.",
//         });
//         return;
//       }
//       prompt = `
//       “You are directly talking right now to a user of the app. These are your context for answering user's message:
//      Chat history: ${JSON.stringify(messages)}.)
//      Student Retrieved Data: ${JSON.stringify(initAIQueryResult)}
//       Here are the rules you need to follow:
//       1.) Always include this statement in addition to the answer you are providing to the user: View more details about [first or last name of the pinpointed data depending on what the user is referring to that data] by clicking  <a href=”/user/visit/:[the id of pinpointed data]”>HERE</a>.
//       2.) Just answer directly the question and provide the necessary information (Don't give user extra information just a direct answer only.).
//       Here's the user message: ${message}
//       `;
//       const aiResponse = await sendToOpenChat(prompt);
//       if (aiResponse.status !== 200) {
//         resp.status(aiResponse.status).json({ error: aiResponse.message });
//         return;
//       }
//       const [aiMessage]: [ResultSetHeader, any] = await dbConfig.query(
//         "INSERT INTO messages (id, user_id, sender, message) VALUES (?, ?, ?, ?)",
//         [uuidv4(), userID, "ai", aiResponse.message]
//       );
//       if (!aiMessage || aiMessage.affectedRows === 0) {
//         throw new Error(
//           "An error occured. AI message was not successfully inserted."
//         );
//       }
//       resp.status(200).json({ aiResponse: aiResponse.message });
//       break;
//     }
//     case "professor": {
//     }
//     case "personnel": {
//     }
//     default: {
//       resp.status(400).json({ message: "Subject matter is invalid." });
//       return;
//     }
//   }
// } catch (err: any) {
//   console.error("Server error:", err);
//   resp.status(500).json({ message: "Internal server error" });
// }
