import {
    createVehicle as createVehicleService,
    getAllVehicles as getAllVehiclesService,
    searchVehicles as searchVehiclesService,
    updateVehicle as updateVehicleService,
    deleteVehicle as deleteVehicleService
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

export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await updateVehicleService(req.params.id, req.body);

        return res.status(200).json({
            vehicle
        });
    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req, res, next) => {
    try {
        const result = await deleteVehicleService(req.params.id);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};