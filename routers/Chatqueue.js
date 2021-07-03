const express=require('express')
const Chatqueuecontroller=require('../controllers/Chatqueue-controller')
const router=express.Router()
router.get('/getrooms/:id',Chatqueuecontroller.getrooms)
module.exports=router