import express from "express"
import { getAllData,batchSaveWifiPasswords,deleteAll } from "../services/wifi_service.js"
import {checkErrorsInWifiPassBody} from "../utils/validator.js"
import {publishWifiPass} from "../controllers/wifi_controllers.js"

const router = express.Router()

router.post("/",async (req,res)=>{
    console.log("Request Received")
    const items = req.body
    const errors = checkErrorsInWifiPassBody(items)
    if(errors.length>0){
        return res.json({
            success: false,
            msg : "Errors "+ errors
        })
    }
    const filteredItems = items.map((item)=>{
        return {
            _id : `${item.lat}_${item.lng}_id`,
            name : item.name,
            password : item.password,
            address : item.address,
            lat : item.lat,
            lng : item.lng
        }  
    })
    console.log("publishWifiPass Called")
    await publishWifiPass(filteredItems,()=>{
        res.json({
            success: true,
            msg : "Batch Saved"
        })
    })
})

router.delete("/", async (req,res) => {
    const canDelete = req.headers["x-auth"] == "Tet@9119"
    if(canDelete){
        const response = await deleteAll()
        res.json({
            success: true,
            msg : "Deleted "+ response
        })
    } else {
        res.json({
            success: false,
            msg : "You are not authorized to do"
        })
    }
})

router.get("/",async (req,res)=>{
    const canFetch = req.headers["x-auth"] == "Qa@topedge"
    if(!canFetch){
        return res.json({
            success : false,
            msg : "Sorry, you are not authorized to fetch data"
        })
    }
    const results = await getAllData()
    res.json({
        success : true,
        data : results,
        msg : "All Data"
    })
})

export default router