"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToOpenChat = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
const sendToOpenChat = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        return {
            status: 200,
            message: response.text
                ?.replace(/```(?:json)?/gi, "")
                .replace(/^\s+|\s+$/g, "") || "Hello there!",
        };
    }
    catch (err) {
        console.log(err);
        return {
            status: err.response ? err.response.status : 500,
            message: err.response
                ? err.response.data.error || "Error occurred"
                : "Unknown error",
        };
    }
};
exports.sendToOpenChat = sendToOpenChat;
// import axios from "axios";
// export const sendToOpenChat = async (
//   prompt: string
// ): Promise<OpenChatResponse> => {
//   try {
//     const response = await axios.post("http://localhost:11434/api/chat", {
//       model: "openchat",
//       messages: [{ role: "user", content: prompt }],
//       stream: false,
//     });
//     return {
//       status: 200,
//       message: response.data.message.content,
//     };
//   } catch (err: any) {
//     return {
//       status: err.response ? err.response.status : 500,
//       message: err.response
//         ? err.response.data.error || "Error occurred"
//         : "Unknown error",
//     };
//   }
// };
