"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize_user =
  exports.authorize_admin =
  exports.authenticate =
    void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";
const authenticate = (req, resp, next) => {
  const auth_header = req.headers.authorization;
  if (!auth_header) {
    return resp.status(403).json({ message: "No token" });
  }
  const token = auth_header.split(" ")[1];
  try {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return resp
      .status(401)
      .json({ message: "Session expired or token is invalid" });
  }
};
exports.authenticate = authenticate;
const authorize_admin = (req, resp, next) => {
  const user = req.user;
  if (!user || user.role !== "admin") {
    resp.status(403).json({ message: "Access denied: Admins only" });
    return;
  }
  next();
};
exports.authorize_admin = authorize_admin;
const authorize_user = (req, resp, next) => {
  const user = req.user;
  if (!user || user.role !== "user") {
    resp.status(403).json({ message: "Access denied: Admins only" });
    return;
  }
  next();
};
exports.authorize_user = authorize_user;
