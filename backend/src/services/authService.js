import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
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