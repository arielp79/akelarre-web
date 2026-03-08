import mongoose, { Schema, model, models } from "mongoose";

const LoanSchema = new Schema({
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    barSlug: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    dniImageUrl: { type: String, required: true }, // URL de la foto del DNI
    tableNumber: { type: String, required: true },
    status: {
        type: String,
        enum: ["active", "returned"],
        default: "active"
    },
    createdAt: { type: Date, default: Date.now },
    returnedAt: { type: Date }
});

// Esto evita crear el modelo dos veces si Next.js recarga el código
const Loan = models.Loan || model("Loan", LoanSchema);

export default Loan;