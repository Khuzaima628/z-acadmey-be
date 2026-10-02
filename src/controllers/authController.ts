import catchAsync from "@src/utils/catchAsync";
import { Response, Request } from "express";
import {
    registerServices,
    verifyOtpService,
    loginService,
    forgotPasswordService,
    verifyForgotPasswordOtpService,
    resetPasswordService,
    refreshTokenRotation
} from "@src/services/authService";
import apiResponse from "@src/utils/apiResponse";

export const registerController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const user = await registerServices(body)
    const message = "User Created And Otp Sent Successfully"
    apiResponse.success(res, user, message, 201);
})

export const verifyOtpController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const user = await verifyOtpService(body)
    const message = "Your Account is Verified And under Review"
    apiResponse.success(res, user, message, 200);
})

export const loginController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const data = await loginService(body)
    const message = "Login Successful"
    apiResponse.success(res, data, message, 200);
})

export const forgotPasswordController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const otp = await forgotPasswordService(email)
    const message = "OTP Sent Successfully To Your Email"
    apiResponse.success(res, { otp }, message, 200);
})

export const verifyForgotPasswordOtpController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const data = await verifyForgotPasswordOtpService(email, otp)
    const message = "OTP Verified Successfully. Use the token to reset your password"
    apiResponse.success(res, data, message, 200);
})

export const resetPasswordController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    const data = await resetPasswordService(token, newPassword)
    const message = "Password Reset Successfully"
    apiResponse.success(res, data, message, 200);
})

export const refreshTokenController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const data = await refreshTokenRotation(refreshToken);
    const message = "Token Refreshed Successfully";
    apiResponse.success(res, data, message, 200);
});
