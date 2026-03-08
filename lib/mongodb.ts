import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Por favor, define la variable MONGODB_URI en .env.local");
}

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGODB_URI);
        if (connection.readyState === 1) {
            console.log("MongoDB conectado con éxito");
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        return Promise.reject(error);
    }
};