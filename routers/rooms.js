const express=require('express')
const roomcontroller=require('../controllers/room-controller')
const router=express.Router()
router.get('/getroomid/:rid',roomcontroller.getroomid)
module.exports=router