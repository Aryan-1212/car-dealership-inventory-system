import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "API Running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);


app.use(errorHandler)

export default app;