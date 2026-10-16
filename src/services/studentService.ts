import { EnrollmentModel } from "@src/models/enrollmentModel";
import { CourseModel } from "@src/models/courseModel";
import { ActivityModel, ActivityType } from "@src/models/activityModel";
import AppError from "@src/utils/appError";


export const updateWatchedTimeService = async (
    studentId: string,
    courseId: string,
    watched_time: number
) => {
    if (!courseId) {
        throw new AppError(400, "Course ID is required");
    }
    if (!watched_time) {
        throw new AppError(400, "Watched time is required");
    }
    if (!studentId) {
        throw new AppError(400, "Student ID is required");
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
        throw new AppError(404, "Course not found");
    }
    const updateTime = await EnrollmentModel.findOneAndUpdate(
        { student: studentId, course: courseId },
        { $set: { watched_time } },
        { new: true }
    );
    if (!updateTime) {
        throw new AppError(404, "Watched time not updated");
    }
    return updateTime;
};

export const getContinueWatchingCoursesService = async (studentId: string) => {
    if (!studentId) {
        throw new AppError(400, "Student ID is required");
    }
    const continueWatchingCourses = await EnrollmentModel.find({ student: studentId, status: 'active' }).populate("course");
    if (!continueWatchingCourses) {
        throw new AppError(404, "Continue watching courses not found");
    }
    return continueWatchingCourses;
};

export const getRecentActivityService = async (studentId: string) => {
    if (!studentId) {
        throw new AppError(400, "Student ID is required");
    }

    // 1. Fetch activities from ActivityModel (newest first)
    const activities = await ActivityModel.find({ student: studentId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("course", "title");

    // 2. If no activities logged yet, generate from existing enrollments
    if (activities.length === 0) {
        const enrollments = await EnrollmentModel.find({ student: studentId, status: "active" })
            .populate("course", "title")
            .sort({ enrolledAt: -1 })
            .limit(10);

        return enrollments.map((enr: any) => ({
            _id: enr._id,
            activity: ActivityType.COURSE_ENROLLED,
            details: enr.course?.title || "Course Enrolled",
            course: enr.course,
            createdAt: enr.enrolledAt,
        }));
    }

    return activities;
};

export const getEnrolledCoursesService = async (studentId: string, query: any = {}) => {
    if (!studentId) {
        throw new AppError(400, "Student ID is required");
    }

    const searchFilter = query.search
        ? { title: { $regex: query.search.trim(), $options: "i" } }
        : {};

    let enrollments = await EnrollmentModel.find({
        student: studentId,
        status: "active",
    })
        .populate({
            path: "course",
            match: searchFilter,
            select: "title images category level duration price slug rating",
        })
        .populate("instructor", "fullName email profilePhoto")
        .sort({ enrolledAt: -1 });

    // If searching, filter out enrollments where course did not match
    if (query.search) {
        enrollments = enrollments.filter((item: any) => item.course !== null);
    }

    return enrollments;
};

