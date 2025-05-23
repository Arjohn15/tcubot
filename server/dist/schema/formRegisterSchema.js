"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formRegisterSchema = void 0;
// validationSchema.ts (backend)
const zod_1 = require("zod");
// Helper: 15 years ago from today
const today = new Date();
const fifteenYearsAgo = new Date(
  today.getFullYear() - 15,
  today.getMonth(),
  today.getDate()
);
exports.formRegisterSchema = zod_1.z
  .object({
    first_name: zod_1.z
      .string()
      .min(1, "First name is required")
      .regex(/^[^0-9]*$/, "First name should not contain numbers"),
    last_name: zod_1.z
      .string()
      .min(1, "Last name is required")
      .regex(/^[^0-9]*$/, "Last name should not contain numbers"),
    email: zod_1.z.string().min(1, "Email is required").email("Invalid email"),
    phone_number: zod_1.z
      .string()
      .regex(
        /^(?:\+?\d{1,3})?[-. (]?\(?\d{1,4}\)?[-. )]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,4}$/,
        "Invalid phone number"
      )
      .optional()
      .or(zod_1.z.literal("").transform(() => undefined)),
    birthday: zod_1.z
      .string()
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, "Birthday is required")
      .refine((val) => {
        const date = new Date(val);
        return date <= new Date();
      }, "Birthday cannot be in the future")
      .refine((val) => {
        const date = new Date(val);
        return date <= fifteenYearsAgo;
      }, "You must be at least 15 years old"),
    role: zod_1.z.string().min(1, "Role is required"),
    year: zod_1.z.string().min(1, "Year is required"),
    course: zod_1.z.string().min(1, "Course is required"),
    section: zod_1.z.string().min(1, "Section is required"),
    school_assigned_number: zod_1.z
      .string()
      .min(1, "School number is required")
      .regex(/^\d{2}-\d{5}$/, "School number must be in the format: XX-XXXXX"),
    password: zod_1.z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirm_password: zod_1.z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });
