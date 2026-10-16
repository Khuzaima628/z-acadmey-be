import { model, models, Schema, type InferSchemaType } from "mongoose";

export enum ActivityType {
  LESSON_COMPLETED = "Lesson Completed",
  COURSE_ENROLLED = "Course Enrolled",
  CERTIFICATE_EARNED = "Certificate Earned",
}

const activitySchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
      index: true,
    },
    activity: {
      type: String,
      enum: Object.values(ActivityType),
      required: [true, "Activity type is required"],
    },
    details: {
      type: String,
      required: [true, "Details are required"],
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
  },
  {
    timestamps: true,
  }
);

export type ActivityTypeDoc = InferSchemaType<typeof activitySchema>;
export const ActivityModel = models.Activity || model("Activity", activitySchema);
export default ActivityModel;
