import { model, models, Schema, type InferSchemaType } from "mongoose"


enum Role {
    ADMIN = "Admin",
    INSTRUCTOR = "instructor",
    STUDENT = "student"
}
const userModel = new Schema({
    fullName: {
        type: String,
        required: [true, "FullName is Required"],
        trim: true,
        minLength: [3, "Full Name must be at least 3 characters"],
        maxLength: [30, "Full Name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is Required"],
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
        default: "No bio available",
        minLength: [10, "Bio must be at least 10 characters"],
        maxLength: [100, "Bio cannot exceed 100 characters"]
    },
    higerEducation: {
        type: String,
        trim: true,
        default: "No Higher Education",
        minLength: [10, "Higher Education must be at least 10 characters"],
        maxLength: [100, "Higher Education cannot exceed 100 characters"]
    },
    yearOfExperince: {
        type: Number,
        default: 0,
        min: [0, "Year of Experince cannot be negative"],
        max: [100, "Year of Experince cannot be more than 100"],
        required: function (): boolean { return this.role === Role.INSTRUCTOR }
    },
    profilePhoto: {
        type: String,
        trim: true,
        default: "/placeholder.png"
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.STUDENT
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
        select: false,
    },
    isApprovedByAdmin: {
        type: Boolean,
        default: false,
    },
    otpExpiry: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true
})


export type UserType = InferSchemaType<typeof userModel>
export const UserModel = models.User || model<UserType>("User", userModel)
export default UserModel;
export { Role }
