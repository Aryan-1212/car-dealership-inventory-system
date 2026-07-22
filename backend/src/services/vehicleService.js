import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";
import AppError from "../utils/AppError.js";

const formatVehicleResponse = (vehicle) => ({
    id: vehicle._id,
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: vehicle.price,
    quantity: vehicle.quantity
});

const validatePrice = (price) => {
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
        throw new AppError("Price must be greater than 0", 400);
    }
};

const validateQuantity = (quantity) => {
    if (quantity !== undefined && (typeof quantity !== "number" || quantity < 0)) {
        throw new AppError("Quantity cannot be negative", 400);
    }
};

const validateVehicleInput = ({ make, model, category, price, quantity } = {}) => {
    if (!make || !model || !category || price === undefined || quantity === undefined) {
        throw new AppError("All required fields must be provided", 400);
    }
    validatePrice(price);
    validateQuantity(quantity);
};

const validateVehicleUpdate = ({ price, quantity } = {}) => {
    validatePrice(price);
    validateQuantity(quantity);
};

const buildSearchQuery = ({ make, model, category, minPrice, maxPrice } = {}) => {
    const filter = {};

    if (make) filter.make = make;
    if (model) filter.model = model;
    if (category) filter.category = category;

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    return filter;
};

export const createVehicle = async (vehicleData) => {
    validateVehicleInput(vehicleData);

    const vehicle = await Vehicle.create(vehicleData);

    return formatVehicleResponse(vehicle);
};

export const getAllVehicles = async () => {
    const vehicles = await Vehicle.find();
    return vehicles.map(formatVehicleResponse);
};

export const searchVehicles = async (queryParams) => {
    const filter = buildSearchQuery(queryParams);
    const vehicles = await Vehicle.find(filter);
    return vehicles.map(formatVehicleResponse);
};

export const updateVehicle = async (id, updateData) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AppError("Vehicle not found", 404);
    }

    validateVehicleUpdate(updateData);

    const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    );

    if (!vehicle) {
        throw new AppError("Vehicle not found", 404);
    }

    return formatVehicleResponse(vehicle);
};

export const deleteVehicle = async (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AppError("Vehicle not found", 404);
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
        throw new AppError("Vehicle not found", 404);
    }

    return { message: "Vehicle deleted successfully" };
};