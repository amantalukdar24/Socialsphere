const USER=require("../models/user");
const CHATS=require("../models/chats")
const {Types}=require("mongoose");
const {ObjectId}=Types;
const fs=require("fs");

require("dotenv").config();
const { StreamClient } = require("@stream-io/node-sdk");
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const client = new StreamClient(apiKey, apiSecret);
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getMyFollowingUsers=async (req,res)=>{
    try {
       const user=await USER.findById(req.user._id);
       if(!user) return res.status(404).json({success:false,mssg:"User didn't exist"})
       const {following,followers,username,profile_photo}=user;
       const setUsers=new Set([...following,...followers]);
       const allUsers=[...setUsers];
       let followingUsers=[];
       await Promise.all(
       allUsers.map(async (ele)=>{
           const result=await USER.findById(ele);
           if(result){
            const formatUser={
                _id:result._id,
                username:result.username,
                name:result.name,
                profile_photo:result.profile_photo
            };
            followingUsers.push(formatUser);
           }
       })
       );
       if(followingUsers.length>0) return res.status(200).json({success:true,followingUsers,userId:req.user._id,username,profile_photo});
       else return res.status(404).json({success:false});
        
    } catch (err) {
        console.log(`${err}`);
         return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
const saveMessage=async (req,res)=>{
    try {
        const {to,message}=req.body;
        
      
        
        let mediapath={
            fileType:"",
            filePath:"",
            public_id:"",
        };
      
     if(req.file!=null || req.file!=undefined){
        const isImage=req.file.mimetype.startsWith("image") ? "image" : "video";
    
       const public_id=req.file.filename;

         mediapath={

            fileType:isImage,
            filePath:req.file.path,
            public_id:public_id
        };
       
    }
       const result=await CHATS.create({
            from:req.user._id,
            to:to,
            message:message,
            mediapath:mediapath
        });
     const {_id}=result;   
        if(result) return res.status(201).json({success:true,_id,mediapath});
        else return res.status(400).json({success:false});
        
    } catch (err) {
       console.log(`${err}`);
        return res.status(500).json({success:false,mssg:`Internal Server Error`})
    }
}
const getMessages=async (req,res)=>{
    try {
       
        const {_id}=req.body;

        const messages=await CHATS.aggregate([{$match:{$or:[{from:new ObjectId(req.user._id),to:new ObjectId(_id)},{from:new ObjectId(_id),to:new ObjectId(req.user._id)}]}},{$group:
            {
                _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt",timezone:"Asia/Kolkata"}},
                chats:{
                    $push:{
                        _id:"$_id",
                        from:"$from",
                        to:"$to",
                        message:"$message",
                        mediapath:"$mediapath",
                        createdAt:"$createdAt"
                    }
                }
            }
        },{$sort:{_id:1}}]);
        if(messages.length>0) return res.status(200).json({success:true,messages});
        else return res.status(404).json({success:false});
    } catch (err) {
        console.log(`${err}`);
         return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
const getRecentChats=async (req,res)=>{
    try {
       const {following,followers}=await USER.findById(req.user._id);
          const setUsers=new Set([...following,...followers]);
       const allUsers=[...setUsers];
       let results=[];
       await Promise.all(allUsers.map(async (user)=>{
         const chats=await CHATS.find({$or:[{from:req.user._id,to:user},{from:user,to:req.user._id}]}).sort({createdAt:-1});
         const {_id,username,profile_photo}=await USER.findById(user);
        
         if(chats.length>0){
            const obj={
                _id:_id,
                username:username,
                profile_photo:profile_photo,
                message:chats[0].message? chats[0].message : "You have a new attachment",
                createdAt:chats[0].createdAt
            };
            
            results.push(obj);
         }
       }));
       if(results.length>0) return res.status(200).json({success:true,results});
       else return res.status(404).json({success:false});
        
    } catch (err) {
        console.log(`${err}`);
      return res.status(500).json({success:false,mssg:`Internal Server Error`})  
    }
}



const deleteTextMsg=async (req,res)=>{
    try {
        const {chatId}=req.body;
        const {mediapath}=await CHATS.findById(chatId);
        
       if( mediapath.filePath!=="" ) {  
     
         cloudinary.uploader.destroy(mediapath.public_id,{
            resource_type:mediapath.fileType,
        },(err,result)=>{
            if(err) console.log(err);
        });
            }
        
        const result=await CHATS.findOneAndDelete({_id:chatId,from:req.user._id});
        if(result) return res.status(200).json({success:true});
        else return res.status(404).json({success:false});
    } catch (err) {
        console.log(`${err}`);
   return res.status(500).json({success:false,mssg:`Internal Server Error`})  
    }
}
const createTokenForvideoCall=async (req,res)=>{
    try {
        
  const token =client.generateUserToken({ user_id: req.user._id });
  
  if(token) return res.status(201).json({success:true,token,apiKey,userId:req.user._id});
  else return res.status(400).json({success:false});
    } catch (err) {
        console.log(`${err}`);
           return res.status(500).json({success:false,mssg:`Internal Server Error`}) 
    }
}
module.exports={
    getMyFollowingUsers,
    saveMessage,
    getMessages,
    getRecentChats,
    deleteTextMsg,
   createTokenForvideoCall,
}