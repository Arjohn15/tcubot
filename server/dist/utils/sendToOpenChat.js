"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToOpenChat = void 0;
const axios_1 = __importDefault(require("axios"));
const sendToOpenChat = async (prompt) => {
    try {
        const response = await axios_1.default.post("http://localhost:11434/api/chat", {
            model: "openchat",
            messages: [{ role: "user", content: prompt }],
            stream: false,
        });
        return {
            status: 200,
            message: response.data.message.content,
        };
    }
    catch (err) {
        return {
            status: err.response ? err.response.status : 500,
            message: err.response
                ? err.response.data.error || "Error occurred"
                : "Unknown error",
        };
    }
};
exports.sendToOpenChat = sendToOpenChat;
