import mongoose from "mongoose"

const wifiModelSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    address : {
        type : String,
        default : null
    },
    lat : {
        type: Number,
        required : true
    },
    lng : {
        type : Number,
        required: true
    }
} , {timestamps : true})
const WifiModel = mongoose.model("WifiPassword",wifiModelSchema)

export default WifiModel