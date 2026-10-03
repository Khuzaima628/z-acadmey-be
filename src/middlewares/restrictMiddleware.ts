import { Request, Response, NextFunction } from "express";
import AppError from "@src/utils/appError";

interface AuthRequest extends Request {
  user?: any;
}
export const restrictMiddleware = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError(
        403,
        "You do not have permission to perform this action",
      );
    }
    next();
  };
};

