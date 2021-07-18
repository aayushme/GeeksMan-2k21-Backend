const Room=require('../models/room')
const setroomid=async (roomid)=>{
const room=new Room({
    roomid
})
await room.save()
}
const removeroomid=async (roomid)=>{
const room=await Room.findOne({roomid})
await room.remove()
}
const getroomid=async (req,res)=>{
const roomid=req.params.rid
let room
try{
room=await Room.findOne({roomid})
}catch{
return res.status(500).json({message:'Internal server error'})
}
if(!room){
    return res.status(404).json({message:'Your chat has already been ended'})
}else{
    return res.status(200).json({message:room.roomid})
}
}
module.exports={
    getroomid,
    setroomid,
    removeroomid
}