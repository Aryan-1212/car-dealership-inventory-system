import { createVehicle as createVehicleService } from "../services/vehicleService.js";

export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await createVehicleService(req.body);

        return res.status(201).json({
            vehicle
        });
    } catch (error) {
        next(error);
    }
};