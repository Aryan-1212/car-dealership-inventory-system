import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Authentication token required", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new AppError("Admin access required", 403));
    }
    next();
};
