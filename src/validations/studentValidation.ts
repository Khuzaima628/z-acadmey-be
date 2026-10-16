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
