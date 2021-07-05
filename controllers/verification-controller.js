const PendingUser=require('../models/PendingUser')
const User=require('../models/User') 
const verificationhandler=async (req,res,next)=>{
    var hash=req.params.hash
    try{
      const user=await PendingUser.findOne({_id:hash})
      if(!user){
        return res.status(400).send('User cannot be activated')
      }
      const {name,email,password}=user
      let newuser=new User({
        name,
        email,
        password
      })
      try{
        await newuser.save()
        await user.remove()
      }catch{
        res.status(500).json({message:'Internal server error'})
      }
      res.render('verification',{name})
    }catch{
      res.status(500).json({message:'Could not verify you please try again later'})
    }
}
module.exports={
    verificationhandler
}