import { Router } from "express";
import { admin_login, user_login } from "../controllers/authController";
import {
  authenticate,
  authorize_admin,
  authorize_user,
} from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login/admin", admin_login);
authRouter.post("/login/user", user_login);

authRouter.use(
  "/admin-login-auth",
  authenticate,
  authorize_admin,
  (req, resp) => {
    resp.status(200).json({ message: "Admin role successfully authorized" });
    return;
  }
);

authRouter.use(
  "/user-login-auth",
  authenticate,
  authorize_user,
  (req, resp) => {
    resp.status(200).json({ message: "User role successfully authorized" });
    return;
  }
);
export default authRouter;
