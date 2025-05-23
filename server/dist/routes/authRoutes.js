"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/login/admin", authController_1.admin_login);
authRouter.post("/login/user", authController_1.user_login);
authRouter.use(
  "/admin-login-auth",
  authMiddleware_1.authenticate,
  authMiddleware_1.authorize_admin,
  (req, resp) => {
    resp.status(200).json({ message: "Admin role successfully authorized" });
    return;
  }
);
authRouter.use(
  "/user-login-auth",
  authMiddleware_1.authenticate,
  authMiddleware_1.authorize_user,
  (req, resp) => {
    resp.status(200).json({ message: "User role successfully authorized" });
    return;
  }
);
exports.default = authRouter;
