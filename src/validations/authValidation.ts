import joi from "joi"
import { Role } from "../models/userModel"

export const registerSchema = joi.object({
    fullName: joi.string().min(3).max(30).required().trim().messages({
        "string.empty": "Full Name is Required",
        "any.required": "Full Name is Required",
        "string.min": "Full Name must be at least 3 characters",
        "string.max": "Full Name cannot exceed 30 characters"
    }),
    email: joi.string().email().required().trim().messages({
        "string.empty": "Email is Required",
        "any.required": "Email is Required",
        "string.email": "Email is not valid"
    }),
    password: joi.string().required().trim().messages({
        "string.empty": "Password is Required",
        "any.required": "Password is Required"
    }),
    role: joi.string().valid(Role.INSTRUCTOR, Role.STUDENT).required().trim().messages({
        "string.empty": "Role is Required",
        "any.required": "Role is Required",
        "any.valid": "Role is not valid"
    }),
    yearOfExperince: joi.number().min(0).max(100).required().messages({
        "number.empty": "Year of Experince is Required",
        "any.required": "Year of Experince is Required",
        "number.min": "Year of Experince cannot be negative",
        "number.max": "Year of Experince cannot be more than 100"
    }).when("role", {
        is: Role.INSTRUCTOR,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    profilePhoto: joi.string().trim(),
    bio: joi.string().trim().messages({
        "string.empty": "Bio is Required",
    }),
    higerEducation: joi.string().trim().messages({
        "string.empty": "Higher Education is Required",
    })

});

export const loginSchema = joi.object({
    email: joi.string().email().required().trim().messages({
        "string.empty": "Email is Required",
        "any.required": "Email is Required",
        "string.email": "Email is not valid"
    }),
    password: joi.string().required().trim().messages({
        "string.empty": "Password is Required",
        "any.required": "Password is Required"
    }),
    rememberMe: joi.boolean().optional(),
});

export const verifyOtpSchema = joi.object({
    email: joi.string().email().required().trim().messages({
        "string.empty": "Email is Required",
        "any.required": "Email is Required",
        "string.email": "Email is not valid"
    }),
    otp: joi.number().integer().min(100000).max(999999).required().messages({
        "number.empty": "OTP is Required",
        "any.required": "OTP is Required",
        "number.min": "OTP must be at least 6 digits",
        "number.max": "OTP cannot exceed 6 digits"
    }),
});

export const forgotPasswordSchema = joi.object({
    email: joi.string().email().required().trim().messages({
        "string.empty": "Email is Required",
        "any.required": "Email is Required",
        "string.email": "Email is not valid"
    })
});

export const verifyForgotPasswordOtpSchema = joi.object({
    email: joi.string().email().required().trim().messages({
        "string.empty": "Email is Required",
        "any.required": "Email is Required",
        "string.email": "Email is not valid"
    }),
    otp: joi.number().integer().min(100000).max(999999).required().messages({
        "number.empty": "OTP is Required",
        "any.required": "OTP is Required",
        "number.min": "OTP must be at least 6 digits",
        "number.max": "OTP cannot exceed 6 digits"
    }),
});

export const resetPasswordSchema = joi.object({
    token: joi.string().required().messages({
        "string.empty": "Reset token is required",
        "any.required": "Reset token is required"
    }),
    newPassword: joi.string().min(6).max(12).required().trim().messages({
        "string.empty": "Password is Required",
        "any.required": "Password is Required"
    })
});

