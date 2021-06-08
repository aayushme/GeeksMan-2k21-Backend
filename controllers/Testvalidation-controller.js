const Contest=require('../models/Contest')
const jwt=require('jsonwebtoken')
const User=require('../models/User')
const testvalidation=async (req,res,next)=>{
let time,contest,token;
const {cid,uid}=req.body
let registeruserid,slotno
const user=await User.findById(uid).populate('usercontestdetail')
if(user||user.usercontestdetail.length!=0){
    const finduser=user.usercontestdetail.find(user=>user.contestid==cid)
    registeruserid=finduser._id
    slotno=finduser.slot.slotno
    if(finduser.testgiven){
        return res.json({message:'You have already given the test'});
    }
}
try{
contest=await Contest.findById(cid)
}catch(e){
return res.status(404).json({error:e})
}
time=contest.contestduration
try{
token=jwt.sign({contestId:cid,userId:uid,ruid:registeruserid,slotno:slotno},process.env.JWTCONTEST_KEY,{expiresIn:`${time}`})
}catch(e){
    return res.status(500).json({message:'Could not start your test please try again later'})
}
res.status(201).json({token})
}
module.exports={
    testvalidation
}