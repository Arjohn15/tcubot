import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

export const authenticate = (
  req: Request,
  resp: Response,
  next: NextFunction
): any => {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    return resp.status(403).json({ message: "No token" });
  }

  const token = auth_header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;

    next();
  } catch {
    return resp
      .status(401)
      .json({ message: "Session expired or token is invalid" });
  }
};

export const authorize_admin = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    resp.status(403).json({ message: "Access denied: Admins only" });
    return;
  }

  next();
};

export const authorize_user = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user || user.role !== "user") {
    resp.status(403).json({ message: "Access denied: Admins only" });
    return;
  }

  next();
};
