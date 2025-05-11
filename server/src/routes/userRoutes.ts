import { Router } from "express";
import {
  user_data,
  user_register,
  userChatAI,
  userDelete,
  userUpdate,
  userUpdateByAdmin,
  userUpdatePassword,
} from "../controllers/userController/userController";
import { formRegisterSchema } from "../schema/formRegisterSchema";
import { validateRegistrants } from "../middleware/validateRegistrants";
import {
  authenticate,
  authorize_admin,
  authorize_user,
} from "../middleware/authMiddleware";
import { Request, Response } from "express";
const userRouter = Router();

userRouter.get("/user", authenticate, authorize_user, user_data);

userRouter.post(
  "/register",
  validateRegistrants(formRegisterSchema),
  user_register
);

userRouter.post("/user/chat/ai", authenticate, authorize_user, userChatAI);

userRouter.put("/user-update", authenticate, authorize_user, userUpdate);
userRouter.put(
  "/user-update-password",
  authenticate,
  authorize_user,
  userUpdatePassword
);
userRouter.put(
  "/user-update-by-admin/:id",
  authenticate,
  authorize_admin,
  userUpdateByAdmin
);

userRouter.delete(
  "/user-delete/:id",
  authenticate,
  authorize_admin,
  userDelete
);

export default userRouter;
