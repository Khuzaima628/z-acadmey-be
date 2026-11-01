import joi from "joi";

export const updateWatchedTimeValidation = joi.object({
  courseId: joi.string().hex().length(24).required().messages({
    "string.empty": "courseId cannot be empty",
    "string.hex": "courseId must be a valid ObjectId",
    "string.length": "courseId must be 24 characters long",
    "any.required": "courseId is required",
  }),
  watched_time: joi.number().min(0).required().messages({
    "number.base": "watched_time must be a number",
    "number.min": "watched_time cannot be negative",
    "any.required": "watched_time is required",
  }),
});

export const createReviewValidation = joi.object({
  courseId: joi.string().hex().length(24).required().messages({
    "string.empty": "courseId cannot be empty",
    "string.hex": "courseId must be a valid ObjectId",
    "string.length": "courseId must be 24 characters long",
    "any.required": "courseId is required",
  }),
  rating: joi.number().min(1).max(5).required().messages({
    "number.base": "rating must be a number",
    "number.min": "rating must be at least 1",
    "number.max": "rating cannot exceed 5",
    "any.required": "rating is required",
  }),
  review: joi.string().trim().min(3).max(1000).optional().messages({
    "string.min": "review must be at least 3 characters",
    "string.max": "review cannot exceed 1000 characters",
  }),
  feedback: joi.string().trim().min(3).max(1000).optional().messages({
    "string.min": "feedback must be at least 3 characters",
    "string.max": "feedback cannot exceed 1000 characters",
  }),
}).or("review", "feedback").messages({
  "object.missing": "Review or feedback comment is required",
});
