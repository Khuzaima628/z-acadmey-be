import AppError from "@src/utils/appError";
import CourseModel from "@src/models/courseModel";
import UserModel from "@src/models/userModel";
import { EnrollmentModel } from "@src/models/enrollmentModel";
import ReviewModel from "@src/models/reviewModel";
import { Types } from "mongoose";

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

// Stats card Api
export const instructorStatsService = async (instructorId: string) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }

    // 1. Get Total Students
    const totalStudents = await EnrollmentModel.countDocuments({
        instructor: instructorId,
        status: "active"
    });

    // 2. Get Total Courses
    const totalCourses = await CourseModel.countDocuments({
        instructor: instructorId
    });

    // 3. Get Total Earnings (assuming EnrollmentModel has 'price' field)
    const totalEarnings = await EnrollmentModel.aggregate([
        {
            $match: {
                instructor: new Types.ObjectId(instructorId),
                status: "active",
                pricePaid: { $gt: 0 }  // Only count paid enrollments
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$pricePaid" }
            }
        }
    ]);

    const grossRevenue = totalEarnings[0]?.total || 0;
    const adminRevenue = grossRevenue * 0.05;
    const instructorEarnings = grossRevenue - adminRevenue;

    return {
        totalStudents,
        totalCourses,
        totalRevenue: grossRevenue,
        adminRevenue,
        totalEarnings: instructorEarnings
    };
};

export const montlyRevenueByCourseService = async (instructorId: string) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }

    const revenueByCourse = await EnrollmentModel.aggregate([
        {
            $match: {
                instructor: new Types.ObjectId(instructorId),
                status: "active"
            }
        },
        {
            $group: {
                _id: "$course",
                totalRevenue: { $sum: "$pricePaid" },
                totalStudents: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $unwind: {
                path: "$courseDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                courseId: "$_id",
                courseTitle: { $ifNull: ["$courseDetails.title", "Unknown Course"] },
                totalRevenue: 1,
                totalStudents: 1
            }
        },
        {
            $sort: {
                totalRevenue: -1
            }
        }
    ]);

    return revenueByCourse;
};

export const weekWiseEnrollmentsTrend = async (instructorId: string) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const lastFourWeeks = await EnrollmentModel.aggregate([
        {
            $match: {
                instructor: new Types.ObjectId(instructorId),
                status: "active",
                enrolledAt: {
                    $gte: fourWeeksAgo,
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: "$enrolledAt" },
                    week: { $isoWeek: "$enrolledAt" }
                },
                totalStudents: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.week": 1
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                week: "$_id.week",
                label: { $concat: ["Week ", { $toString: "$_id.week" }] },
                totalStudents: 1
            }
        }
    ]);

    return lastFourWeeks;
};

// 6. Course Performance (Table 1: Title, Status, Enrollments, Rating, Avg. Completion, Revenue)
export const getCoursePerformanceService = async (instructorId: string) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }

    // 1. Fetch all courses for this instructor
    const courses = await CourseModel.find({ instructor: instructorId }).sort({ createdAt: -1 });

    // 2. Fetch all active enrollments for this instructor
    const enrollments = await EnrollmentModel.find({
        instructor: instructorId,
        status: "active"
    });

    // 3. Fetch ratings summary per course from ReviewModel
    const reviews = await ReviewModel.aggregate([
        {
            $match: { instructor: new Types.ObjectId(instructorId) }
        },
        {
            $group: {
                _id: "$course",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const reviewMap = new Map<string, { avgRating: number; totalReviews: number }>();
    reviews.forEach((r: any) => {
        reviewMap.set(r._id.toString(), {
            avgRating: Math.round(r.avgRating * 10) / 10,
            totalReviews: r.totalReviews
        });
    });

    // 4. Map each course to performance statistics
    const performance = courses.map((course: any) => {
        const courseIdStr = course._id.toString();
        const courseEnrollments = enrollments.filter(
            (e: any) => e.course.toString() === courseIdStr
        );

        const totalEnrollmentsCount = courseEnrollments.length;
        const totalRevenue = courseEnrollments.reduce((sum: number, e: any) => sum + (e.pricePaid || 0), 0);

        // Average Completion calculation
        let avgCompletion = 0;
        if (totalEnrollmentsCount > 0) {
            const totalWatched = courseEnrollments.reduce((sum: number, e: any) => sum + (e.watched_time || 0), 0);
            const avgWatched = totalWatched / totalEnrollmentsCount;

            const durationNumber = parseFloat(course.duration) || 0;
            if (durationNumber > 0) {
                let durationInSeconds = durationNumber;
                const durStr = (course.duration || "").toLowerCase();
                if (durStr.includes("h")) {
                    durationInSeconds = durationNumber * 3600;
                } else if (durStr.includes("m")) {
                    durationInSeconds = durationNumber * 60;
                }
                avgCompletion = Math.min(100, Math.round((avgWatched / durationInSeconds) * 100));
            } else {
                avgCompletion = Math.min(100, Math.round(avgWatched));
            }
        }

        const reviewStats = reviewMap.get(courseIdStr);
        const rating = reviewStats?.avgRating || course.rating || 0;

        return {
            courseId: course._id,
            title: course.title,
            slug: course.slug,
            status: course.status === "published" ? "Live" : (course.status.charAt(0).toUpperCase() + course.status.slice(1)),
            rawStatus: course.status,
            enrollments: totalEnrollmentsCount,
            rating,
            avgCompletion,
            revenue: totalRevenue
        };
    });

    return performance;
};

// 7. Recent Reviews (Table 2: Course, Student, Rating, Review, Date)
export const getRecentReviewsService = async (instructorId: string, limit: number = 10) => {
    if (!instructorId) {
        throw new AppError(400, "Instructor ID is required");
    }

    const reviews = await ReviewModel.find({ instructor: instructorId })
        .populate("course", "title slug images")
        .populate("student", "fullName profilePhoto email")
        .sort({ createdAt: -1 })
        .limit(Number(limit) || 10);

    return reviews;
};
