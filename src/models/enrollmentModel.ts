import { object } from "joi"
import { model, Models, Schema, type InferSchemaType } from "mongoose"

enum EnrollmentStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}

const enrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "student is required"]
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "course is required"]
    },
    pricePaid: {
        type: Number,
        required: true
    },
    watched_time: {
        type: Number,
        default: 0
    },
    paymentIntentId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(EnrollmentStatus),
        default: EnrollmentStatus.ACTIVE
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},
    { timestamps: true }
)

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export type Enrollment = InstanceType<typeof EnrollmentModel>
const EnrollmentModel = model("Enrollment", enrollmentSchema)
export { EnrollmentStatus, EnrollmentModel }
