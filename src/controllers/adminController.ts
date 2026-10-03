
import { Request, Response } from "express";
import catchAsync from "@src/utils/catchAsync";
import { getAllInstructorsService, acceptInstructorService,getAllStudentsService } from "@src/services/adminService";
import apiResponse from "@src/utils/apiResponse";

export const getAllInstructorsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const instructors = await getAllInstructorsService(req.query);
    apiResponse.success(res, instructors, "Instructors fetched successfully", 200);
});

export const acceptInstructorController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await acceptInstructorService(id);
    apiResponse.success(res, user, "Instructor accepted successfully", 200);
})

export const getAllStudentsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const students = await getAllStudentsService(req.query);
    apiResponse.success(res, students, "Students fetched successfully", 200);
});
