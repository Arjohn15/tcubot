import { Router } from "express";
import { authenticate, authorize_admin } from "../middleware/authMiddleware";
import adminDashboardRouter from "./adminDashboardRoutes";

const adminRouter = Router();

adminRouter.use(
  "/dashboard",
  authenticate,
  authorize_admin,
  adminDashboardRouter
);

export default adminRouter;
