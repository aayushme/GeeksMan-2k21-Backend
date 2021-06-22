const HttpError = require("../models/Http-error");
const jwt = require('jsonwebtoken');
module.exports =(req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token
    if(req.headers.authorization)
    token = req.headers.authorization.split(" ")[1]; //authorization 'Bearer token'
    if (!token){
      return next()
    }
    let decodedtoken
    try{
       decodedtoken=jwt.verify(token,process.env.JWT_KEY)
    }catch(err){
      return next()
    }
    if(decodedtoken){
    req.userid =decodedtoken.userId ;
    }
     next()
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
