"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdateSchema = void 0;
const zod_1 = require("zod");
exports.passwordUpdateSchema = zod_1.z.object({
  newPassword: zod_1.z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*\d).{8,}$/,
      "New password must be at least 8 characters, and contain a lowercase letter and a number"
    ),
});
