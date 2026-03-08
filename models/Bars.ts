import mongoose from "mongoose";

const BarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ejemplo: 'akelarre-lcb'
    location: String,
    isActive: { type: Boolean, default: true },
});

export default mongoose.models.Bar || mongoose.model("Bar", BarSchema);