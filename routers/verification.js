const express=require('express')
const router=express.Router()
const verificationcontroller=require('../controllers/verification-controller')
router.get('/activate/user/:hash',verificationcontroller.verificationhandler)
router.get('/changepassword/:hash/:token',(req,res,next)=>{
let id=req.params.hash 
let token=req.params.token
res.render('index',{userid:id,token})
})
module.exports=router