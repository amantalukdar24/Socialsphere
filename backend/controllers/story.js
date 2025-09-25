const STORY=require('../models/story');
const USER=require('../models/user');
const fs=require("fs");
require("dotenv").config();
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true,
  tags:true,
});
const postStory=async (req,res)=>{
    try {
         if (req.file.size > 150000000) {
    return res.status(413).json({ success: false, mssg: `${ originalname}-File size exceed` });
  }
 
 if(req.file.mimetype.startsWith("image") || req.file.mimetype.startsWith("video")){
    const isImage=req.file.mimetype.startsWith("image") ? "image" : "video";
    const folder=isImage==="image" ? "Socialsphere/Story/Images" : "Socialsphere/Story/Videos";
    const public_id=req.file.filename;
    const upload=await cloudinary.uploader.upload(req.file.path,{
        folder,
        resource_type:isImage,
        public_id:public_id,
       tags: [`expires:${Date.now() + 1*60*1000}`] 
    });
     fs.unlink(req.file.path,(err)=>{
        console.log(err);
     });
        const result=await STORY.create({
            story:{
                
    fileType: isImage,
   
    filePath:upload.secure_url,
    public_id:upload.public_id,
            },
            userId:req.user._id,
        });
        if(result) return res.status(201).json({success:true,mssg:"Story Uploaded"});
        else return res.status(400).json({success:false,mssg:"Something Went Wrong"});
    }
    else{
        return res.status(415).json({success:false,mssg:`${file.originalname}:File Unsupported`});
    }
    } catch (err) {
        return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
};
const isYourStoryAvailable=async (req,res)=>{
    try {
        const result=await STORY.findOne({userId:req.user._id}).populate('userId');
        const {userId}=result;
        if(result) return res.status(200).json({success:true,userId});
        else return res.status(200).json({success:false});
    } catch (err) {
         return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
} 
const isYourFollowingUsersAvailable=async (req,res)=>{
    try {
        const user=await USER.findById(req.user._id);
        const {following}=user;
        let results=[];
   await Promise.all(
  following.map(async (users) => {
    const result = await STORY.findOne({ userId: users }).populate("userId");
    if (result) {
      const { userId } = result;
      
      results.push(userId);
    }
  })
);
     results.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));

        if(results.length>0) return res.status(200).json({success:true,results});
        else return res.status(200).json({success:false});
      
      
        
    } catch (err) {
        
        return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
const getStory=async (req,res)=>{
    try {
        const {userId}=req.body;
         const story=await STORY.find({userId:userId}).populate("userId").sort({createdAt:1});
         if(story.length>0) return res.status(200).json({success:true,story});
         else return res.status(404).json({success:false,mssg:"No Story Available"});
    } catch (err) {
        
        return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
const deleteStory=async (req,res)=>{
    try{
       const {storyId}=req.body;
       const result=await STORY.findByIdAndDelete(storyId);
       cloudinary.uploader.destroy(result.story.public_id,{
        resource_type:result.story.fileType
       },(err,result)=>{
         console.log(err)
       });
       if(result) return res.status(200).json({success:true,mssg:"Story Deleted"});
       else return res.status(404).json({success:false,mssg:"Something went wrong"});
    }
    catch(err){
        
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
module.exports={
    postStory,
    isYourStoryAvailable,
    isYourFollowingUsersAvailable,
    getStory,
    deleteStory,
}