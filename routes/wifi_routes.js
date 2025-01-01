import express from "express"
import { getNearbyWifi,migrateData,getAllData,batchSaveWifiPasswords,deleteAll,getDataWithPages,getCount } from "../services/wifi_service.js"
import {checkErrorsInWifiPassBody} from "../utils/validator.js"
import {publishWifiPass} from "../controllers/wifi_controllers.js"

const router = express.Router()


router.patch("/migrate",async (req,res)=>{
    const data = await migrateData()
    res.json({
        data :data
    })
    
})

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
            location :{
                type: 'Point',
                coordinates : [item.lng,item.lat]
            },
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
router.get("/count",async (req,res)=>{
    res.json({
        data : await getCount(),
        success : true,
        msg : "Estimated Count"
    })
})

router.get("/",async (req,res)=>{
    const canFetch = req.headers["x-auth"] == "Qa@topedge"
    const page = req.headers["page"]
    const all = req.headers["all"]
    const lat = req.headers["lat"]
    const lng = req.headers["lng"]

    if(!canFetch){
        return res.json({
            success : false,
            msg : "Sorry, you are not authorized to fetch data"
        })
    }
    if(!lat && !lng){
        const results = await getDataWithPages(page)
        res.json({
            success : true,
            data : getFilteredResults(results),
            msg : `Count : ${results.length}`
        })
    }else if(all){
        const response = await getAllData()
        res.json({
            success : true,
            data : getFilteredResults(response),
            msg : `Count : ${response.length}`
        })
    } else {
        const results = await getNearbyWifi(lat,lng,1000)
        res.json({
            success : true,
            data : getFilteredResults(results),
            msg : `Count : ${results.length}`
        })
    }  
})
function getFilteredResults(items){
    return items.map((item)=>{
        if(
            item.location && Array.isArray(item.location.coordinates) &&
            item.location.coordinates.length==2
        ){
            return {
                id : item.id,
                name: item.name,
                password : item.password,
                address : item.address,
                lat : item.location.coordinates[1],
                lng : item.location.coordinates[0]
            }
        }
    })
}

export default router