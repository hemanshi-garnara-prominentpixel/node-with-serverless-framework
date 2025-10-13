import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UserAuthI extends Request {
  user?: { id: string; email: string };
}
export const userAuth = async (
  req: UserAuthI,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
