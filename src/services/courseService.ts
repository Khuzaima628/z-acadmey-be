import CourseModel from "@src/models/courseModel";
import UserModel from "@src/models/userModel";
import AppError from "@src/utils/appError";
import { courseType } from "@src/types/courseTypes";


// Create Course Service
export const createCourseService = async (body: courseType, instructorId: string) => {
  const slug = body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const duplicate = await CourseModel.findOne({ title: body.title })
  if (duplicate) {
    throw new AppError(400, "Course already exists");
  }
  const course = await CourseModel.create({ ...body, slug, instructor: instructorId })
  return course;
}


const fetchCoursesWithFilters = async (query: any, baseFilter: any = {}) => {
  const filter: any = { ...baseFilter };

  if (query.search) {
    filter.title = { $regex: query.search.trim(), $options: "i" };
  }

  if (query.category) {
    filter.category = query.category.toLowerCase().trim();
  }

  if (query.level) {
    filter.level = query.level.toLowerCase().trim();
  }

  if (query.instructor && !filter.instructor) {
    filter.instructor = query.instructor;
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log("Course filter applied:", filter);

  const courses = await CourseModel.find(filter)
    .populate("instructor", "fullName email bio")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCourses = await CourseModel.countDocuments(filter);

  return {
    courses,
    pagination: {
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      limit,
    },
  };
};

export const getMyCoursesService = async (instructorId: string, query: any = {}) => {
  return await fetchCoursesWithFilters(query, { instructor: instructorId });
};
export const getAllCoursesService = async (query: any = {}) => {
  return await fetchCoursesWithFilters(query);
};


//   Get Course By Id
export const getCourseByIdService = async (courseId: string, instructorId: string) => {
  const course = await CourseModel.findById(courseId)
  if (!course || !instructorId) {
    throw new AppError(404, "Course not found");
  }
  if (course.instructor.toString() !== instructorId.toString()) {
    throw new AppError(403, "You are not authorized to access this course");
  }
  return course;
}


// Update Course Service
export const updateCourseService = async (body: courseType, instructorId: string, courseId: string) => {
  const updatedCourse = await CourseModel.findByIdAndUpdate({ _id: courseId }, body, { new: true, runValidators: true })
  if (!updatedCourse) {
    throw new AppError(404, "Course not found");
  }
  if (updatedCourse.instructor.toString() !== instructorId.toString()) {
    throw new AppError(403, "You are not authorized to update this course");
  }
  return updatedCourse;
}

// Delete Course Service
export const deleteCourseService = async (courseId: string, instructorId: string) => {
  const deletedCourse = await CourseModel.findByIdAndDelete(courseId)
  if (!deletedCourse) {
    throw new AppError(404, "Course not found");
  }
  if (deletedCourse.instructor.toString() !== instructorId.toString()) {
    throw new AppError(403, "You are not authorized to delete this course");
  }
  return { deletedCourse: deletedCourse.title };
}
