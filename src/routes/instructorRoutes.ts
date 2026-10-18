import { Router } from "express";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import { Role } from "@src/models/userModel";
import {
    getInstructorStudentsController,
    getCourseStudentsController,
    getStudentEnrollmentsForInstructorController,
    getInstructorStatsController,
    getRevenueByCourseController,
    getWeeklyEnrollmentsTrendController,
    getCoursePerformanceController,
    getRecentReviewsController
} from "@src/controllers/instructorController";

const instructorRouter = Router();

// Protect all routes: Must be logged in AND role must be INSTRUCTOR
instructorRouter.use(protectMiddleware);
instructorRouter.use(restrictMiddleware(Role.INSTRUCTOR));

// Dashboard Stats & Analytics
instructorRouter.get("/stats", getInstructorStatsController);
instructorRouter.get("/revenue-by-course", getRevenueByCourseController);
instructorRouter.get("/weekly-trends", getWeeklyEnrollmentsTrendController);

// Dashboard Tables (Screenshots)
instructorRouter.get("/course-performance", getCoursePerformanceController);
instructorRouter.get("/recent-reviews", getRecentReviewsController);

// Students & Course Enrollments
instructorRouter.get("/courses/:courseId/students", getCourseStudentsController);
instructorRouter.get("/students/:studentId", getStudentEnrollmentsForInstructorController);
instructorRouter.get("/students", getInstructorStudentsController);

export default instructorRouter;
