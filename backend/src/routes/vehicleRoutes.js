import express from "express";
import { createVehicle } from "../controllers/vehicleController.js";
import { authenticate, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, requireAdmin, createVehicle);

export default router;