import { db } from "../config/db";

const messages = db.collection("messages");

const checkUserGreet = async (userID: string): Promise<boolean> => {
  let hasGreet = false;

  try {
    const userMessages = await messages
      .find({ user_id: `${userID}` }, { projection: { message: 1 } })
      .toArray();

    const hasGreeting = userMessages.length >= 2;

    if (hasGreeting) {
      hasGreet = true;
    } else {
      hasGreet = false;
    }
  } catch (err: any) {
    console.error(err);
  }

  return hasGreet;
};

export default checkUserGreet;
