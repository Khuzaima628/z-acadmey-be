import { Router } from "express";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import { Role } from "@src/models/userModel";
import {
    getInstructorStudentsController,
    getCourseStudentsController,
    getStudentEnrollmentsForInstructorController
} from "@src/controllers/instructorController";

const instructorRouter = Router();

// Protect all routes: Must be logged in AND role must be INSTRUCTOR
instructorRouter.use(protectMiddleware);
instructorRouter.use(restrictMiddleware(Role.INSTRUCTOR));

// 1. Get all students enrolled in a specific course (Screen 2: "View Enrollment")
instructorRouter.get("/courses/:courseId/students", getCourseStudentsController);

// 2. Get a student profile & their courses with this instructor (Screen 3: "View Profile")
instructorRouter.get("/students/:studentId", getStudentEnrollmentsForInstructorController);

// 3. Get all students across all courses for this instructor
instructorRouter.get("/students", getInstructorStudentsController);

export default instructorRouter;
