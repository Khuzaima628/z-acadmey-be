import { Router } from "express";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import {
    createPaymentIntentValidation,
    refundCourseValidation,
} from "@src/validations/paymentValidation";
import {
    createPaymentIntentController,
    handleWebhookController,
    refundCourseController,
} from "@src/controllers/paymentController";

const paymentRouter = Router();

// Create Payment Intent (Protected: Requires student authentication)
paymentRouter.post(
    "/create-intent",
    protectMiddleware,
    validateSchemaPayload(createPaymentIntentValidation),
    createPaymentIntentController
);

// Refund Course (Protected: Requires student authentication)
paymentRouter.post(
    "/refund",
    protectMiddleware,
    validateSchemaPayload(refundCourseValidation),
    refundCourseController
);

// Stripe Webhook (Public: called directly by Stripe with stripe-signature header)
paymentRouter.post("/webhook", handleWebhookController);

export default paymentRouter;
