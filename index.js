import express from "express"
import wifiRouter from "./routes/wifi_routes.js"
import bodyParser from "body-parser"
import mongoose from "mongoose" 
import fs from 'fs'


const dbUrl  = "mongodb://mongo:27017/"

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("Database Connected"))
  .catch((err)=> console.log("Database Error ",err))


const app = express()

app.use(bodyParser.json())


// Custom logging middleware
const logRequest = (req, res, next) => {
    console.log("Request Headers",req.headers)
    console.log("Request Body",req.body)
    next();
};
  



app.use(logRequest)

app.use("/wifi",wifiRouter)

app.get("/",(req,res)=>{
    res.json({
        msg : "Server Running"
    })
})

const PORT = process.env.PORT || 8005
app.listen(PORT,()=>{
    console.log("Server Started")
})