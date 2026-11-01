import { Router } from "express";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";
import { updateWatchedTimeValidation, createReviewValidation } from "@src/validations/studentValidation";
import {
    updateWatchedTimeController,
    getContinueWatchingCoursesController,
    getRecentActivityController,
    getEnrolledCoursesController,
    createReviewController
} from "@src/controllers/studentController";

const studentRouter = Router();

// All student routes require authentication
studentRouter.use(protectMiddleware);

// GET /api/v1/student/enrolled-courses (Table of enrolled courses with search)
studentRouter.get("/enrolled-courses", getEnrolledCoursesController);

// GET /api/v1/student/continue-watching
studentRouter.get("/continue-watching", getContinueWatchingCoursesController);

// GET /api/v1/student/activity (Recent Activity Table)
studentRouter.get("/activity", getRecentActivityController);

// PATCH /api/v1/student/watched-time
studentRouter.patch(
    "/watched-time",
    validateSchemaPayload(updateWatchedTimeValidation),
    updateWatchedTimeController
);

// POST /api/v1/student/review (Write a Review Modal)
studentRouter.post(
    "/review",
    validateSchemaPayload(createReviewValidation),
    createReviewController
);

export default studentRouter;
