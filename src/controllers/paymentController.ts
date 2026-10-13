import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
    createPaymentIntentService,
    handleWebhookService,
    refundCourseService,
} from "@src/services/paymentService";
import AppError from "@src/utils/appError";

// Create Payment Intent Controller
export const createPaymentIntentController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;
    const { courseId } = req.body;
    const data = await createPaymentIntentService(courseId, studentId);
    apiResponse.success(res, data, "Payment intent created successfully", 200);
});

// Refund Course Controller
export const refundCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;
    const { courseId } = req.body;
    const data = await refundCourseService(courseId, studentId);
    apiResponse.success(res, data, "Course refunded successfully", 200);
});

// Handle Stripe Webhook Controller
export const handleWebhookController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers["stripe-signature"] as string;
    const rawBody = (req as any).rawBody;

    if (!signature) {
        throw new AppError(400, "Missing Stripe signature header");
    }
    if (!rawBody) {
        throw new AppError(400, "Missing raw request body for signature verification");
    }

    const data = await handleWebhookService(signature, rawBody);
    res.status(200).json(data);
});
