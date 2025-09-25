const {verifyToken}=require('../services/authentication.js');

function userAuthenticated(req,res,next){

    
    try{
        const token=req.headers["authorization"];
        if(!token){
            return res.status(401).json({success:false,mssg:"Unauthorized Access"});
        }
         const decoded=verifyToken(token);
         req.user=decoded;
         next();
    }
    catch(err){
      return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
module.exports={
    userAuthenticated
}