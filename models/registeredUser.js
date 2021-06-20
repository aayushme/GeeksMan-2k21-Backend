const mongoose=require('mongoose')
const registerSchema=new mongoose.Schema({
            name:{
                type:String,
                
            },
            email:{
                type:String,
                
            },
            phoneno:{
                type:Number,
                
            },
            branch:{
                type:String
            },
            college:{
                type:String
            },
            year:{
                type:String
            },
            slot:{
                slotno:{
                    type:Number
                },
                slotstarttime:{
                    type:Date
                },
                slotendtime:{
                    type:Date
                }
            },
            marks:{
                type:Number,
                default:0
            },
            mainuserid:{
              type:mongoose.Types.ObjectId
            },
            contestid:{
                type:mongoose.Types.ObjectId
            },
            contestname:{
                type:String,
                default:null
            },
            testgiven:{
                type:Boolean,
                default:false,
            },
})
module.exports=mongoose.model("RegisteredUser",registerSchema);