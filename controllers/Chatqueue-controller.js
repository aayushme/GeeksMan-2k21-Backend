const Chatqueue=require('../models/Chatqueue')
const Message =require('../models/Message')
const getadminswithroomids=async ()=>{
let admins=await Chatqueue.find({})
return admins
}
const saveadmin=async (admin)=>{
let Admin=await Chatqueue.findOne({adminid:admin.adminid})
Admin.roomids=admin.roomids
await Admin.save()
}
const getrooms=async (req,res)=>{
    const id=req.params.id
    let admin;
    try{
    admin=await Chatqueue.findOne({adminid:id})
    }catch(err){
        return res.status(500).json({message:'something went wrong'})
    }
    if(!admin){
        return res.status(200).json({roomids:[]})
    }
    return res.status(200).json({roomids:admin.roomids})
}
const createadminwithid=async (admin)=>{
    const Admin=new Chatqueue({
        adminname:admin.adminname,
        adminid:admin._id,
        roomids:[],
        queriesresolved:0
    })
    await Admin.save()
}
const removeroom=async (roomid,adminid)=>{
let activeadmin,chats;
activeadmin=await Chatqueue.findOne({adminid})
chats=await Message.findOne({roomid})
if(activeadmin&&chats){
    let idx=activeadmin.roomids.findIndex((room)=>room.id==roomid)
    if(idx!=-1){
      activeadmin.roomids.splice(idx,1)
      activeadmin.queriesresolved++
    }
    await chats.remove()
    await activeadmin.save()
}
}
module.exports={
    getadminswithroomids,
    saveadmin,
    createadminwithid,
    getrooms,
    removeroom
}