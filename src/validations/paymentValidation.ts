import joi from "joi";

export const createPaymentIntentValidation = joi.object({
  courseId: joi.string().hex().length(24).required().messages({
    "string.empty": "courseId cannot be empty",
    "string.hex": "courseId must be a valid ObjectId",
    "string.length": "courseId must be 24 characters long",
    "any.required": "courseId is required",
  }),
});

export const refundCourseValidation = joi.object({
  courseId: joi.string().hex().length(24).required().messages({
    "string.empty": "courseId cannot be empty",
    "string.hex": "courseId must be a valid ObjectId",
    "string.length": "courseId must be 24 characters long",
    "any.required": "courseId is required",
  }),
});

