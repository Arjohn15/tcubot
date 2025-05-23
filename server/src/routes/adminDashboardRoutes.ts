import { Router } from "express";
import {
  admin_dashboard,
  allUsers,
  send_email_accept,
  send_email_reject,
} from "../controllers/adminController";

const adminDashboardRouter = Router();

adminDashboardRouter.get("/", admin_dashboard);
adminDashboardRouter.get("/users", allUsers);
adminDashboardRouter.post("/send-email-reject", send_email_reject);
adminDashboardRouter.post("/send-email-accept", send_email_accept);

export default adminDashboardRouter;
