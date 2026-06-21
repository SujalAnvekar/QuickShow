import express from "express";
import 'dotenv/config'
// import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
// dotenv.config()

const app=express()

await connectDb()

// stripe webhooks
app.post('/api/stripe',express.raw({type:"application/json"}),stripeWebhooks)


// middleware
app.use(cors())
app.use(express.json())

// routes
app.get('/',(req,res)=>res.send("Server is Live"))
app.use('/api/user',userRouter)

app.use('/api/chat',chatRouter)

app.use('/api/message',messageRouter)

app.use('/api/credit',creditRouter)

const port=process.env.PORT||4000

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})