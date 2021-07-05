const PendingUser=require('../models/PendingUser')

//This route returns all the pending users
const getPendingusers=async (req,res,next)=>{
let pendinguser;
try{
pendinguser=await PendingUser.find({})
}catch(e){
    return res.status(500).json({message:'Internal server error'})
}
if(!pendinguser){
    return res.status(404).json({message:"There are no pending users!!"})
}
return res.status(200).json({pendinguser:pendinguser.map(pending=>pending.toObject({getters:true}))})
}

//This route deletes the pending user with given id
const deletePendinguser=async (req,res,next)=>{
let pendinguserids=req.body.ids
try{
pendinguser=await PendingUser.deleteMany({_id:{$in:pendinguserids}})
}catch(e){
return res.status(500).json({message:'Internal server error'})
}
return res.status(200).json({message:"Deleted successfully !!"})
}
module.exports={
    getPendingusers,
    deletePendinguser
}