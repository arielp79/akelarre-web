import mongoose, { Schema, model, models } from "mongoose";

const LoanSchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    gameName: { type: String, required: true },
    barSlug: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }, // <--- AGREGAR
    city: { type: String, required: true },    // <--- AGREGAR
    createdAt: { type: Date, default: Date.now }
});

// Usamos plural 'Loans' para ser consistentes con lo que hablamos antes
const Loans = models.Loans || model("Loans", LoanSchema);
export default Loans;