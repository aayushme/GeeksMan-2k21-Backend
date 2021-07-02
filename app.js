const express = require("express");
const bodyparser = require("body-parser");
const HttpError=require('./models/Http-error')
const userrouter=require('./routers/user')
const contestrouter=require('./routers/Contest')
const questionrouter=require('./routers/question')
const submissionrouter=require('./routers/submissions')
const verificationroute=require('./routers/verification')
const registeredusersrouter=require('./routers/registerforcontest')
const Testvalidationrouter=require('./routers/Testvalidation')
const adminrouter=require('./routers/admin')
const Pendinguserrouter=require('./routers/Pendinguser')
const uploadfilerouter=require('./routers/CsvUpload')
const memberrouter=require('./routers/Member')
const Chatqueuecontroller=require('./controllers/Chatqueue-controller')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const app = express();
const server = require("http").createServer(app);
app.use(cors())
app.use(bodyparser.urlencoded({ limit:'50mb',extended: true }));
app.use(bodyparser.json({limit:'50mb'}));
app.set('view engine', 'ejs');
app.use(express.static('./public'))

//for trusting the headers attached by nginx
app.enable("trust proxy")



//Routes
// app.get("/",(req,res)=>{
//   res.render('upload')
// })
app.use(uploadfilerouter)
app.use(memberrouter)
app.use(Pendinguserrouter)
app.use(userrouter)
app.use(contestrouter)
app.use(questionrouter)
app.use(Testvalidationrouter)
app.use(verificationroute)
app.use(registeredusersrouter)
app.use(submissionrouter)
app.use(adminrouter)

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});
io.of("/firstconnection").on("connection", (socket) => {
    socket.on("join-room", (roomid)=>{
       socket.join(roomid)
       const caladmin=async ()=>{
        const admins=await Chatqueuecontroller.getadminswithroomids()
        let admin=admins[0]
        console.log(admins)
        admins.forEach(element => {
            if(admin.roomids.length>element.roomids.length||(admin.roomids.length==element.roomids.length&&admin.queriesresolved>element.queriesresolved)){
              admin=element
            }
          
        });
        admin.roomids.push(roomid)
        await Chatqueuecontroller.saveadmin(admin)
        console.log(admin)
        socket.emit('joined','successfull')
       }
       caladmin()
    })
});

io.of('/reconnecting').on("connection",(socket)=>{
  socket.on("join-room",(roomid)=>{
    console.log('room joined again',roomid)
     socket.join(roomid)
  })
})


app.use((req, res, next) => {
    throw new HttpError("Could not find this route", 404);
  });
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res
      .status(error.code || 500)
      .json({ message: error.message || "An unknown error occured" });
  });
module.exports=server