import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
    getInstructorStudents,
    getCourseStudentsService,
    getStudentEnrollmentsForInstructorService,
    instructorStatsService,
    montlyRevenueByCourseService,
    weekWiseEnrollmentsTrend,
    getCoursePerformanceService,
    getRecentReviewsService
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

// 4. Get instructor dashboard summary cards
export const getInstructorStatsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const data = await instructorStatsService(instructorId);
    apiResponse.success(res, data, "Instructor dashboard stats fetched successfully", 200);
});

// 5. Get course-wise revenue breakdown
export const getRevenueByCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const data = await montlyRevenueByCourseService(instructorId);
    apiResponse.success(res, data, "Course revenue breakdown fetched successfully", 200);
});

// 6. Get weekly enrollment trends (last 4 weeks)
export const getWeeklyEnrollmentsTrendController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const data = await weekWiseEnrollmentsTrend(instructorId);
    apiResponse.success(res, data, "Weekly enrollments trend fetched successfully", 200);
});

// 7. Get course performance table (Title, Status, Enrollments, Rating, Avg. Completion, Revenue)
export const getCoursePerformanceController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const data = await getCoursePerformanceService(instructorId);
    apiResponse.success(res, data, "Course performance fetched successfully", 200);
});

// 8. Get recent reviews table (Course, Student, Rating, Review, Date)
export const getRecentReviewsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const limit = Number(req.query.limit) || 10;
    const data = await getRecentReviewsService(instructorId, limit);
    apiResponse.success(res, data, "Recent reviews fetched successfully", 200);
});
