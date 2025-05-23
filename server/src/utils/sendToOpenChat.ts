import dotenv from "dotenv";

dotenv.config();

interface OpenChatResponse {
  status: number; // Success or error status code
  message: string; // The response or error message
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export const sendToOpenChat = async (
  prompt: any
): Promise<OpenChatResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return {
      status: 200,
      message:
        response.text
          ?.replace(/```(?:json)?/gi, "")
          .replace(/^\s+|\s+$/g, "") || "Hello there!",
    };
  } catch (err: any) {
    console.log(err);
    return {
      status: err.response ? err.response.status : 500,
      message: err.response
        ? err.response.data.error || "Error occurred"
        : "Unknown error",
    };
  }
};

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
