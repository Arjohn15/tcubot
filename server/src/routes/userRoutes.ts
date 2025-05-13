import { Router } from "express";
import {
  user_data,
  user_register,
  userChatAI,
  userChatHistory,
  userDelete,
  userProfessorSchedule,
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

const userRouter = Router();

userRouter.get("/user", authenticate, authorize_user, user_data);
userRouter.get(
  "/user/chat/history",
  authenticate,
  authorize_user,
  userChatHistory
);

userRouter.post(
  "/register",
  validateRegistrants(formRegisterSchema),
  user_register
);
userRouter.post("/user/chat/ai", authenticate, authorize_user, userChatAI);
userRouter.post(
  "/user/professor/schedule",
  authenticate,
  authorize_user,
  userProfessorSchedule
);

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
