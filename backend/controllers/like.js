const LIKE=require("../models/like");

const likedPost=async (req,res)=>{

   try{
     const {postId}=req.body;
     
     const likeExist=await LIKE.findOne({postId:postId,userId:req.user._id});
    
     if(likeExist)  return res.status(200).json({success:true});
     const result=await LIKE.create({
        postId,
        userId:req.user._id,

    });
    if(result)
    {
        return res.status(200).json({success:true});

    }
    else return res.status(404).json({success:false});
   }
   catch(err){
    
     return res.status(500).json({success:false,mssg:`Internal Server Error`});
   }
}

const removeLikedPost=async (req,res)=>{
    try {
        const {postId}=req.body;
        const removedLike=await LIKE.deleteOne({postId:postId , userId:req.user._id});
        if(removedLike) return res.status(200).json({success:true});
        else return res.status(404).json({success:false});
    } catch (err) {
      
          return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
const isLiked=async (req,res)=>{
  try {
        const {postId}=req.body;
      
        const likeExist=await LIKE.findOne({postId:postId,userId:req.user._id});
      
        if(likeExist)  return res.status(200).json({success:true});
        else return res.status(200).json({success:false})
  } catch (err) {
    console.log(`${err}`)
      return res.status(500).json({success:false,mssg:`Internal Server Error`});
  }
}
const getAllLikes=async (req,res)=>{
  try {
      const {postId}=req.body;
  const allLikes=await LIKE.find({postId:postId}).populate("userId").sort({createdAt:-1});
  if(allLikes.length>0) return res.status(200).json({success:true,allLikes});
  else  return res.status(404).json({success:false});
  } catch (err) {
    console.log(`${err}`);
    
    return res.status(500).json({success:false,mssg:`Internal Server Error`})
  }

}

module.exports={
    likedPost,
    removeLikedPost,
    isLiked,
    getAllLikes,
}