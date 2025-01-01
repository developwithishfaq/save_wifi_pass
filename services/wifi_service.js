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
const pageSize = 10

export async function getCount() {
    return await WifiModel.estimatedDocumentCount()
}
export const migrateData = async() =>{
    try {
        const documents = await WifiModel.find({})
        for (let i=0;i<documents.length;i++){
            const doc = documents[i]
            console.log(`Document(${i}): Name=${doc.name}, Password=${doc.password}`)
            if(!doc.location || !Array.isArray(doc.location.coordinates) || doc.location.coordinates.length!=2){
                await WifiModel.updateOne(
                    {_id : doc._id},
                    {
                        $set : {
                            location: {
                                type : 'Point',
                                coordinates: [doc.lng,doc.lat]
                            }
                        }
                    }
                )
            }
        }

    } catch(error){

    }
}
export async function getNearbyWifi(lat,lng,maxDistance) {
    const nearbyWifi = await WifiModel.find({
        location: {
            $near: {
                $geometry: {
                    type : 'Point',
                    coordinates : [lng,lat]
                },
                $maxDistance : maxDistance
            }
        }
    })
    return nearbyWifi
}

export async function getDataWithPages(pages) {
    return await WifiModel.find({})
        .skip((pages-1)*pageSize)
        .limit(pageSize)
        .exec()
}
