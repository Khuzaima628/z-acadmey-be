import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
    getInstructorStudents,
    getCourseStudentsService,
    getStudentEnrollmentsForInstructorService
} from "@src/services/instructorService";

// 1. Get all students enrolled across all instructor courses
export const getInstructorStudentsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const data = await getInstructorStudents(instructorId);
    apiResponse.success(res, data, "All enrolled students fetched successfully", 200);
});

// 2. Get students of a specific course (with optional search)
export const getCourseStudentsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const { courseId } = req.params;
    const data = await getCourseStudentsService(courseId, instructorId, req.query);
    apiResponse.success(res, data, "Course students fetched successfully", 200);
});

// 3. Get student profile & their courses with this instructor
export const getStudentEnrollmentsForInstructorController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const { studentId } = req.params;
    const data = await getStudentEnrollmentsForInstructorService(studentId, instructorId);
    apiResponse.success(res, data, "Student profile and enrollments fetched successfully", 200);
});
