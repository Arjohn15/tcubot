"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const apiController_1 = require("../controllers/apiController");
const apiRouter = (0, express_1.Router)();
apiRouter.post("/send-email", authMiddleware_1.authenticate, apiController_1.send_email);
exports.default = apiRouter;
