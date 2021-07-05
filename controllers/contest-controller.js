const Contest = require('../models/Contest')
const HttpError=require('../models/Http-error')
const {cloudinary}=require('../Cloudinaryconfig/Cloudinary')
const createcontest=async (req,res,next)=>{
const {contestname,image,starttime,endtime,prize,contestdetail,venue,noofquestions,contestduration,totalslots,slotstrength,rules,contesttype}=req.body
let imageresponse
try{
    imageresponse=await cloudinary.uploader.upload(image,{upload_preset:'Contest-image'})
}catch(e){
    return res.status(500).json({message:'Contest Image upload failed!!'})
}
const registrationstarttime=Date.now()
const remainingseats=slotstrength*totalslots.length
let startimec=new Date(starttime).getTime();
let endtimec=new Date(endtime).getTime()
if(startimec>=endtimec){
    return res.status(400).json({message:'Startime of the contest cannot be greater than end time'})
}
let check=false
totalslots.forEach((slot)=>{
    const slotstart=new Date(slot.slotendtime).getTime()
    const slotend=new Date(slot.slotendtime).getTime()
    slot.slotstarttime=slotstart
    slot.slotendtime=slotend
    if(slotstart>=slotend||(slotstart<startimec||slotstart>endtimec||slotend<startimec||slotend>endtimec)){
      check=true;
    }
})
if(check){
    return res.status(400).json({message:'Your slot time is not in between contest time!'})
}
let contest=new Contest({
 contestname,
 image:imageresponse.secure_url,
 registration_starttime:registrationstarttime,
 registration_endtime:startimec,
 starttime:startimec,
 endtime:endtimec,
 prize,
 contestdetail,
 noofquestions,
 contestduration,
 totalslots,
 slotstrength,
 rules,
 venue,
 contesttype,
 seats_left:remainingseats
})
try{
await contest.save()
}catch(err){
const error=new HttpError('Could not create a contest please try again later',500)
return next(error)
}
res.status(201).json({message:"Contest created successfully!!"})
}


const updatecontest=async (req,res,next)=>{
const contestid=req.params.cid
let contest
try{
contest=await Contest.findById(contestid)
}catch(err){
    return next(new HttpError('Could not update the details,please try again later',500))
}
if(!contest){
    return next(new HttpError('Could not find a contest to update,please try again later',422))
}
try{
await contest.save()
}catch(err){
    return next(new HttpError('Could not update the details,please try again later',500))
}
res.status(200).json({contest:contest.toObject({getters:true})})
}

const getcontest=async (req,res,next)=>{
const contestid=req.params.cid
let contest;
try{
contest=await Contest.findById(contestid,['-questions']).populate('registeredusers')
}catch(err){
    const error=new HttpError('Could not fetch the contest,please try again later',500)
    return next(error)
}
if(!contest){
    return res.status(200).json({contest:null})
}
if(req.userid){
let idx=contest.registeredusers.findIndex(ruser=>ruser.mainuserid==req.userid)
if(idx!=-1){
    contest.isregistered=true
    contest.teststarttime=contest.registeredusers[idx].slot.slotstarttime
    contest.testendtime=contest.registeredusers[idx].slot.slotendtime
    contest.testgiven=contest.registeredusers[idx].testgiven
}
}

return res.status(200).json({contest:contest.toObject({getters:true})})
}
const getallcontests=async (req,res,next)=>{
let contests;
try{
contests=await Contest.find({},['-questions'])
}catch(err){
return next(new HttpError("Could not fetch the contests,please try again later",500))
}
let contestregister
try{
 contestregister=await Contest.find({},['-questions']).populate('registeredusers')
}catch(e){
    return res.status(500).json({message:e})
}

if(req.userid){
    contestregister.forEach((contest,index)=>{
        let idx=contest.registeredusers.findIndex(ruser=>ruser.mainuserid==req.userid)
        if(idx!=-1){
            contests[index].isregistered=true
            contests[index].teststarttime=contest.registeredusers[idx].slot.slotstarttime
            contests[index].testendtime=contest.registeredusers[idx].slot.slotendtime
            contests[index].testgiven=contest.registeredusers[idx].testgiven
        }
    })
}
if(contests.length===0){
    return res.status(200).json({contests:[]})
}
res.status(200).json({contests:contests.map(contest=>contest.toObject({getters:true}))})
}

const deletecontest=async (req,res,next)=>{
const contestids=req.body.ids
try{
await Contest.deleteMany({_id:{$in:contestids}})
}catch(err){
return next(new HttpError('Could not delete the contest,please try again later',500))
}
res.status(200).json({message:'Contests deleted successfully'})
}
module.exports={
    createcontest,
    updatecontest,
    getcontest,
    getallcontests,
    deletecontest
}