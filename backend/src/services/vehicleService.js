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

const validateVehicleInput = ({ make, model, category, price, quantity } = {}) => {
    if (!make || !model || !category || price === undefined || quantity === undefined) {
        throw new AppError("All required fields must be provided", 400);
    }

    if (typeof price !== "number" || price <= 0) {
        throw new AppError("Price must be greater than 0", 400);
    }

    if (typeof quantity !== "number" || quantity < 0) {
        throw new AppError("Quantity cannot be negative", 400);
    }
};

export const createVehicle = async (vehicleData) => {
    validateVehicleInput(vehicleData);

    const vehicle = await Vehicle.create(vehicleData);

    return formatVehicleResponse(vehicle);
};