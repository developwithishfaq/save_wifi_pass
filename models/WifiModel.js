import mongoose from "mongoose"

const wifiModelSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    location: {
        type: {
            type : String,
            enum : 'Point',
            required : true
        },
        coordinates: { type: [Number], required :true}
    },
    name : {
        type : String,
        required : true,
        index: true
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
wifiModelSchema.add({
    location: {
        type: {
            type : String,
            enum : ['Point'],
            default : 'Point'
        },
        coordinates: {
            type: [Number]
        }
    }
})
wifiModelSchema.index({location :'2dsphere'})
wifiModelSchema.pre('save',function next(){
    if(this.lat && this.lng){
        this.location = {
            type: 'Point',
            coordinates: [this.lng,this.lat]
        }
    }
    next()
})

const WifiModel = mongoose.model("WifiPassword",wifiModelSchema)
// WifiModel.createIndexes()

export default WifiModel