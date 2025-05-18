"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const sendToOpenChat_1 = require("../../utils/sendToOpenChat");
const path_1 = __importDefault(require("path"));
const db_1 = require("../../config/db");
const checkUserGreet_1 = __importDefault(require("../../utils/checkUserGreet"));
const queryChecker_1 = __importDefault(require("../../utils/queryChecker"));
const messages = db_1.db.collection("messages");
const users = db_1.db.collection("users");
const data_contexts = db_1.db.collection("data_contexts");
const userWithAI = async (req, resp, userMessage) => {
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
        const intentPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "intentPrompt.txt");
        const queryPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "queryPrompt.txt");
        const finalPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "finalPrompt.txt");
        const intentPrompt = fs_1.default
            .readFileSync(intentPromptPath, "utf-8")
            .replace("{{message}}", userMessage);
        const intentResponse = await (0, sendToOpenChat_1.sendToOpenChat)(intentPrompt);
        if (intentResponse.status !== 200) {
            throw new Error(intentResponse.message);
        }
        if (intentResponse.message.trim() === "database_query") {
            const timelinePromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "timelinePrompt.txt");
            const timelinePrompt = fs_1.default
                .readFileSync(timelinePromptPath, "utf-8")
                .replace("[[message]]", userMessage);
            const timelineResponse = await (0, sendToOpenChat_1.sendToOpenChat)(timelinePrompt);
            const timelineResponseMessage = timelineResponse.message.trim();
            if (timelineResponse.status !== 200) {
                throw new Error(intentResponse.message);
            }
            if (timelineResponseMessage === "newFollow_up" ||
                timelineResponseMessage === "A: newFollow_up") {
                const queryPrompt = fs_1.default
                    .readFileSync(queryPromptPath, "utf-8")
                    .replace("[[message]]", userMessage);
                const queryResponse = await (0, sendToOpenChat_1.sendToOpenChat)(queryPrompt);
                if (queryResponse.status !== 200) {
                    throw new Error(queryResponse.message);
                }
                let queryResponseChecked = (0, queryChecker_1.default)(queryResponse.message);
                let queryResponseParsed = JSON.parse(queryResponseChecked);
                let queryResult = await users
                    .find(queryResponseParsed.query, {
                    projection: {
                        ...queryResponseParsed.projection,
                    },
                })
                    .toArray();
                if (!queryResult || queryResult.length === 0) {
                    const queryFailedPrompt = `This is a prompt for failed result. You are talking directly now to a user. Your task is to inform them that you did not find any results regarding their inquiry.`;
                    const queryFailedResponse = await (0, sendToOpenChat_1.sendToOpenChat)(queryFailedPrompt);
                    if (queryFailedResponse.status !== 200) {
                        throw new Error(queryFailedResponse.message);
                    }
                    const insertedAIMessage = await messages.insertOne({
                        user_id: userID,
                        sender: "ai",
                        message: queryFailedResponse.message,
                    });
                    if (!insertedAIMessage.acknowledged) {
                        throw new Error("An error occured. AI message was not successfully inserted.");
                    }
                    resp.status(200).json({ aiResponse: queryFailedResponse.message });
                    return;
                }
                const queryFormattedResult = queryResult.map(({ hashedPassword, ...rest }) => {
                    return { ...rest, user_id: userID };
                });
                const hasGreet = await (0, checkUserGreet_1.default)(userID);
                const finalPrompt = fs_1.default
                    .readFileSync(finalPromptPath, "utf-8")
                    .replace("[[greet]]", hasGreet
                    ? "No need to introduce yourself. Just proceed to answer the user's question."
                    : "Introduce yourself (but don't ask 'how can I assist you' or anything similar) then answer the question directly.")
                    .replace("[[message]]", userMessage)
                    .replace("[[user]]", JSON.stringify(queryFormattedResult));
                const finalResponse = await (0, sendToOpenChat_1.sendToOpenChat)(finalPrompt);
                if (finalResponse.status !== 200) {
                    throw new Error(finalResponse.message);
                }
                const finalResponseParsed = JSON.parse(finalResponse.message);
                const insertedAIMessage = await messages.insertOne({
                    user_id: userID,
                    sender: "ai",
                    message: finalResponseParsed.response,
                });
                if (!insertedAIMessage.acknowledged) {
                    throw new Error("An error occured. AI message was not successfully inserted.");
                }
                await data_contexts.insertMany(queryFormattedResult.map(({ _id, ...rest }) => rest));
                resp.status(200).json({
                    aiResponse: finalResponseParsed.response,
                    userInfos: finalResponseParsed.userInfos.length === 0
                        ? []
                        : finalResponseParsed.userInfos,
                });
            }
            if (timelineResponseMessage === "follow_up" ||
                timelineResponseMessage === "A: follow_up") {
                const followUpPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "followUpPrompt.txt");
                const chatHistory = await messages
                    .find({ user_id: userID }, { projection: { _id: 0, user_id: 0 } })
                    .sort({ _id: -1 })
                    .limit(5)
                    .toArray();
                const context = await data_contexts
                    .find({ user_id: userID })
                    .sort({ _id: -1 })
                    .limit(1)
                    .toArray();
                const followUpPrompt = fs_1.default
                    .readFileSync(followUpPromptPath, "utf-8")
                    .replace("[[message]]", userMessage)
                    .replace("[[chatHistory]]", JSON.stringify(chatHistory.reverse()))
                    .replace("[[cachedDatas]]", JSON.stringify(context.reverse()));
                const followUpPromptResponse = await (0, sendToOpenChat_1.sendToOpenChat)(followUpPrompt);
                if (followUpPromptResponse.status !== 200) {
                    throw new Error(followUpPromptResponse.message);
                }
                const followUpPromptParsedResponse = JSON.parse(followUpPromptResponse.message);
                const insertedAIMessage = await messages.insertOne({
                    user_id: userID,
                    sender: "ai",
                    message: followUpPromptParsedResponse.response,
                });
                if (!insertedAIMessage.acknowledged) {
                    throw new Error("An error occured. AI message was not successfully inserted.");
                }
                resp.status(200).json({
                    aiResponse: followUpPromptParsedResponse.response,
                    userInfos: followUpPromptParsedResponse.userInfos.length === 0
                        ? []
                        : followUpPromptParsedResponse.userInfos,
                });
            }
        }
        if (intentResponse.message.trim() === "general_question") {
            const nonFollowUpPromptPath = path_1.default.join(process.cwd(), "src", "controllers", "userController", "prompts", "nonFollowUpPrompt.txt");
            const hasGreet = await (0, checkUserGreet_1.default)(userID);
            const nonFollowUpPrompt = fs_1.default
                .readFileSync(nonFollowUpPromptPath, "utf-8")
                .replace("[[greet]]", hasGreet
                ? "No need to introduce yourself. Just proceed to answer the user's question."
                : "Introduce yourself (but don't ask 'how can I assist you' or anything similar) then answer the question directly.")
                .replace("[[message]]", userMessage);
            const nonFollowUpResponse = await (0, sendToOpenChat_1.sendToOpenChat)(nonFollowUpPrompt);
            if (nonFollowUpResponse.status !== 200) {
                throw new Error(nonFollowUpResponse.message);
            }
            const insertedAIMessage = await messages.insertOne({
                user_id: userID,
                sender: "ai",
                message: nonFollowUpResponse.message,
            });
            if (!insertedAIMessage.acknowledged) {
                throw new Error("An error occured. AI message was not successfully inserted.");
            }
            resp.status(200).json({ aiResponse: nonFollowUpResponse.message });
        }
        if (intentResponse.message.trim() === "database_query_schedule") {
            console.log("Hallo: Schedule");
        }
    }
    catch (err) {
        const errorMessage = " I'm sorry. Something went wrong. Please try again to provide your inquiry.";
        try {
            console.error(err);
            const insertedAIMessage = await messages.insertOne({
                user_id: userID,
                sender: "ai",
                message: errorMessage,
            });
            if (!insertedAIMessage.acknowledged) {
                throw new Error("An error occured. AI message was not successfully inserted.");
            }
            resp.status(500).json({
                message: errorMessage,
            });
        }
        catch (innerErr) {
            console.error("Fatal error during error handling:", innerErr.message);
            resp.status(500).json({
                message: errorMessage,
            });
        }
    }
};
exports.default = userWithAI;
