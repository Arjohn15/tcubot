import { Request, Response } from "express";
import fs from "fs";
import { sendToOpenChat } from "../../utils/sendToOpenChat";
import path from "path";
import { db } from "../../config/db";
import checkUserGreet from "../../utils/checkUserGreet";
import queryChecker from "../../utils/queryChecker";
import { ObjectId } from "mongodb";

const messages = db.collection("messages");
const users = db.collection("users");
const data_contexts = db.collection("data_contexts");
const schedules = db.collection("schedules");

const userWithAI = async (
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
      "prompts",
      "intentPrompt.txt"
    );

    const queryPromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "prompts",
      "queryPrompt.txt"
    );

    const finalPromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "prompts",
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
      const timelinePromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "prompts",
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

      if (timelineResponseMessage === "newFollow_up") {
        const queryPrompt = fs
          .readFileSync(queryPromptPath, "utf-8")
          .replace("[[message]]", userMessage);

        const queryResponse = await sendToOpenChat(queryPrompt);

        if (queryResponse.status !== 200) {
          throw new Error(queryResponse.message);
        }

        let queryResponseChecked = queryChecker(queryResponse.message);

        let queryResponseParsed = JSON.parse(queryResponseChecked);

        let queryResult = await users.findOne(queryResponseParsed.query, {
          projection: {
            ...queryResponseParsed.projection,
          },
        });

        if (!queryResult || queryResult.length === 0) {
          const queryFailedPrompt = `This is a prompt for failed result. You are talking directly now to a user. Your task is to inform them that you did not find any results regarding their inquiry.`;
          const queryFailedResponse = await sendToOpenChat(queryFailedPrompt);

          if (queryFailedResponse.status !== 200) {
            throw new Error(queryFailedResponse.message);
          }

          const insertedAIMessage = await messages.insertOne({
            user_id: userID,
            sender: "ai",
            message: queryFailedResponse.message,
          });

          if (!insertedAIMessage.acknowledged) {
            throw new Error(
              "An error occured. AI message was not successfully inserted."
            );
          }

          resp.status(200).json({ aiResponse: queryFailedResponse.message });
          return;
        }

        const { hashedPassword, ...queryFormattedResult } = queryResult;

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
          .replace("[[user]]", JSON.stringify(queryFormattedResult));

        const finalResponse = await sendToOpenChat(finalPrompt);

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
          throw new Error(
            "An error occured. AI message was not successfully inserted."
          );
        }

        const { _id, ...queryResultInsert } = queryFormattedResult;

        await data_contexts.insertOne({
          ...queryResultInsert,
          original_id: _id.toString(),
          user_id: userID,
        });

        resp.status(200).json({
          aiResponse: finalResponseParsed.response,
          userInfos:
            finalResponseParsed.userInfos.length === 0
              ? []
              : finalResponseParsed.userInfos,
        });
      }

      if (timelineResponseMessage === "follow_up") {
        const followUpPromptPath = path.join(
          process.cwd(),
          "src",
          "controllers",
          "userController",
          "prompts",
          "followUpPrompt.txt"
        );

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

        const followUpPrompt = fs
          .readFileSync(followUpPromptPath, "utf-8")
          .replace("[[message]]", userMessage)
          .replace("[[chatHistory]]", JSON.stringify(chatHistory.reverse()))
          .replace("[[cachedDatas]]", JSON.stringify(context.reverse()));

        const followUpPromptResponse = await sendToOpenChat(followUpPrompt);

        if (followUpPromptResponse.status !== 200) {
          throw new Error(followUpPromptResponse.message);
        }

        const followUpPromptParsedResponse = JSON.parse(
          followUpPromptResponse.message
        );

        const insertedAIMessage = await messages.insertOne({
          user_id: userID,
          sender: "ai",
          message: followUpPromptParsedResponse.response,
        });

        if (!insertedAIMessage.acknowledged) {
          throw new Error(
            "An error occured. AI message was not successfully inserted."
          );
        }

        resp.status(200).json({
          aiResponse: followUpPromptParsedResponse.response,
          userInfos:
            followUpPromptParsedResponse.userInfos.length === 0
              ? []
              : followUpPromptParsedResponse.userInfos,
        });
      }
    }

    if (intentResponse.message.trim() === "self_question") {
      const currentDate = new Date();

      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const currentDateformatted = currentDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "long",
        hour12: false,
      });

      const selfQuestionPromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "prompts",
        "selfQuestionPrompt.txt"
      );

      const self = await users.findOne(
        { _id: new ObjectId(`${userID}`) },
        {
          projection: {
            _id: 0,
            show_birthday: 0,
            show_phone_number: 0,
            hashedPassword: 0,
          },
        }
      );

      let selfSchedules;

      if (self?.role === "student") {
        selfSchedules = await schedules
          .find({ assigned_section: self?.section }, { projection: { _id: 0 } })
          .toArray();
      } else {
        selfSchedules = await schedules
          .find({ professor_id: userID }, { projection: { _id: 0 } })
          .toArray();
      }

      const profsWithScheds = await Promise.all(
        selfSchedules.map(async ({ _id, professor_id, ...schedule }) => {
          const professor = await users.findOne(
            {
              _id: new ObjectId(`${professor_id}`),
            },
            {
              projection: {
                _id: 0,
                first_name: 1,
                last_name: 1,
                email: 1,
                phone_number: 1,
                role: 1,
                school_assigned_number: 1,
              },
            }
          );

          return { ...professor, ...schedule, day: weekdays[schedule.day] };
        })
      );

      const chatHistory = await messages
        .find({ user_id: userID }, { projection: { _id: 0, user_id: 0 } })
        .sort({ _id: -1 })
        .limit(5)
        .toArray();

      const selfQuestionPrompt = fs
        .readFileSync(selfQuestionPromptPath, "utf-8")
        .replace("[[date]]", currentDateformatted)
        .replace("[[message]]", userMessage)
        .replace("[[self]]", JSON.stringify(self))
        .replace("[[schedules]]", JSON.stringify(profsWithScheds))
        .replace("[[chatHistory]]", JSON.stringify(chatHistory));

      const selfQuestionPromptResponse = await sendToOpenChat(
        selfQuestionPrompt
      );

      const insertedAIMessage = await messages.insertOne({
        user_id: userID,
        sender: "ai",
        message: selfQuestionPromptResponse.message,
      });

      if (!insertedAIMessage.acknowledged) {
        throw new Error(
          "An error occured. AI message was not successfully inserted."
        );
      }

      resp.status(200).json({ aiResponse: selfQuestionPromptResponse.message });
    }

    if (intentResponse.message.trim() === "general_question") {
      const nonFollowUpPromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "prompts",
        "nonFollowUpPrompt.txt"
      );

      const hasGreet = await checkUserGreet(userID);

      const nonFollowUpPrompt = fs
        .readFileSync(nonFollowUpPromptPath, "utf-8")
        .replace(
          "[[greet]]",
          hasGreet
            ? "No need to introduce yourself. Just proceed to answer the user's question."
            : "Introduce yourself (but don't ask 'how can I assist you' or anything similar) then answer the question directly."
        )
        .replace("[[message]]", userMessage);

      const nonFollowUpResponse = await sendToOpenChat(nonFollowUpPrompt);

      if (nonFollowUpResponse.status !== 200) {
        throw new Error(nonFollowUpResponse.message);
      }

      const insertedAIMessage = await messages.insertOne({
        user_id: userID,
        sender: "ai",
        message: nonFollowUpResponse.message,
      });

      if (!insertedAIMessage.acknowledged) {
        throw new Error(
          "An error occured. AI message was not successfully inserted."
        );
      }

      resp.status(200).json({ aiResponse: nonFollowUpResponse.message });
    }
  } catch (err: any) {
    const errorMessage =
      "I'm sorry. Something went wrong. Please try again to provide your inquiry.";
    try {
      console.error(err);

      const insertedAIMessage = await messages.insertOne({
        user_id: userID,
        sender: "ai",
        message: errorMessage,
      });

      if (!insertedAIMessage.acknowledged) {
        throw new Error(
          "An error occured. AI message was not successfully inserted."
        );
      }

      resp.status(500).json({
        message: errorMessage,
      });
    } catch (innerErr: any) {
      console.error("Fatal error during error handling:", innerErr.message);
      resp.status(500).json({
        message: errorMessage,
      });
    }
  }
};

export default userWithAI;
