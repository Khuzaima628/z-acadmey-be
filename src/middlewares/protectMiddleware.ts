import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import UserModel from "@src/models/userModel";
import { verifyAccessToken } from "../utils/jwt";

interface CustomJwtPayload extends JwtPayload {
    id?: string;
    _id?: string;
    email?: string;
}

export interface AuthRequest extends Request {
    user?: any;
}

export const protectMiddleware = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new AppError(401, "You are not logged in. Please log in to continue.");
    }

    const decodedToken = verifyAccessToken(token) as CustomJwtPayload;
    const userId = decodedToken.id || decodedToken._id;

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new AppError(404, "User not found");
    }

    req.user = user;
    next();
});
