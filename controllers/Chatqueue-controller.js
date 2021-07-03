const Chatqueue=require('../models/Chatqueue')
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
module.exports={
    getadminswithroomids,
    saveadmin,
    createadminwithid,
    getrooms
}