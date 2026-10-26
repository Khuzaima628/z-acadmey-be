import { Router } from "express";
import { 
    createCourseController, 
    getCourseByIdController, 
    getCourseDetailsController,
    updateCourseController, 
    deleteCourseController,
    getMyCoursesController,
    getAllCoursesController
} from "@src/controllers/courseController";
import { courseValidation, updateCourseValidation } from "@src/validations/courseValidation";
import { protectMiddleware } from "@src/middlewares/protectMiddleware";
import { restrictMiddleware } from "@src/middlewares/restrictMiddleware";
import validateSchemaPayload from "@src/utils/validateSchemaPayload";

const courseRouter = Router();

// 1. Get All Courses (Public catalog with search, filters, pagination)
courseRouter.get("/", getAllCoursesController);

// Public Course Details (for students & visitors clicking 'View Details')
courseRouter.get("/details/:id", getCourseDetailsController);

// 2. Create Course Route
courseRouter.post("/create", protectMiddleware, restrictMiddleware("instructor"), validateSchemaPayload(courseValidation), createCourseController);

// Update Course Route
courseRouter.patch("/update/:id", protectMiddleware, restrictMiddleware("instructor"), validateSchemaPayload(updateCourseValidation), updateCourseController)

// Get My Courses (Instructor only) - Notice: MUST be placed before /:id!
courseRouter.get("/my-courses", protectMiddleware, restrictMiddleware("instructor"), getMyCoursesController)

// Get Course By Id Route
courseRouter.get("/:id", protectMiddleware, restrictMiddleware("instructor"), getCourseByIdController)

// Delete Course Route
courseRouter.delete("/:id", protectMiddleware, restrictMiddleware("instructor"), deleteCourseController)

export default courseRouter
