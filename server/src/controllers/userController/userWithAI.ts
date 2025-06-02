import { Request, Response } from "express";
import { readFileSync } from "fs";
import { sendToOpenChat } from "../../utils/sendToOpenChat";
import path from "path";
import { db } from "../../config/db";
import checkUserGreet from "../../utils/checkUserGreet";
import setUserInfo from "./utils/setUserInfo";
import setUserSchedule from "./utils/setUserSchedule";
import setChatHistory from "./utils/setChatHistory";

const messages = db.collection("messages");
const users = db.collection("users");
const subjects = db.collection("subjects");

const currentDate = new Date();

const currentDateFormatted = currentDate.toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "long",
  hour12: true,
});

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

    const referencePromptPath = path.join(
      process.cwd(),
      "src",
      "controllers",
      "userController",
      "prompts",
      "referencePrompt.txt"
    );

    const referencePrompt = readFileSync(referencePromptPath, "utf-8").replace(
      "[[message]]",
      userMessage
    );
    const referencePromptResponse = await sendToOpenChat(referencePrompt);

    if (referencePromptResponse.message === "self") {
      const selfInfoFormatted = await setUserInfo(userID);
      const selfScheduleFormatted = await setUserSchedule(userID);

      const hasAIGreet = await checkUserGreet(userID);

      const selfPromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "prompts",
        "selfPrompt.txt"
      );

      const selfPrompt = readFileSync(selfPromptPath, "utf-8")
        .replace("[[message]]", userMessage)
        .replace("[[selfInfo]]", selfInfoFormatted)
        .replace("[[selfSchedule]]", selfScheduleFormatted)
        .replace("[[currentDate]]", currentDateFormatted)
        .replace("[[hasAIGreeted]]", JSON.stringify(hasAIGreet));

      const selfPromptResponse = await sendToOpenChat(selfPrompt);

      if (selfPromptResponse.status !== 200) {
        throw new Error();
      }

      const insertedAIMessage = await messages.insertOne({
        user_id: userID,
        sender: "ai",
        message: selfPromptResponse.message,
      });

      if (!insertedAIMessage.acknowledged) {
        throw new Error();
      }

      resp.status(200).json({ aiResponse: selfPromptResponse.message });

      const subjectSelf = `
TODAY'S DATE:
${currentDateFormatted}

USER'S SCHEDULE:
------------------------

${selfScheduleFormatted}
      `;

      subjects.replaceOne(
        { user_id: userID },
        { user_id: userID, subject_content: subjectSelf },
        { upsert: true }
      );
    } else if (referencePromptResponse.message === "nonself") {
      const nonselfPromptPath = path.join(
        process.cwd(),
        "src",
        "controllers",
        "userController",
        "prompts",
        "nonselfPrompt.txt"
      );

      const nonselfPrompt = readFileSync(nonselfPromptPath, "utf-8").replace(
        "[[message]]",
        userMessage
      );

      const nonselfPromptResponse = await sendToOpenChat(nonselfPrompt);

      switch (nonselfPromptResponse.message) {
        case "new": {
          const newPromptPath = path.join(
            process.cwd(),
            "src",
            "controllers",
            "userController",
            "prompts",
            "newPrompt.txt"
          );

          const newPrompt = readFileSync(newPromptPath, "utf-8").replace(
            "[[message]]",
            userMessage
          );

          const newPromptResponse = await sendToOpenChat(newPrompt);
          if (newPromptResponse.message === "person") {
            const personQueryPromptPath = path.join(
              process.cwd(),
              "src",
              "controllers",
              "userController",
              "prompts",
              "personQueryPrompt.txt"
            );

            const personQueryPrompt = readFileSync(
              personQueryPromptPath,
              "utf-8"
            ).replace("[[message]]", userMessage);

            const personQueryPromptResponse = await sendToOpenChat(
              personQueryPrompt
            );

            if (personQueryPromptResponse.status !== 200) {
              throw new Error();
            }

            let personResponseParsed = JSON.parse(
              personQueryPromptResponse.message
            );

            let personQueryResult = await users.findOne(
              personResponseParsed.query,
              {
                projection: {
                  ...personResponseParsed.projection,
                  hashedPassword: 0,
                },
              }
            );

            if (personQueryResult) {
              const personID = personQueryResult._id.toString();

              const personInfoFormatted = await setUserInfo(personID);

              const hasAIGreet = await checkUserGreet(personID);

              const personPromptPath = path.join(
                process.cwd(),
                "src",
                "controllers",
                "userController",
                "prompts",
                "personPrompt.txt"
              );

              const personPrompt = readFileSync(personPromptPath, "utf-8")
                .replace("[[message]]", userMessage)
                .replace("[[subjectInfo]]", personInfoFormatted)
                .replace("[[hasAIGreeted]]", JSON.stringify(hasAIGreet));

              const personPromptResponse = await sendToOpenChat(personPrompt);

              if (personPromptResponse.status !== 200) {
                throw new Error();
              }

              const personPromptResponseParsed = JSON.parse(
                personPromptResponse.message
              );

              const insertedAIMessage = await messages.insertOne({
                user_id: userID,
                sender: "ai",
                message: personPromptResponseParsed.response,
              });

              if (!insertedAIMessage.acknowledged) {
                throw new Error();
              }

              resp.status(200).json({
                aiResponse:
                  personPromptResponseParsed.response ||
                  "I'm sorry. Something went wrong. Please try again later",
                userInfos:
                  personPromptResponseParsed.userInfos.length === 0
                    ? []
                    : personPromptResponseParsed.userInfos,
              });

              subjects.replaceOne(
                { user_id: userID },
                { user_id: userID, subject_content: personInfoFormatted },
                { upsert: true }
              );
              return;
            } else {
              const personFailedQueryPromptPath = path.join(
                process.cwd(),
                "src",
                "controllers",
                "userController",
                "prompts",
                "personFailedQueryPrompt.txt"
              );

              const personFailedPrompt = readFileSync(
                personFailedQueryPromptPath,
                "utf-8"
              ).replace("[[message]]", userMessage);

              const personFailedPromptResponse = await sendToOpenChat(
                personFailedPrompt
              );

              if (personFailedPromptResponse.status !== 200) {
                throw new Error();
              }

              const insertedAIMessage = await messages.insertOne({
                user_id: userID,
                sender: "ai",
                message: personFailedPromptResponse.message,
              });

              if (!insertedAIMessage.acknowledged) {
                throw new Error();
              }

              resp.status(200).json({
                aiResponse:
                  personFailedPromptResponse.message ||
                  "I'm sorry. Something went wrong. Please try again later",
              });

              subjects.replaceOne(
                { user_id: userID },
                { user_id: userID, subject_content: "Not found" },
                { upsert: true }
              );
              return;
            }
          } else if (newPromptResponse.message === "organization") {
            const organizationPromptPath = path.join(
              process.cwd(),
              "src",
              "controllers",
              "userController",
              "prompts",
              "organizationPrompt.txt"
            );
            const organizationPromptPlainPath = path.join(
              process.cwd(),
              "src",
              "controllers",
              "userController",
              "prompts",
              "organizationPromptPlain.txt"
            );

            const organizationPrompt = readFileSync(
              organizationPromptPath,
              "utf-8"
            ).replace("[[message]]", userMessage);

            const organizationPromptResponse = await sendToOpenChat(
              organizationPrompt
            );

            if (organizationPromptResponse.status !== 200) {
              throw new Error();
            }

            const insertedAIMessage = await messages.insertOne({
              user_id: userID,
              sender: "ai",
              message: organizationPromptResponse.message,
            });

            if (!insertedAIMessage.acknowledged) {
              throw new Error();
            }

            resp
              .status(200)
              .json({ aiResponse: organizationPromptResponse.message });

            const organizationPromptPlain = readFileSync(
              organizationPromptPlainPath,
              "utf-8"
            );

            subjects.replaceOne(
              { user_id: userID },
              { user_id: userID, subject_content: organizationPromptPlain },
              { upsert: true }
            );
            return;
          } else {
            resp.status(200).json({
              aiResponse:
                "I'm sorry. Something went wrong. Please try again later.",
            });
            return;
          }
        }
        case "trail": {
          const selfInfoFormatted = await setUserInfo(userID);

          const subjectInfo = await subjects.findOne(
            { user_id: userID },
            { projection: { _id: 0, subject_content: 1 } }
          );

          const chatHistoryFormatted = await setChatHistory(userID, 5);

          const trailPromptPath = path.join(
            process.cwd(),
            "src",
            "controllers",
            "userController",
            "prompts",
            "trailPrompt.txt"
          );

          const hasAIGreeted = await checkUserGreet(userID);

          const trailPrompt = readFileSync(trailPromptPath, "utf-8")
            .replace("[[selfInfo]]", selfInfoFormatted)
            .replace(
              "[[subjectInfo]]",
              subjectInfo ? subjectInfo.subject_content : "Not found"
            )
            .replace("[[chatHistory]]", chatHistoryFormatted)
            .replace("[[hasAIGreeted]]", JSON.stringify(hasAIGreeted));

          console.log(hasAIGreeted);
          const trailPromptResponse = await sendToOpenChat(trailPrompt);

          if (trailPromptResponse.status !== 200) {
            throw new Error();
          }

          const insertedAIMessage = await messages.insertOne({
            user_id: userID,
            sender: "ai",
            message: trailPromptResponse.message,
          });

          if (!insertedAIMessage.acknowledged) {
            throw new Error();
          }

          resp.status(200).json({ aiResponse: trailPromptResponse.message });
          return;
        }
        case "random": {
          const randomPromptPath = path.join(
            process.cwd(),
            "src",
            "controllers",
            "userController",
            "prompts",
            "randomPrompt.txt"
          );

          const randomPrompt = readFileSync(randomPromptPath, "utf-8").replace(
            "[[message]]",
            userMessage
          );

          const randomPromptResponse = await sendToOpenChat(randomPrompt);

          if (randomPromptResponse.status !== 200) {
            throw new Error();
          }

          const insertedAIMessage = await messages.insertOne({
            user_id: userID,
            sender: "ai",
            message: randomPromptResponse.message,
          });

          if (!insertedAIMessage.acknowledged) {
            throw new Error();
          }

          resp.status(200).json({ aiResponse: randomPromptResponse.message });
          return;
        }
        default: {
          throw new Error();
        }
      }
    } else {
      throw new Error();
    }
  } catch (err: any) {
    console.error(err);
    const insertedAIMessage = await messages.insertOne({
      user_id: userID,
      sender: "ai",
      message: err.message,
    });

    if (!insertedAIMessage.acknowledged) {
      throw new Error();
    }
    resp.status(500).json({
      aiResponse: "I'm sorry. Something went wrong. Please try again later.",
    });
  }
};

export default userWithAI;
