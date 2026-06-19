import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { NextFunction, Request, Response } from "express";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  let user_id = null;

  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (err) {
    user_id = null;
  }
  next();
};
