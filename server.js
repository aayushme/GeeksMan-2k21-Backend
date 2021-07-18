const app = require("./app");
const mongoose = require("mongoose");
const Chatqueuecontroller=require('./controllers/Chatqueue-controller')
const port = process.env.PORT || 5000;
const redisclient=require('./Redis-client/redisclient')
require('dotenv').config()
mongoose
  .connect(`${process.env.DATABASE_URL}`,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
const db=mongoose.connection
db.once('open',()=>{
  const admincollection=db.collection('admins')
  const contestscollection=db.collection('contests')
  const contestchangestream=contestscollection.watch()
  const adminchangestream=admincollection.watch()
  contestchangestream.on('change',(change)=>{
    //remove the stale cache if there is a change in contests collection
    redisclient.del('upcoming')
    redisclient.del('previous')
    redisclient.del('ongoing')
    redisclient.del('allcontests')
  })
  adminchangestream.on('change',(change)=>{
    if(change.operationType==='insert')
    Chatqueuecontroller.createadminwithid(change.fullDocument)
  })
})