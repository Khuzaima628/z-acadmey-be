import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import apiResponse from "@src/utils/apiResponse";
import {
    updateWatchedTimeService,
    getContinueWatchingCoursesService,
    getRecentActivityService,
    getEnrolledCoursesService
} from "@src/services/studentService";

// 1. Update Watched Time Controller
export const updateWatchedTimeController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;
    const { courseId, watched_time } = req.body;

    const data = await updateWatchedTimeService(studentId, courseId, watched_time);
    apiResponse.success(res, data, "Watched time updated successfully", 200);
});

// 2. Get Continue Watching Courses Controller
export const getContinueWatchingCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;

    const data = await getContinueWatchingCoursesService(studentId);
    apiResponse.success(res, data, "Continue watching courses fetched successfully", 200);
});

// 3. Get Recent Activity Controller
export const getRecentActivityController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;

    const data = await getRecentActivityService(studentId);
    apiResponse.success(res, data, "Recent activity fetched successfully", 200);
});

// 4. Get Enrolled Courses Controller (Table with search)
export const getEnrolledCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.user._id;

    const data = await getEnrolledCoursesService(studentId, req.query);
    apiResponse.success(res, data, "Enrolled courses fetched successfully", 200);
});
