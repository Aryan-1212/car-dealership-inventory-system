import express from "express";
import { createVehicle, getAllVehicles, searchVehicles } from "../controllers/vehicleController.js";
import { authenticate, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticate, searchVehicles);
router.post("/", authenticate, requireAdmin, createVehicle);
router.get("/", authenticate, getAllVehicles);

export default router;