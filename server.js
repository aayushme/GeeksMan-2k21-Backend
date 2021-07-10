const app = require("./app");
const mongoose = require("mongoose");
const Chatqueuecontroller=require('./controllers/Chatqueue-controller')
const port = process.env.PORT || 5000;
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
  const changestream=admincollection.watch()
  changestream.on('change',(change)=>{
    if(change.operationType==='insert')
    Chatqueuecontroller.createadminwithid(change.fullDocument)
  })
})