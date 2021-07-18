const mongoose=require('mongoose')
const roomSchema=new mongoose.Schema({
roomid:{
    type:String,
    required:true
}
})
module.exports=mongoose.model('rooms',roomSchema)