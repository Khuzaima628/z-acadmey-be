import UserModel, { Role } from "@src/models/userModel";
import AppError from "@src/utils/appError";

// Pipeline
const buildPipline = (q: any,role:Role) => {
    const match: any = {
        role
    };

    if (q.search) {
        const searchTerm = q.search.trim();
        match['$or'] = [
            { fullName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } }
        ];
    }
    // filtering
    if (q.filter === "is") {
        const isApprovedByAdmin = Boolean(q.isApprovedByAdmin)
        match.isApprovedByAdmin = isApprovedByAdmin
    }
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 10;
    const skip = (page - 1) * limit;
    return [
        { $match: match },
        { $skip: skip },
        { $limit: limit },
    ];
}

// Get All and Filtered Instructors
export const getAllInstructorsService = async (params: any) => {
    const users = await UserModel.aggregate(buildPipline(params,Role.INSTRUCTOR));
    console.log("Users from DB:", users);
    return users;
}

// Make the Status change or Instructor
export const acceptInstructorService = async (id: string) => {
    const user = await UserModel.findByIdAndUpdate(id, {
        isApprovedByAdmin: true
    }, { new: true });
    return user;
}

// Getting All students
export const getAllStudentsService = async (params: any) => {
    const users = await UserModel.aggregate(buildPipline(params,Role.STUDENT));
    return users;
}

// Get user by ID and Role (works for both Instructor and Student)
export const getUserByIdService = async (id: string, role: Role) => {
    const user = await UserModel.findOne({ _id: id, role });
    if (!user) {
        throw new AppError(404, `${role} not found`);
    }
    return user;
};

