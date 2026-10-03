import bcrypt from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
import AppError from "@src/utils/appError";
import UserModel, { Role, UserType } from "@src/models/userModel";
import { verifyOtpType, loginType } from "@src/types/authTypes"
import { loginAccessToken, loginRefreshToken, forgotPasswordAccessToken, verifyforgotPasswordAccessToken, verifyRefreshToken } from "@src/utils/jwt"

export const registerServices = async (body: UserType) => {
    const { email } = body;
    const isUserExist = await UserModel.findOne({ email })
    if (isUserExist) {
        throw new AppError(400, "User already exists")
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("THE OTP IS: ".bgBlue, otp);
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const hashPassword = await bcrypt.hash(body.password, 10)
    const isApprovedByAdmin = body.role === Role.STUDENT;
    const user = await UserModel.create({
        ...body,
        password: hashPassword,
        otp,
        otpExpiry,
        isApprovedByAdmin
    })
    const safeUser = user.toObject()
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpiry;
    return safeUser

}

export const verifyOtpService = async (body: verifyOtpType) => {
    const { email, otp } = body;
    if (!email) {
        throw new AppError(400, "Please enter your Email")
    }
    if (!otp) {
        throw new AppError(400, "Please enter your Otp")
    }
    const user = await UserModel.findOne({ email }).select("+otp +otpExpiry")
    if (!user) {
        throw new AppError(404, "User not found")
    }
    if (otp !== user.otp) {
        throw new AppError(400, "Invalid OTP")
    }
    if (user.otpExpiry < Date.now()) {
        throw new AppError(400, "OTP has expired")
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined

    await user.save()
    return {
        isVerified: user.isVerified
    }
}

export const loginService = async (body: loginType, role: string) => {
    const { email, password, rememberMe } = body;
    const userRole = role
    if (!email || !password) {
        throw new AppError(400, "Please enter your Email and Password")
    }
    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(404, "User not found")
    }
    if (!user.isVerified) {
        throw new AppError(401, "Your account is not verified")
    }
    if (!user.isApprovedByAdmin) {
        throw new AppError(401, "Your account is not approved by admin")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new AppError(400, "Invalid Password")
    }
    const payload = {
        email,
        id: user._id,
        userRole: user.role
    }
    const accessToken = loginAccessToken(payload);
    const refreshToken = loginRefreshToken(payload);

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpiry;

    return { accessToken, refreshToken, user: safeUser };
}

export const forgotPasswordService = async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(404, "User not found")
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("THE OTP IS: ".bgBlue, otp);
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save()
    return otp
}

export const verifyForgotPasswordOtpService = async (email: string, otp: number) => {
    const user = await UserModel.findOne({ email }).select("+otp +otpExpiry")
    if (!user) {
        throw new AppError(404, "User not found")
    }
    if (otp !== user.otp) {
        throw new AppError(400, "Invalid OTP")
    }
    if (user.otpExpiry < Date.now()) {
        throw new AppError(400, "OTP has expired")
    }

    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    const forgotPasswordToken = forgotPasswordAccessToken({ email })
    return { forgotPasswordToken }
}

export const resetPasswordService = async (token: string, newPassword: string) => {
    const decoded = verifyforgotPasswordAccessToken(token) as JwtPayload
    if (!decoded || !decoded.email) {
        throw new AppError(400, "Invalid or expired reset token")
    }
    const user = await UserModel.findOne({ email: decoded.email })
    if (!user) {
        throw new AppError(404, "User not found")
    }
    const hashPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashPassword
    await user.save()

    return { message: "Password reset successfully" }
}

export const refreshTokenRotation = async (token: string) => {
    if (!token) {
        throw new AppError(400, "Refresh Token is required");
    }

    let decoded: JwtPayload;
    try {
        // Wrap in try-catch because jwt.verify throws an exception if expired or tampered
        decoded = verifyRefreshToken(token) as JwtPayload;
    } catch (error) {
        throw new AppError(401, "Invalid or expired refresh token");
    }

    if (!decoded || !decoded.email) {
        throw new AppError(401, "Invalid token payload");
    }

    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Generate new pair
    const accessToken = loginAccessToken({ email: user.email, id: user._id });
    const refreshToken = loginRefreshToken({ email: user.email, id: user._id });

    return { accessToken, refreshToken };
};
