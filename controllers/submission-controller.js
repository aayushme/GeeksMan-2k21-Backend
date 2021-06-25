const Question = require("../models/Question");
const RegisteredUser=require('../models/registeredUser')
const User=require('../models/User')
const Contest=require('../models/Contest')
const jwt=require('jsonwebtoken')
const submissionhandler = async (req, res, next) => {
  const { answer } = req.body;
  try{
    let totalScore=0;
    const token = req.headers.authorization.split(" ")[1]; //authorization 'Bearer token'
    if (!token) {
      return res
        .status(404)
        .json({ message: "Test time is over, you are late" });
    }
    let decodedToken;
    try{
     decodedToken = jwt.verify(token, process.env.JWTCONTEST_KEY);
    }catch{
      return res.status(403).json({message:'Cannot submit your test,either the time finished or you have already given the test'})
    }
    const contestid = decodedToken.contestId;
    const uid=decodedToken.userId
    let contestuser=await User.findById(uid).populate('usercontestdetail')
    console.log(contestuser)
    if(!contestuser||contestuser.usercontestdetail.length===0){
        return res.status(404).json({message:'Could not find you as a registered candidate'})
    }
    let user;
    try{
     user=await RegisteredUser.findById(decodedToken.ruid)
    }catch{
      return res.status(500).json({message:'Something went wrong try later'})
    }
    if(!user){
        return res.status(403).json({message:'Could not find you as a registered candidate'})
    }
    const contestquestions = await Contest.findById(contestid).populate('questions')
    answer.forEach((element) =>{
      let question = contestquestions.questions.find(
        (question) => question._id == element.id
      );
      if (element.value == question.correctvalue){
        totalScore = totalScore + parseInt(question.score);
      }
    });
    user.marks = totalScore;
    user.testgiven=true
    await user.save();
    return res.status(200).json({ message: "Your Test has been Submitted" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  submissionhandler,
};
