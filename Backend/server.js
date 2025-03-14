// const express = require("express");
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./Routes/foodRoute.js";
import userRouter from "./Routes/userRoute.js";
import cartRouter from "./Routes/cartRoute.js";
import orderRouter from "./Routes/orderRoute.js";



// app config
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors()); //using this we can access the backend from any frontend


// db connection
connectDB();

// API endpoints
app.use('/api/food',foodRouter);
app.use('/images',express.static('uploads')) //the uploads folder will be exposed on this end point
          // This line of code in an Express.js server exposes the uploads folder as a static directory, allowing clients (e.g., frontend or Postman) to access uploaded images via a URL.
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use("/api/order",orderRouter);



app.get("/",(req,res)=>{
    res.send("API Working");
})




app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`);
})


