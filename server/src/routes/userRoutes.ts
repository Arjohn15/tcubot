import { Router } from "express";
import {
  addRecentUserVisit,
  getRecentUserVisits,
  getUser,
  user_data,
  user_register,
  userChatAI,
  userChatHistory,
  userDelete,
  userProfessorAllSchedule,
  userProfessorDeleteSchedule,
  userProfessorEditSchedule,
  userProfessorSchedule,
  userUpdate,
  userUpdateByAdmin,
  userUpdatePassword,
  userVisit,
  userWeekdaySchedule,
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
userRouter.get("/user/visit/:id", authenticate, authorize_user, getUser);
userRouter.get(
  "/user/chat/history",
  authenticate,
  authorize_user,
  userChatHistory
);
userRouter.get("/user/chat/visit/:id", authenticate, authorize_user, userVisit);
userRouter.get(
  "/user/schedule-weekday",
  authenticate,
  authorize_user,
  userWeekdaySchedule
);
userRouter.get(
  "/user/recent-visits",
  authenticate,
  authorize_user,
  getRecentUserVisits
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
userRouter.post(
  "/user/professor/schedule-all",
  authenticate,
  authorize_user,
  userProfessorAllSchedule
);
userRouter.post(
  "/user/recent-visits",
  authenticate,
  authorize_user,
  addRecentUserVisit
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
userRouter.put(
  "/user/professor/schedule-update/:id",
  authenticate,
  authorize_user,
  userProfessorEditSchedule
);

userRouter.delete(
  "/user-delete/:id",
  authenticate,
  authorize_admin,
  userDelete
);
userRouter.delete(
  "/user/professor/schedule-delete/:id",
  authenticate,
  authorize_user,
  userProfessorDeleteSchedule
);

export default userRouter;
