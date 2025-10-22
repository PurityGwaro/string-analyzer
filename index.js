import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectMongodb from "./connectMongodb.js"
import stringRoutes from "./routes/strings.js"

dotenv.config()
const PORT = process.env.PORT || 3004

const app = express()
app.use(cors())
app.use(express.json())

app.use("/strings", stringRoutes)

app.listen(PORT, () => {
    connectMongodb()
    console.log(`Server running on port ${PORT}`)
})
