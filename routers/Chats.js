const express=require('express')
const chatscontroller=require('../controllers/Chat-controller')
const router=express.Router()
router.get('/getmessages/:rid',chatscontroller.getmessages)
module.exports=router