import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    make:String,
    model: String,
    category: String,
    price: Number,
    quantity: Number
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);