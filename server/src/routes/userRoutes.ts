import { Router } from "express";
import {
  user_data,
  user_register,
  userUpdate,
  userUpdatePassword,
} from "../controllers/userController";
import { formRegisterSchema } from "../schema/formRegisterSchema";
import { validateRegistrants } from "../middleware/validateRegistrants";
import { authenticate, authorize_user } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get("/user", authenticate, authorize_user, user_data);
userRouter.put("/user-update", authenticate, authorize_user, userUpdate);
userRouter.put(
  "/user-update-password",
  authenticate,
  authorize_user,
  userUpdatePassword
);

userRouter.post(
  "/register",
  validateRegistrants(formRegisterSchema),
  user_register
);

export default userRouter;
