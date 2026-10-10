import { Router } from "express";
import { 
    getAllStudentsController,
    acceptInstructorController,
    getAllInstructorsController,
    getInstructorByIdController,
    getStudentByIdController
} from "@src/controllers/adminController";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import { Role } from "@src/models/userModel";

const adminRouter = Router();

// Instructors
adminRouter.get("/instructors", protectMiddleware, restrictMiddleware(Role.ADMIN), getAllInstructorsController);
adminRouter.get("/instructors/:id", protectMiddleware, restrictMiddleware(Role.ADMIN), getInstructorByIdController);
adminRouter.post("/instructors/:id/accept", protectMiddleware, restrictMiddleware(Role.ADMIN), acceptInstructorController);

// Students
adminRouter.get("/students", protectMiddleware, restrictMiddleware(Role.ADMIN), getAllStudentsController);
adminRouter.get("/students/:id", protectMiddleware, restrictMiddleware(Role.ADMIN), getStudentByIdController);

export default adminRouter;

