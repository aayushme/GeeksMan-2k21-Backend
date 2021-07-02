const mongoose=require('mongoose')
const ChatqueueSchema=new mongoose.Schema({
adminname:{
    type:String,
},
adminid:{
    type:mongoose.Types.ObjectId
},
queriesresolved:{
    type:Number,
    default:0
},
roomids:[
    {
    type:String
    } 
]
})
module.exports=mongoose.model('chatqueues',ChatqueueSchema)