const Question=require('../models/Question')
const Contest =require('../models/Contest')
const jwt=require('jsonwebtoken')
const {cloudinary}=require('../Cloudinaryconfig/Cloudinary')
const mongoose=require('mongoose')

const getshuffledpertest=async (req,res,next)=>{
    let testquestions=[];
    let noofquestions;
    const token = req.headers.authorization.split(" ")[1]; //authorization 'Bearer token'
    if (!token) {
      return res.status(403).json({message:'Could not start your test!!'})
    }
    let decodedToken;
    try{
     decodedToken = jwt.verify(token,process.env.JWTCONTEST_KEY)
    }catch{
        return res.status(403).json({message:'Validation failed,cannot start your test'})
    }
    const contestId=decodedToken.contestId
    const slotno=decodedToken.slotno
    let contest;
    try{
        contest=await Contest.findById(contestId)
    }catch(e){
        return res.json({message:'Could not find the contest!!'})
    }
    if(contest){
      noofquestions=contest.noofquestions
    }else{
        return res.json({message:'Contest does not exists'})
    }
    try{
        const questions=await Contest.findById(contestId).populate('questions','-correctvalue')
        shuffle(questions.questions);        
        function shuffle(array){
         for(let i=(slotno-1)*noofquestions;i<(slotno-1)*noofquestions+noofquestions&&i<array.length;i++){
                 testquestions.push(array[i])
         }
        return res.status(200).json(testquestions);
     }
     }
     catch
     {
         return res.status(500).json({message:'Internal server error'})
     }
     }
const getallquestions=async (req,res,next)=>{
    try{
       const questions=await Question.find({});
       return res.status(200).json(questions);   
    }
    catch(error)
    {
        return res.status(500).json({"error":error})
    }}
const getquestionbyid=async (req,res,next)=>{
    try {
            const questionid=req.params.id
            const question = await Question.findById(questionid)        
            if(!question){
                return res.status(404).json({message:'No question found with that id'})
            }else{
                return res.status(200).json(questions)
            }
        } catch (error) {
            return res.status(500).json({"error":error})
        }
}


//Create questions handler
const createquestion=async (req,res,next)=>{
    const contestid=req.params.cid
    let contest;
    try{
       contest=await Contest.findById(contestid)
    }catch(e){
        return res.status(500).json({message:'Internal server error'})
    }
    if(!contest){
        return res.status(404).json({message:'There is no contest present'})
    }
    const {question,image,options,correctvalue,score}=req.body
    let questions 
    if(image!==null){
    //First upload image to cloudinary and get url
    let imageresponse;
    // console.log(image)
    try{
        imageresponse=await cloudinary.uploader.upload(image,{upload_preset:'Question-images'})
    }catch(e){
        return res.status(500).json({message:'Question image upload failed!!'})
    }
    questions=new Question({
        question,
        image:imageresponse.secure_url,
        options,
        correctvalue,
        score
    })
    }else{
        questions=new Question({
            question,
            image,
            options,
            correctvalue,
            score
        })
    }
    // Started a mongoose session and transaction if anything fails changes rolls back
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await questions.save({session:sess})
    contest.questions.push(questions)
    await contest.save({session:sess})
    await sess.commitTransaction();
    return res.status(201).json({message:"Created successfully"})
}

const getcontestquestions=async (req,res,next)=>{
const contestid=req.params.cid
let questionsbycontestid;
try{
questionsbycontestid=await Contest.findById(contestid).populate("questions")
}catch(e){
    return res.status(500).json({message:'Internal server error'})
}
if(!questionsbycontestid||questionsbycontestid.questions.length===0){
    return res.status(404).json({message:"There are no questions"})
}
return res.status(200).json({questions:questionsbycontestid.questions})
}
const updatequestion=async (req,res,next)=>{
    try {
        const _id = req.params.id 
        const { id,question , image ,options,score } = req.body

        let questions = await Question.findOne({_id})

        if(!questions){
            questions = await Question.create({
                id,
                question,
                image,
                options,
                score
            })    
            return res.status(201).json(questions)
        }else{
            questions.id = id
            questions.question=question
            questions.image=image
            questions.options = options
            questions.score= score
            await questions.save()
            return res.status(200).json(questions)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error":error})
    }
}

const deletequestion=async (req,res,next)=>{
    let questionids=req.body.ids
    try {
       await Question.deleteMany({_id:{$in:questionids}})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    return res.status(200).json({message:"Deleted Successfully!"})
}
module.exports={
    getcontestquestions,
    getshuffledpertest,
    getallquestions,
    getquestionbyid,
    createquestion,
    updatequestion,
    deletequestion
}