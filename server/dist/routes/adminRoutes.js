"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminDashboardRoutes_1 = __importDefault(
  require("./adminDashboardRoutes")
);
const adminRouter = (0, express_1.Router)();
adminRouter.use(
  "/dashboard",
  authMiddleware_1.authenticate,
  authMiddleware_1.authorize_admin,
  adminDashboardRoutes_1.default
);
exports.default = adminRouter;
