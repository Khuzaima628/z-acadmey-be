import catchAsync from "@src/utils/catchAsync";
import {
    createCourseService,
    updateCourseService,
    getCourseByIdService,
    deleteCourseService,
    getMyCoursesService,
    getAllCoursesService
} from "@src/services/courseService";
import { Request, Response } from "express";
import apiResponse from "@src/utils/apiResponse";

// Get All Courses Controller
export const getAllCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await getAllCoursesService(req.query);
    const message = "Courses fetched successfully";
    apiResponse.success(res, data, message, 200);
});

// Get My Courses Controller 
export const getMyCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const courses = await getMyCoursesService(instructorId, req.query);
    const message = "Courses fetched successfully";
    apiResponse.success(res, courses, message, 200);
});

// Create Course Controller
export const createCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const course = await createCourseService(req.body, instructorId);
    const message = "Course created successfully";
    apiResponse.success(res, course, message, 201);
});

// Update Course Controller
export const updateCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const courseId = req.params.id;
    const course = await updateCourseService(req.body, instructorId, courseId);
    const message = "Course updated successfully";
    apiResponse.success(res, course, message, 200);
});

//   Get Course By Id Controller
export const getCourseByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const courseId = req.params.id;
    const course = await getCourseByIdService(courseId, instructorId);
    const message = "Course fetched successfully";
    apiResponse.success(res, course, message, 200);
});

// Delete Course Controller
export const deleteCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructorId = req.user._id;
    const courseId = req.params.id;
    const course = await deleteCourseService(courseId, instructorId);
    const message = "Course deleted successfully";
    apiResponse.success(res, course, message, 200);
});

