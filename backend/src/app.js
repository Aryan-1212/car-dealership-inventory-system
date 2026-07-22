import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Limit requests from same API
if (process.env.NODE_ENV !== "test") {
    const limiter = rateLimit({
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        windowMs: 15 * 60 * 1000,
        message: "Too many requests from this IP, please try again in 15 minutes!"
    });
    app.use("/api", limiter);
}

// Implement CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));


app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "API Running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);


app.use(errorHandler)

export default app;