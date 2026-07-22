import express from "express";
import { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { authenticate, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticate, searchVehicles);
router.post("/", authenticate, requireAdmin, createVehicle);
router.get("/", authenticate, getAllVehicles);
router.put("/:id", authenticate, updateVehicle);
router.delete("/:id", authenticate, requireAdmin, deleteVehicle);

export default router;