const HttpError = require("../models/Http-error");
const jwt = require("jsonwebtoken");
const Admin=require('../models/AdminUser')
module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
   try {
    const token = req.headers.authorization.split(" ")[1]; //authorization 'Bearer token'
    if (!token){
      throw new HttpError("Authentication failed!", 401);
    }
    const decodedToken = jwt.verify(token,process.env.JWTADMIN_KEY);
    if(!decodedToken)
    throw new HttpError("Authentication failed!",401)
    
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
