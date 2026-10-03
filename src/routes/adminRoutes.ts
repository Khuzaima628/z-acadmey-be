import { Router } from "express";
import { getAllStudentsController,acceptInstructorController,getAllInstructorsController } from "@src/controllers/adminController";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import { Role } from "@src/models/userModel";

const adminRouter = Router();

adminRouter.get("/instructors", protectMiddleware, restrictMiddleware(Role.ADMIN),getAllInstructorsController)
adminRouter.post("/instructors/:id/accept",protectMiddleware,restrictMiddleware(Role.ADMIN),acceptInstructorController)
adminRouter.get("/students", protectMiddleware, restrictMiddleware(Role.ADMIN),getAllStudentsController)

export default adminRouter;
