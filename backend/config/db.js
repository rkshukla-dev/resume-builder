import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(env.mongoUri);
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        throw error;
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    } catch (error) {
        console.log("MongoDB disconnection failed:", error.message);
        throw error;
    }
}