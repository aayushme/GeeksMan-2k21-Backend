const express=require('express')
const registeredusercontroller=require('../controllers/registeruser-controller')
const router=express.Router()
const middleware=require('../middleware/check-auth')
router.get('/getUsers/:cid',registeredusercontroller.getUsers)
router.post('/registerforcontest',registeredusercontroller.registerforcontest)
router.patch('/updateDetails/:id',middleware,registeredusercontroller.updatedetails)

module.exports=router