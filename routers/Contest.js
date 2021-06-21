const express = require("express");
const contestcontroller = require("../controllers/contest-controller");
const router = express.Router();
const middleware=require('../middleware/check-auth')
const middleware2=require('../middleware/registered-checkauth')
router.post(
  "/createcontest",middleware,
  contestcontroller.createcontest
);
router.get("/contests",middleware2,contestcontroller.getallcontests);
router.get("/contest/:cid",middleware2,contestcontroller.getcontest)
router.delete("/deletecontest",middleware,contestcontroller.deletecontest);
router.patch("/updatedetails/:cid",middleware,contestcontroller.updatecontest);

module.exports=router