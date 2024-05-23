import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    console.error("MongoDB connection string is not defined. Set MONGO_URI in your .env file.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connection established successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
