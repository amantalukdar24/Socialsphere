const POST=require("../models/post.js");
const fs=require("fs");
require("dotenv").config();
const { GoogleGenAI } =require("@google/genai");
const ai = new GoogleGenAI({apiKey:process.env.Gemni_API_KEY});
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


 


const uploadPost = async (req, res) => {
  try {
    const { caption } = req.body;
    let postNo = 1;
    let media = [];

    for (let file of req.files) {
      if (file.size > 100 * 1024 * 1024) {
        
     
        return res
          .status(413)
          .json({ success: false, mssg: `${file.originalname} - File size exceeded 100MB` });
      }

      if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        const resourceType = file.mimetype.startsWith("image") ? "image" : "video";
  
        media.push({
          fileName: file.originalname,
          fileType: resourceType,
          filePath: file.path, 
          public_id: file.filename,
          postNo: postNo++,
        });
      }      
      else  return res.status(415).json({
          success: false,
          mssg: `${file.originalname}: File Unsupported`,
        });
      
    }

    const result = await POST.create({
      caption,
      media,
      userId: req.user._id,
    });

    if (result) {
      return res.status(201).json({ success: true, mssg: "Post Uploaded" });
    } else {
      return res
        .status(500)
        .json({ success: false, mssg: "Internal Server Error" });
    }
  } catch (err) {
   

    return res.status(500).json({ success: false, mssg: err.message });
  }
};

const getuserposts=async (req,res)=>{
  try{
    const posts=await POST.find({userId:req.user._id}).populate("userId").sort({createdAt:-1});
   
    if(posts)
    {
      return res.status(200).json({success:true,posts});
    }
    else{
      return res.status(404).json({success:false});
    }
  }
  catch(err){
         return res.status(500).json({success:false,mssg:`${err}`});
  }
}
const getPrevcaption=async (req,res)=>{
  try {
    const {postId}=req.body;
    const result=await POST.findById(postId);
    if(result) return res.status(200).json({success:true,caption:result.caption});
    else return res.status(404).json({success:false})
  } catch (err) {
    return res.status(500).json({success:false,mssg:`${err}`});
  }
}

const editCaption=async (req,res)=>{
  try {
    const {postId,newCaption}=req.body;
    const result=await POST.findByIdAndUpdate(postId,{$set:{caption:newCaption}});
    if(result) return res.status(200).json({success:true,mssg:"Caption Updated"});
    else return res.status(404).json({success:false,mssg:"Something Went Wrong"})
  } catch (err) {
      return res.status(500).json({success:false,mssg:`Internal Server Error`});
  }
}
const deletePost=async (req,res)=>{
  try {
    const {postId}=req.body;
    const allfiles=await POST.findById(postId);
    const result=await POST.findByIdAndDelete(postId);
    
    if(result) 
    {
      allfiles.media.forEach((ele)=>{
      
        cloudinary.uploader.destroy(ele.public_id,{resource_type:ele.fileType},(error,result)=>{
        if(error) console.log(error);
        });
    });
      return res.status(200).json({success:true,mssg:"Post Deleted"});
   
    }
    else return res.status(404).json({success:false,mssg:"Something Went Wrong"})
    
  } catch (err) {
    
    return res.status(500).json({success:false,mssg:`Internal Server Error`});
  }
}
const getAllposts=async (req,res)=>{
  try{
    const posts=await POST.find({}).populate("userId").sort({createdAt:-1});
   
    if(posts)
    {
      return res.status(200).json({success:true,posts});
    }
    else{
      return res.status(404).json({success:false});
    }
  }
  catch(err){
         return res.status(500).json({success:false,mssg:`Internal Server Error`});
  }
}
const particularPost=async (req,res)=>{
  try {
    const {postId}=req.body;
    const post=await POST.find({_id:postId}).populate("userId");
    if(post.length>0) return res.status(200).json({success:true,post});
    else return res.status(404).json({success:false,mssg:"Post Not Found"});
    
  } catch (err) {
    
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
const checkTextisclean=async (req,res)=>{
  try {
        const {caption}=req.body;
        if(caption.length==0) return res.json({success:true});
        const prompt=caption+".Check the sentence content any vulgur,nudity,threat like comments if yes return true else false";
    
         const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

 
     if(response.text.toLowerCase().includes("false")) return res.status(200).json({success:true});
     return res.status(400).json({success:false,mssg:"Post cannot be uploaded.Caption contain offensive comments"});    
        
    } catch (err) {
        
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
module.exports={
    uploadPost,
    getuserposts,
    editCaption,
    getPrevcaption,
    deletePost,
    getAllposts,
    particularPost,
    checkTextisclean
}
