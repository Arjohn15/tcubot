import { Request, Response } from "express";
import fs from "fs";
import { sendToOpenChat } from "../../../utils/sendToOpenChat";
// import { dbConfig } from "../../../config/dbConfig";
import path from "path";
// import checkUserGreet from "../../../utils/checkUserGreet";
import { db } from "../../../config/db";
import checkUserGreet from "../../../utils/checkUserGreet";
import { json } from "stream/consumers";

const messages = db.collection("messages");
const users = db.collection("users");

const userStudent = async (
  req: Request,
  resp: Response,
  userMessage: string
) => {
  const userID = (req as any).user.id;

  try {
    const insertedMessage = await messages.insertOne({
      user_id: userID,
      sender: "user",
      message: userMessage,
    });

    if (!insertedMessage.acknowledged) {
      throw new Error(
        "An error occured. User message was not successfully inserted."
      );
    }

    const intentPromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "userStudent",
      "intentPrompt.txt"
    );

    const queryPromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "userStudent",
      "queryPrompt.txt"
    );

    const finalPromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "userStudent",
      "finalPrompt.txt"
    );

    const intentPrompt = fs
      .readFileSync(intentPromptPath, "utf-8")
      .replace("{{message}}", userMessage);

    const intentResponse = await sendToOpenChat(intentPrompt);

    if (intentResponse.status !== 200) {
      throw new Error(intentResponse.message);
    }

    if (intentResponse.message.trim() === "database_query") {
      const queryPrompt = fs
        .readFileSync(queryPromptPath, "utf-8")
        .replace("[[message]]", userMessage);

      const queryResponse = await sendToOpenChat(queryPrompt);

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
        const queryFailedResponse = await sendToOpenChat(queryFailedPrompt);

        if (queryFailedResponse.status !== 200) {
          throw new Error(queryFailedResponse.message);
        }

        resp.status(200).json({ aiResponse: queryFailedResponse.message });
        return;
      }

      const queryFormattedResult = queryResult.map(
        ({ hashedPassword, ...rest }) => rest
      );

      const hasGreet = await checkUserGreet(userID);

      const finalPrompt = fs
        .readFileSync(finalPromptPath, "utf-8")
        .replace(
          "[[greet]]",
          hasGreet
            ? "No need to introduce yourself. Just proceed to answer the user's question."
            : "Introduce yourself (but don't ask 'how can I assist you' or anything similar) then answer the question directly."
        )
        .replace("[[message]]", userMessage)
        .replace("[[student]]", JSON.stringify(queryFormattedResult));

      const finalResponse = await sendToOpenChat(finalPrompt);

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
      const timelinePromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "userStudent",
        "timelinePrompt.txt"
      );
      const timelinePrompt = fs
        .readFileSync(timelinePromptPath, "utf-8")
        .replace("[[message]]", userMessage);

      const timelineResponse = await sendToOpenChat(timelinePrompt);

      const timelineResponseMessage = timelineResponse.message.trim();

      if (timelineResponse.status !== 200) {
        throw new Error(intentResponse.message);
      }

      if (timelineResponseMessage === "nonFollow_up") {
        const nonFollowUpPromptPath = path.join(
          process.cwd(),
          "src",
          "controllers",
          "userController",
          "userStudent",
          "nonFollowUpPrompt.txt"
        );

        const nonFollowUpPrompt = fs
          .readFileSync(nonFollowUpPromptPath, "utf-8")
          .replace("[[message]]", userMessage);

        const nonFollowUpResponse = await sendToOpenChat(nonFollowUpPrompt);

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
  } catch (err: any) {
    console.error(err);
    resp.status(500).json({
      message: err.message,
    });
  }
};

export default userStudent;
