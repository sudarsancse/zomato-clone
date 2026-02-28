import { Request, Response, NextFunction } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../model/Use.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No auth header",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "Please Login - token messing",
      });
      return;
    }

    const decodedValue = Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalide token",
      });
      return;
    }
    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Please Login - jwt error",
    });
  }
};
