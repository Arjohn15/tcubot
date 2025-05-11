"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const sendToOpenChat_1 = require("../../../utils/sendToOpenChat");
// import { dbConfig } from "../../../config/dbConfig";
const path_1 = __importDefault(require("path"));
// import checkUserGreet from "../../../utils/checkUserGreet";
const db_1 = require("../../../config/db");
const checkUserGreet_1 = __importDefault(require("../../../utils/checkUserGreet"));
const messages = db_1.db.collection("messages");
const users = db_1.db.collection("users");
const userStudent = async (req, resp, userMessage) => {
    const userID = req.user.id;
    try {
        const insertedMessage = await messages.insertOne({
            user_id: userID,
            sender: "user",
            message: userMessage,
        });
        if (!insertedMessage.acknowledged) {
            throw new Error("An error occured. User message was not successfully inserted.");
        }
        const intentPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "userStudent", "intentPrompt.txt");
        const queryPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "userStudent", "queryPrompt.txt");
        const finalPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "userStudent", "finalPrompt.txt");
        const intentPrompt = fs_1.default
            .readFileSync(intentPromptPath, "utf-8")
            .replace("{{message}}", userMessage);
        const intentResponse = await (0, sendToOpenChat_1.sendToOpenChat)(intentPrompt);
        if (intentResponse.status !== 200) {
            throw new Error(intentResponse.message);
        }
        if (intentResponse.message.trim() === "database_query") {
            const queryPrompt = fs_1.default
                .readFileSync(queryPromptPath, "utf-8")
                .replace("[[message]]", userMessage);
            const queryResponse = await (0, sendToOpenChat_1.sendToOpenChat)(queryPrompt);
            if (queryResponse.status !== 200) {
                throw new Error(queryResponse.message);
            }
            let queryResponseParsed = JSON.parse(queryResponse.message);
            let queryResult = await users
                .find(queryResponseParsed.query, {
                projection: {
                    ...queryResponseParsed.projection,
                },
            })
                .toArray();
            if (!queryResult || queryResult.length === 0) {
                const queryFailedPrompt = `The query was failed. Inform the user that the query provided doesn't provide any result`;
                const queryFailedResponse = await (0, sendToOpenChat_1.sendToOpenChat)(queryFailedPrompt);
                if (queryFailedResponse.status !== 200) {
                    throw new Error(queryFailedResponse.message);
                }
                resp.status(200).json({ aiResponse: queryFailedResponse.message });
                return;
            }
            const queryFormattedResult = queryResult.map(({ hashedPassword, ...rest }) => rest);
            const hasGreet = await (0, checkUserGreet_1.default)(userID);
            const finalPrompt = fs_1.default
                .readFileSync(finalPromptPath, "utf-8")
                .replace("[[greet]]", hasGreet
                ? "No need to introduce yourself. Just proceed to answer the user's question."
                : "Introduce yourself (but don't ask 'how can I assist you' or anything similar) then answer the question directly.")
                .replace("[[message]]", userMessage)
                .replace("[[student]]", JSON.stringify(queryFormattedResult));
            const finalResponse = await (0, sendToOpenChat_1.sendToOpenChat)(finalPrompt);
            if (finalResponse.status !== 200) {
                throw new Error(finalResponse.message);
            }
            // console.log(JSON.parse(queryResponse.message));
            // const [aiInsertedMessage]: [ResultSetHeader, any] = await dbConfig.query(
            //   "INSERT INTO messages (id, user_id, sender, message) VALUES (?, ?, ?, ?)",
            //   [uuidv4(), userID, "ai", finalResponse.message]
            // );
            // if (!aiInsertedMessage || aiInsertedMessage.affectedRows === 0) {
            //   throw new Error(
            //     "An error occured. AI message was not successfully inserted."
            //   );
            // }
            resp.status(200).json({ aiResponse: finalResponse.message });
        }
        if (intentResponse.message.trim() === "general_question") {
            const timelinePromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "userStudent", "timelinePrompt.txt");
            const timelinePrompt = fs_1.default
                .readFileSync(timelinePromptPath, "utf-8")
                .replace("[[message]]", userMessage);
            const timelineResponse = await (0, sendToOpenChat_1.sendToOpenChat)(timelinePrompt);
            const timelineResponseMessage = timelineResponse.message.trim();
            if (timelineResponse.status !== 200) {
                throw new Error(intentResponse.message);
            }
            if (timelineResponseMessage === "nonFollow_up") {
                const nonFollowUpPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "userStudent", "nonFollowUpPrompt.txt");
                const nonFollowUpPrompt = fs_1.default
                    .readFileSync(nonFollowUpPromptPath, "utf-8")
                    .replace("[[message]]", userMessage);
                const nonFollowUpResponse = await (0, sendToOpenChat_1.sendToOpenChat)(nonFollowUpPrompt);
                if (nonFollowUpResponse.status !== 200) {
                    throw new Error(nonFollowUpResponse.message);
                }
                resp.status(200).json({ aiResponse: nonFollowUpResponse.message });
                return;
            }
            if (timelineResponseMessage === "follow_up") {
                console.log("ok");
            }
        }
    }
    catch (err) {
        console.error(err);
        resp.status(500).json({
            message: err.message,
        });
    }
};
exports.default = userStudent;
