import { Router } from "express";
import {
    registerController,
    verifyOtpController,
    loginController,
    forgotPasswordController,
    verifyForgotPasswordOtpController,
    resetPasswordController,
    refreshTokenController,
    getProfileController,
    editProfileController
} from "@src/controllers/authController";
import {
    registerSchema,
    loginSchema,
    verifyOtpSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOtpSchema,
    resetPasswordSchema,
    refreshTokenSchema,
    editProfileSchema
} from "@src/validations/authValidation";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";

const authRouter = Router();

authRouter.post("/register", validateSchemaPayload(registerSchema), registerController);
authRouter.post("/verify-otp", validateSchemaPayload(verifyOtpSchema), verifyOtpController);
authRouter.post("/login", validateSchemaPayload(loginSchema), loginController);
authRouter.post("/forgot-password", validateSchemaPayload(forgotPasswordSchema), forgotPasswordController);
authRouter.post("/verify-forgot-password-otp", validateSchemaPayload(verifyForgotPasswordOtpSchema), verifyForgotPasswordOtpController);
authRouter.post("/reset-password", validateSchemaPayload(resetPasswordSchema), resetPasswordController);
authRouter.post("/refresh-token", validateSchemaPayload(refreshTokenSchema), refreshTokenController);

// Profile endpoints (Requires login)
authRouter.get("/profile", protectMiddleware, getProfileController);
authRouter.patch("/profile", protectMiddleware, validateSchemaPayload(editProfileSchema), editProfileController);

export default authRouter;
