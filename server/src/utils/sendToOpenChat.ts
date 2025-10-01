import dotenv from "dotenv";

dotenv.config();

interface OpenChatResponse {
  status: number;
  message: string;
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
    console.error(err);
    return {
      status: 500,
      message: "I'm sorry. Something went wrong. Please try again later.",
    };
  }
};
