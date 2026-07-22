import {
    createVehicle as createVehicleService,
    getAllVehicles as getAllVehiclesService,
    searchVehicles as searchVehiclesService
} from "../services/vehicleService.js";

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

export const getAllVehicles = async (req, res, next) => {
    try {
        const vehicles = await getAllVehiclesService();

        return res.status(200).json({
            vehicles
        });
    } catch (error) {
        next(error);
    }
};

export const searchVehicles = async (req, res, next) => {
    try {
        const vehicles = await searchVehiclesService(req.query);

        return res.status(200).json({
            vehicles
        });
    } catch (error) {
        next(error);
    }
};