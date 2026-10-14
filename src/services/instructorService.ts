import AppError from "@src/utils/appError";
import CourseModel from "@src/models/courseModel";
import UserModel from "@src/models/userModel";
import { EnrollmentModel } from "@src/models/enrollmentModel";

// 1. Get all students enrolled across all courses for this instructor
export const getInstructorStudents = async (instructorId: string) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }

    const students = await EnrollmentModel.find({
        instructor: instructorId,
        status: "active"
    })
        .populate("student", "fullName email profilePhoto bio higerEducation yearOfExperince role")
        .populate("course", "title images price category level duration rating")
        .sort({ enrolledAt: -1 });

    console.log("Found enrolled students:", students);
    return students;
};

// 2. Get students enrolled in a specific course (Screen 2 with search)
export const getCourseStudentsService = async (courseId: string, instructorId: string, query: any = {}) => {
    if (!courseId || !instructorId) {
        throw new AppError(400, "Course ID and Instructor ID are required");
    }

    // Verify course belongs to this instructor
    const course = await CourseModel.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
        throw new AppError(404, "Course not found or not owned by this instructor");
    }

    const searchMatch = query.search
        ? {
            $or: [
                { fullName: { $regex: query.search.trim(), $options: "i" } },
                { email: { $regex: query.search.trim(), $options: "i" } }
            ]
        }
        : {};

    let enrollments = await EnrollmentModel.find({
        course: courseId,
        instructor: instructorId,
        status: "active"
    })
        .populate({
            path: "student",
            match: searchMatch,
            select: "fullName email profilePhoto bio higerEducation yearOfExperince role"
        })
        .sort({ enrolledAt: -1 });

    // Filter out items where student did not match search
    if (query.search) {
        enrollments = enrollments.filter((item: any) => item.student !== null);
    }

    return enrollments;
};

// 3. Get student profile & all courses they enrolled in with this instructor (Screen 3)
export const getStudentEnrollmentsForInstructorService = async (studentId: string, instructorId: string) => {
    if (!studentId || !instructorId) {
        throw new AppError(400, "Student ID and Instructor ID are required");
    }

    // 1. Fetch Student Profile details for the top card
    const student = await UserModel.findById(studentId).select(
        "fullName email profilePhoto bio higerEducation yearOfExperince role"
    );

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    // 2. Fetch all courses this student enrolled in with this instructor
    const enrollments = await EnrollmentModel.find({
        student: studentId,
        instructor: instructorId,
        status: "active"
    })
        .populate({
            path: "course",
            select: "title images price category level duration rating slug",
            populate: { path: "instructor", select: "fullName profilePhoto" }
        })
        .sort({ enrolledAt: -1 });

    return {
        student,
        enrollments
    };
};
