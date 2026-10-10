
import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import { 
    getAllInstructorsService, 
    acceptInstructorService, 
    getAllStudentsService,
    getUserByIdService
} from "@src/services/adminService";
import { Role } from "@src/models/userModel";
import apiResponse from "@src/utils/apiResponse";

export const getAllInstructorsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructors = await getAllInstructorsService(req.query);
    apiResponse.success(res, instructors, "Instructors fetched successfully", 200);
});

export const acceptInstructorController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await acceptInstructorService(id);
    apiResponse.success(res, user, "Instructor accepted successfully", 200);
});

export const getAllStudentsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const students = await getAllStudentsService(req.query);
    apiResponse.success(res, students, "Students fetched successfully", 200);
});

export const getInstructorByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const instructor = await getUserByIdService(id, Role.INSTRUCTOR);
    apiResponse.success(res, instructor, "Instructor fetched successfully", 200);
});

export const getStudentByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const student = await getUserByIdService(id, Role.STUDENT);
    apiResponse.success(res, student, "Student fetched successfully", 200);
});

