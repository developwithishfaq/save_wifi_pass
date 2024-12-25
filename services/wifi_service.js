import WifiModel from "../models/WifiModel.js";

export async function saveWifiPass(model,cb){
    try {
        const response = await WifiModel.findOneAndUpdate(
            { _id : model._id },
            { $set : model },
            { upsert : true , new: true}
        )
        console.log("Wifi Pass Saved ",response)
        cb(null,response)
    } catch(error) {
        console.log("Wifi Pass Error "+error)
        cb(error,null)
    }
}   

export async function batchSaveWifiPasswords(items) {
    const bulkOps = items.map((item) => ({
            updateOne : {
                filter : {  _id : item._id},
                update : { $set : item },
                upsert : true
            }
        }))
    const results = await WifiModel.bulkWrite(bulkOps)
    console.log(`Updated : ${results.nUpserted}, Inserted: ${results.nInserted}`)
    return results
}
export async function deleteAll() {
    const response = await WifiModel.collection.drop()
    return response
}

export async function getAllData() {
    const result = await WifiModel.find({})
    console.log("getAllData ",result)
    return result
}
