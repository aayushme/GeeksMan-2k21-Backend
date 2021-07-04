const mongoose=require('mongoose')
const chatSchema=new mongoose.Schema({
roomid:{
    type:String,
    unique:true
},
adminname:{
    type:String,
},
messages:[
    {
      ownerid:{
          type:String,
      },
      timestamp:{
          type:Number
      },
      message:{
          type:String
      }
    }
]
})
module.exports=mongoose.model('Chats',chatSchema)