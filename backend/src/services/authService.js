import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const formatUserResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
});

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
};

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

    return formatUserResponse(user);
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    const isPasswordValid = user && (await bcrypt.compare(password, user.passwordHash));

    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    return {
        token: generateToken(user),
        user: formatUserResponse(user)
    };
};

