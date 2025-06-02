import { db } from "../../../config/db";

const messages = db.collection("messages");

async function setChatHistory(userID: string, limit: number): Promise<string> {
  try {
    const chatHistory = await messages
      .find({ user_id: userID }, { projection: { _id: 0, user_id: 0 } })
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();

    if (chatHistory.length === 0) {
      return "Chat history not available";
    } else {
      return chatHistory
        .reverse()
        .map((chat) => {
          if (chat.sender === "user") {
            return `------------------------
User: ${chat.message}`;
          } else {
            return `------------------------
AI: ${chat.message}`;
          }
        })
        .join("\n\n");
    }
  } catch {
    return "Chat history not available";
  }
}

export default setChatHistory;
