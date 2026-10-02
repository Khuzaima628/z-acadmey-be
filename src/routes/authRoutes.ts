import { Router } from "express";
import {
    registerController,
    verifyOtpController,
    loginController,
    forgotPasswordController,
    verifyForgotPasswordOtpController,
    resetPasswordController,
    refreshTokenController
} from "@src/controllers/authController";
import {
    registerSchema,
    loginSchema,
    verifyOtpSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOtpSchema,
    resetPasswordSchema,
    refreshTokenSchema
} from "@src/validations/authValidation";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";

const authRouter = Router();

authRouter.post("/register", validateSchemaPayload(registerSchema), registerController);
authRouter.post("/verify-otp", validateSchemaPayload(verifyOtpSchema), verifyOtpController);
authRouter.post("/login", validateSchemaPayload(loginSchema), loginController);
authRouter.post("/forgot-password", validateSchemaPayload(forgotPasswordSchema), forgotPasswordController);
authRouter.post("/verify-forgot-password-otp", validateSchemaPayload(verifyForgotPasswordOtpSchema), verifyForgotPasswordOtpController);
authRouter.post("/reset-password", validateSchemaPayload(resetPasswordSchema), resetPasswordController);
authRouter.post("/refresh-token", validateSchemaPayload(refreshTokenSchema), refreshTokenController);

export default authRouter;
