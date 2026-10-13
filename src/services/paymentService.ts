import { stripe } from "@src/config/stripe";
import AppError from '@src/utils/appError'
import { CourseModel } from "@src/models/courseModel"
import { UserModel } from "@src/models/userModel"
import { EnrollmentModel, EnrollmentStatus } from '@src/models/enrollmentModel'
import { ActivityModel, ActivityType } from "@src/models/activityModel";
import { CreatePaymentIntentInput } from "@src/types/paymentTypes"



export const createPaymentIntentService = async (courseId: string, studentId: string) => {
    if (!courseId) {
        throw new AppError(400, "Course Id is Required")
    }
    if (!studentId) {
        throw new AppError(400, "Student Id is Required")
    }
    const buyCourse = await EnrollmentModel.findOne({ course: courseId, student: studentId })
    if (buyCourse?.status === 'active') {
        throw new AppError(400, "You already buy this course")
    }
    const findCourse = await CourseModel.findById(courseId)
    if (!findCourse) {
        throw new AppError(400, " Course not Found")
    }
    const coursePrice = findCourse.price
    const coursePriceInCent = Math.round(coursePrice * 100)
    const createIntent = await stripe.paymentIntents.create({
        amount: coursePriceInCent,
        currency: "usd",
        metadata: {
            courseId: courseId.toString(),
            studentId: studentId.toString()
        }
    });
    return {
        clientSecret: createIntent.client_secret,
        paymentIntentId: createIntent.id,
    };
}

// Handling Webhooks



export const refundCourseService = async (courseId: string, studentId: string) => {
    // 1. Find the active enrollment
    const enrollment = await EnrollmentModel.findOne({
        course: courseId,
        student: studentId,
        status: "active",
    });

    if (!enrollment) {
        throw new AppError(404, "No active enrollment found for this course");
    }

    if (!enrollment.paymentIntentId) {
        throw new AppError(400, "No payment intent found for this enrollment to refund");
    }

    // 2. Issue the refund via Stripe
    const refund = await stripe.refunds.create({
        payment_intent: enrollment.paymentIntentId,
        reason: "requested_by_customer",
    });

    // 3. Mark enrollment as refunded
    enrollment.status = EnrollmentStatus.REFUNDED;
    await enrollment.save();

    // 4. Deduct money from instructor's earnings
    await UserModel.findByIdAndUpdate(enrollment.instructor, {
        $inc: { totalEarnings: -enrollment.pricePaid },
    });

    return {
        message: "Refund processed successfully",
        refundId: refund.id,
    };
};


export const handleWebhookService = async (signature: string, rawBody: Buffer) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        throw new AppError(400, `Webhook signature verification failed: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as any;
        const { courseId, studentId } = paymentIntent.metadata || {};

        if (courseId && studentId) {
            // Prevent duplicate enrollment if Stripe retries
            const existingEnrollment = await EnrollmentModel.findOne({
                paymentIntentId: paymentIntent.id,
            });

            if (!existingEnrollment) {
                const course = await CourseModel.findById(courseId);
                if (!course) {
                    throw new AppError(404, "Course not found");
                }

                const pricePaid = (paymentIntent.amount_received || paymentIntent.amount) / 100;

                await EnrollmentModel.create({
                    student: studentId,
                    course: courseId,
                    instructor: course.instructor,
                    pricePaid,
                    paymentIntentId: paymentIntent.id,
                    status: "active",
                });

                await ActivityModel.create({
                    student: studentId,
                    activity: ActivityType.COURSE_ENROLLED,
                    details: course.title,
                    course: courseId,
                });

                await UserModel.findByIdAndUpdate(course.instructor, {
                    $inc: { totalEarnings: pricePaid },
                });
            }

        }
    }
    if (event.type === "charge.refunded") {
        const charge = event.data.object as any;
        const paymentIntentId = charge.payment_intent;

        const enrollment = await EnrollmentModel.findOne({ paymentIntentId, status: "active" });

        if (enrollment) {
            enrollment.status = EnrollmentStatus.REFUNDED;
            await enrollment.save();

            await UserModel.findByIdAndUpdate(enrollment.instructor, {
                $inc: { totalEarnings: -enrollment.pricePaid },
            });
        }
    }

    return { received: true };
};
