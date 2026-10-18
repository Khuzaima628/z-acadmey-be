import { model, models, Schema, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    review: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxLength: [1000, "Review cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// A student can review a specific course once
reviewSchema.index({ student: 1, course: 1 }, { unique: true });

export type ReviewType = InferSchemaType<typeof reviewSchema>;
export const ReviewModel = models.Review || model("Review", reviewSchema);
export default ReviewModel;
