import { z } from "zod";

export const passwordUpdateSchema = z.object({
  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*\d).{8,}$/,
      "New password must be at least 8 characters, and contain a lowercase letter and a number"
    ),
});
