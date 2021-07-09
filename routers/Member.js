const express=require('express')
const router=express.Router();
const middleware=require('../middleware/check-auth')
const controller=require('../controllers/members-controller')
router.post('/createmember',controller.createmember);
router.get('/getmember',controller.getmembers);
router.get('/getmembers_adminpanel',controller.getmembersforadmin)
router.patch('/updatemember/:mid',controller.updatemember);
router.delete('/deletememberspage',controller.deletemember);
module.exports=router