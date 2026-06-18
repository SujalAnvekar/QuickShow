import express from "express";
import 'dotenv/config'
import cors from 'cors'
import connectDb from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";

const app=express()

await connectDb()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.get('/',(req,res)=>res.send("Server is Live"))
app.use('/api/user',userRouter)

const port=process.env.PORT||4000

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})