import bcrypt from "bcrypt";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

export const registerUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw new AppError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};