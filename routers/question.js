const express=require('express')
const router=express.Router()
const middleware=require('../middleware/check-auth')
const questioncontroller=require('../controllers/question-controller')
//get shuffled questions
router.post('/testquestions',questioncontroller.getshuffledpertest)
//get all questions
// router.get('/questions',questioncontroller.getallquestions)
//get questionbyid
// router.get('/questions/:cid',questioncontroller.getcontestquestions)
// router.get('/questions/:id',questioncontroller.getquestionbyid)
router.post('/questions/:cid',middleware,questioncontroller.createquestion)  
// router.patch('/questions/:id',questioncontroller.updatequestion)
router.delete('/deletequestions',middleware,questioncontroller.deletequestion)
module.exports=router