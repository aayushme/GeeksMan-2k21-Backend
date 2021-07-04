const Chats =require('../models/Message')
const savemessages=async (message)=>{
let msgwithroom;
msgwithroom=await Chats.findOne({roomid:message.roomid})
if(msgwithroom){
msgwithroom.messages.push({
    ownerid:message.ownerid,
    message:message.msg,
    timestamp:message.timestamp
})
await msgwithroom.save()
}else{
        const msg=new Chats({
            roomid:message.roomid,
            adminname:message.adminname,
            messages:[
                {
                    ownerid:message.ownerid,
                    message:message.msg,
                    timestamp:message.timestamp
                }
            ]
        })
        await msg.save()
    }

}

const getmessages=async (req,res)=>{
const roomid=req.params.rid  
let messages;
try{
messages=await Chats.findOne({roomid:roomid})
}catch{
return res.status(500).json({message:'Somethig went wrong please try again later'})
}
if(!messages){
    return res.status(200).json({messages:[]})
}
return res.status(200).json({adminname:messages.adminname,messages:messages.messages})
}

module.exports={
    savemessages,
    getmessages
}