const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
const USER = require('../models/user.js');
const OTP=require('../models/otp.js');
const {createTokenForUser}=require('../services/authentication.js');
const fs=require("fs");
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createAccount = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    const existingEmail=await USER.findOne({email});
    const existingUsername=await USER.findOne({username});
    if(existingEmail) return res.status(400).json({success:false,mssg:"This Email Is already registered",token:null});
    if(existingUsername) return res.status(400).json({success:false,mssg:"Username Already Taken",token:null});
    const result = await USER.create({
      name,
      email:email.toLowerCase(),
      username,
      password: hashedPassword,
    });
   
    if (result) {
        const token=createTokenForUser(result);
      return res.status(201).json({ success: true,mssg:"Account Created" ,token:token });
    } else {
      return res.status(500).json({ success: false, mssg: 'Internal Server Error' ,token:null});
    }
  } catch (err) {
    return res.status(500).json({ success: false, mssg: `Internal Server Error` ,token:null});
  }
};
const existingUser=async (req,res)=>{
   
    
    try{
       const {emailOrusername,password}=req.body;
       let user=await USER.findOne({email:emailOrusername.toLowerCase()});
       
       if(!user)
       {
                user=await USER.findOne({username:emailOrusername});
                if(!user) return res.status(404).json({success:false,mssg:"Incorrect email or password",token:null});
             
       }
       const result=await bcrypt.compare(password,user.password);
       if(result){
        const token=createTokenForUser(user);
        return res.status(200).json({success:true,mssg:"Logged In",token:token});
       }
       else{
        return res.status(404).json({success:false,mssg:"Incorrect email or password",token:null});
       }

    }
    catch(err){
 return res.status(500).json({ success: false, mssg: `Internal Server Error` });
    }
}
const checkUsernameAvailable=async (req,res)=>{
  try{
  const {username}=req.body;
  
  
     const existingUsername=await USER.findOne({username:username});
         if(existingUsername) return res.status(400).json({success:false,Mssg:"Username Already Taken"});
         return res.status(200).json({success:true,Mssg:"Username Available"});
  }
  catch(err){
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }
};
const generateOtp=async (req,res)=>{
  try {
     const {email}=req.body;
     const user=await USER.findOne({email});
     if(!user) return res.status(404).json({success:false,mssg:"User doesn't exist"});
     let otp="";
     for(let i=0;i<4;i++)
     {
      otp+=Math.floor(Math.random()*10).toString();
     }
     const saltRounds=10;
     const hashOtp=await bcrypt.hash(otp,saltRounds);
     const user1=await OTP.find({email});
    
     if(!user1 || !user1.length )
     {
         
      const result= await OTP.create({
        email,
        otp:hashOtp
      });
  }
     else{
      await OTP.findOneAndUpdate({email},{$set:{
        otp:hashOtp
      }});
    }    
const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"amantalukdar23@gmail.com",
            pass:"kchtfvvduiyleznw"
        }
    });
    const mailOptions={
        from:"amantalukdar23@gmail.com",
        to:email,
        subject: "Email Verification",
        text:`Your OTP is ${otp}.It is valid for 10 minutes`
    };
  await  transporter.sendMail(mailOptions,function(error,response){
        if(error)
        {
            return res.status(500).json({success: false, mssg: "Failed to send OTP"});
        }
        else{
            return res.status(200).json({success:true,mssg:"We have sent an OTP to your registered email."})
        }
    });
     
  } catch (err) {
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }
}
const verifyotp=async (req,res)=>{
  try{
  const {email,password,otp}=req.body;
  const user=await USER.findOne({email});
  const user1=await OTP.findOne({email});
  
  if(!user) return res.status(404).json({success:false,mssg:"User doesn't exist"});
  if(!user1) return res.status(404).json({success:false,mssg:"Enter a valid otp"});
 
  if(user1)
  {
    const result=await bcrypt.compare(otp,user1.otp);
    
    if(result)
    {
      const saltRounds=10;
      const hashedPassword=await bcrypt.hash(password,saltRounds);
     const userUpdated= await USER.findOneAndUpdate({email},{$set:{password:hashedPassword}});
     if(userUpdated){ 
      await OTP.deleteOne({email});
      return res.status(200).json({success:true,mssg:"Password Updated"});
    }
     else return res.status(500).json({success:false,mssg:"Internal Server Error"});

    }
    else return res.status(404).json({succcess:false,mssg:"Invalid OTP"});
  }
}
catch(err){
  return res.status(500).json({success:false,mssg:`Internal Server Error`});
}
}
const getProfileUser=async (req,res)=>{
  const result=await USER.findById(req.user._id);
  if(result){
  const {_id,name,username,profile_photo,followers,following}=result;
  const user={
    _id,
    name,
    username,
    profile_photo,
    followers,
    following
  }
  return res.status(200).json({success:true,user});
  }
  else return res.status(404).json({success:false});
};

const uploadprofilepicture=async (req,res)=>{
  try {
  
    if(req.file.mimetype.startsWith("image"))
    {
       
       
       const public_id=req.file.filename;
    
     
      const result=await USER.findByIdAndUpdate(req.user._id,{$set:{profile_photo:req.file.path,public_id:public_id}});
      
      if(result){
      
      return res.json({success:true,mssg:"Profile Picture Updated"});
      }
      else{
         return res.status(500).json({success:false,mssg:"Internal Server error"});
      }
    }
    return res.status(415).json({success:false,mssg:"Image File Supported"})
    
  } catch (err) {
   
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }
}
const updateFollowers=async (req,res)=>{
  try {
    const {userId}=req.body;
    let follower=await USER.findOne({_id:userId,followers:{$in:[req.user._id]}});
    
    if(follower) return res.status(200).json({success:true});
     follower=await USER.findByIdAndUpdate(userId,{
      
        $push:{followers:req.user._id}
    
    });
    let following=await USER.findOne({_id:req.user._id,following:{$in:[userId]}});
    if(following) return res.status(200).json({success:true});
     following=await USER.findByIdAndUpdate(req.user._id,{
      
        $push:{
          following:userId
        }
      
    });
    
    if(follower && following) return res.status(200).json({success:true});
    else return res.status(404).json({success:false});
  } catch (err) {
    
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }
}
const removeFollowers=async (req,res)=>{
  try {
    const {userId}=req.body;
    let follower=await USER.findOne({_id:userId,followers:{$in:[req.user._id]}});
  
    if(!follower) return res.status(200).json({success:true});
     follower=await USER.findByIdAndUpdate(userId,{
      
        $pull:{followers:req.user._id}
    
    });
    let following=await USER.findOne({_id:req.user._id,following:{$in:[userId]}});
    
    if(!following) return res.status(200).json({success:true});
     following=await USER.findByIdAndUpdate(req.user._id,{
      
        $pull:{
          following:userId
        }
      
    });
    
    if(follower && following) return res.status(200).json({success:true});
    else return res.status(404).json({success:false});
  } catch (err) {
    
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }
}
module.exports = {
  createAccount,
  existingUser,
  checkUsernameAvailable,
  generateOtp,
  verifyotp,
  getProfileUser,
  uploadprofilepicture,
  updateFollowers,
  removeFollowers,
};
