"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const messages = db_1.db.collection("messages");
const checkUserGreet = async (userID) => {
    let hasGreet = false;
    try {
        const userMessages = await messages
            .find({ user_id: `${userID}` }, { projection: { message: 1 } })
            .toArray();
        const match = userMessages.find((message) => message.message.toLowerCase().includes("hello"));
        if (match) {
            hasGreet = true;
        }
        else {
            hasGreet = false;
        }
    }
    catch (err) {
        console.error(err);
    }
    return hasGreet;
};
exports.default = checkUserGreet;
