import { model, models, Schema, type InferSchemaType } from "mongoose";

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  ALL_LEVELS = "all levels",
}

export enum CourseCategory {
  WEB_DEVELOPMENT = "web development",
  DATA_SCIENCE = "data science",
  MOBILE_APP_DEVELOPMENT = "mobile app development",
  DESIGN = "design",
  MARKETING = "marketing",
  BUSINESS = "business",
  PHOTOGRAPHY = "photography",
  MUSIC = "music",
  HEALTH_AND_FITNESS = "health & fitness",
  PERSONAL_DEVELOPMENT = "personal development",
  IT_AND_SOFTWARE = "it & software",
  FINANCE_AND_ACCOUNTING = "finance & accounting",
  TEACHING_AND_ACADEMICS = "teaching & academics",
  LIFESTYLE = "lifestyle",
  LANGUAGE = "language",
}

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
      trim: true,
      minLength: [5, "title must be at least 5 characters long"],
      maxLength: [200, "title cannot be more than 200 characters long"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
      minLength: [5, "description must be at least 5 characters long"],
      maxLength: [2000, "description cannot be more than 2000 characters long"],
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
      trim: true,
    },
    course_time: {
      type: String,
      required: [true, "course time is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.BEGINNER,
      lowercase: true,
    },
    category: {
      type: String,
      enum: Object.values(CourseCategory),
      required: [true, "category is required"],
      lowercase: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "rating cannot be less than 0"],
      max: [5, "rating cannot be more than 5"],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    videos: [
      {
        type: String,
        trim: true,
      },
    ],
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "instructor is required"],
    },
  },
  {
    timestamps: true,
  }
);

export type CourseType = InferSchemaType<typeof courseSchema>;
export const CourseModel = models.Course || model<CourseType>("Course", courseSchema);
export default CourseModel;
