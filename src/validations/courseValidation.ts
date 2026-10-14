import joi from "joi";
import { CourseCategory, CourseLevel } from "@src/models/courseModel";

// Course Validation
export const courseValidation = joi.object({
  title: joi.string().min(5).max(200).required().messages({
    "string.empty": "title cannot be empty",
    "string.min": "title must be at least 5 characters long",
    "string.max": "title cannot be more than 200 characters long",
    "any.required": "title is required",
  }),
  description: joi.string().min(5).max(2000).required().messages({
    "string.empty": "description cannot be empty",
    "string.min": "description must be at least 5 characters long",
    "string.max": "description cannot be more than 2000 characters long",
    "any.required": "description is required",
  }),
  price: joi.number().min(0).required().messages({
    "number.base": "price must be a number",
    "number.min": "price cannot be negative",
    "any.required": "price is required",
  }),
  duration: joi.string().required().messages({
    "string.empty": "duration cannot be empty",
    "any.required": "duration is required",
  }),
  level: joi
    .string()
    .valid(...Object.values(CourseLevel))
    .required()
    .messages({
      "any.only": "level must be one of the following: " + Object.values(CourseLevel).join(", "),
      "any.required": "level is required",
    }),
  category: joi
    .string()
    .valid(...Object.values(CourseCategory))
    .required()
    .messages({
      "any.only": "category must be one of the following: " + Object.values(CourseCategory).join(", "),
      "any.required": "category is required",
    }),
  images: joi.array().items(joi.string()).optional().messages({
    "array.base": "images must be an array of image URLs",
  }),
  videos: joi.array().items(joi.string()).optional().messages({
    "array.base": "videos must be an array of video URLs",
  }),
});


// Update Course Validation
 export const updateCourseValidation = joi.object({
  title: joi.string().min(5).max(200).optional().messages({
    "string.empty": "title cannot be empty",
    "string.min": "title must be at least 5 characters long",
    "string.max": "title cannot be more than 200 characters long",
  }),
  description: joi.string().min(5).max(2000).optional().messages({
    "string.empty": "description cannot be empty",
    "string.min": "description must be at least 5 characters long",
    "string.max": "description cannot be more than 2000 characters long",
  }),
  price: joi.number().min(0).optional().messages({
    "number.base": "price must be a number",
    "number.min": "price cannot be negative",
  }),
  duration: joi.string().optional().messages({
    "string.empty": "duration cannot be empty",
  }),
  level: joi
    .string()
    .valid(...Object.values(CourseLevel))
    .optional()
    .messages({
      "any.only": "level must be one of the following: " + Object.values(CourseLevel).join(", "),
    }),
  category: joi
    .string()
    .valid(...Object.values(CourseCategory))
    .optional()
    .messages({
      "any.only": "category must be one of the following: " + Object.values(CourseCategory).join(", "),
    }),
  images: joi.array().items(joi.string()).optional().messages({
    "array.base": "images must be an array of image URLs",
  }),
  videos: joi.array().items(joi.string()).optional().messages({
    "array.base": "videos must be an array of video URLs",
  }),
});
