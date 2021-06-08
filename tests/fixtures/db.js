const mongoose=require('mongoose')
const useroneId= new mongoose.Types.ObjectId()
const User=require('../../models/User')
const userOne={
    _id:useroneId,
    name:"testuser1",
    email:"testuser1@example.com",
    password:"hellotest1@56"
}
const setupdatabase=async ()=>{
    await User.deleteMany()
    await new User(userOne).save()
}
module.exports={
    useroneId,userOne,setupdatabase
}

