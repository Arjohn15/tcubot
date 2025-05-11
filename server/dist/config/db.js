"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.connectToDB = connectToDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
exports.db = client.db(process.env.MONGODB_DB);
async function connectToDB() {
    await client.connect();
}
