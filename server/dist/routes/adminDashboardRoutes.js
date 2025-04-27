"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const adminDashboardRouter = (0, express_1.Router)();
adminDashboardRouter.get("/", adminController_1.admin_dashboard);
adminDashboardRouter.post("/send-email-reject", adminController_1.send_email_reject);
adminDashboardRouter.post("/send-email-accept", adminController_1.send_email_accept);
exports.default = adminDashboardRouter;
