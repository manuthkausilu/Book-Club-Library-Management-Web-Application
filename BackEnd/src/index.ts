import express, { Request, Response } from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/mongo"
import rootRouter from "./routes"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler"

dotenv.config()
const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://book-club-library-managemen-git-344ad4-manuth-kausilus-projects.vercel.app'], // allow your frontend origin
  credentials: true // if you need to send cookies/auth headers
}));

app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 3000

app.use("/api", rootRouter)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})