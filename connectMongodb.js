import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

const connectMongodb = () => {
    try {
        mongoose.connect(MONGODB_URI)
        console.log("Connected to MongoDB successfully!")
    } catch (error) {
        console.log("Error connecting to MongoDB", error)
    }
    return mongoose.connection
}

export default connectMongodb
