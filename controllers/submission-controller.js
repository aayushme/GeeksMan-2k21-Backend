const Question = require("../models/Question");
const User=require('../models/User')
const Contest=require('../models/Contest')
const jwt=require('jsonwebtoken')
const submissionhandler = async (req, res, next) => {
  const { answer } = req.body;
  try {
    let totalScore=0;
    const token = req.headers.authorization.split(" ")[1]; //authorization 'Bearer token'
    if (!token) {
      return res
        .status(404)
        .json({ message: "Test time is over, you are late" });
    }
    const decodedToken = jwt.verify(token, process.env.JWTCONTEST_KEY);
    if (!decodedToken) {
      return res
        .status(404)
        .json({ message: "Test time is over, you are late!!" });
    }
    const contestid = decodedToken.contestId;
    const uid=decodedToken.userId
    let contestuser=await User.findById(uid).populate('usercontestdetail')
    console.log(contestuser)
    if(!contestuser||contestuser.usercontestdetail.length===0){
        return res.status(404).json({message:'Could not find you as a registered candidate'})
    }
    const user=contestuser.usercontestdetail.find((user)=>user.contestid===contestid)
    if(!user){
        return res.status(404).json({message:'Could not find you as a registered candidate'})
    }
    const contestquestions = await Contest.findById(contestid).populate('questions')

    answer.forEach((element) =>{
      let question = contestquestions.questions.find(
        (question) => question._id == element.Question_Id
      );
      if (element.optionchosen == question.correctvalue) {
        totalScore = totalScore + question.score;
      }
    });
    user.marks = totalScore;
    user.testgiven=true
    await user.save();
    return res.status(200).json({ message: "Test Submitted Successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  submissionhandler,
};
