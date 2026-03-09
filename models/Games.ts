import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: { type: String }, // Ej: "2-4"
    time: { type: String },    // Ej: "30 min"
    barSlug: { type: String, required: true }, // Para saber de qué bar es el juego
    available: { type: Boolean, default: true }
});

export default mongoose.models.Game || mongoose.model("Game", GameSchema);