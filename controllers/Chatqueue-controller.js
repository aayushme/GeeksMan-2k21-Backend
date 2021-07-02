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
    createadminwithid
}