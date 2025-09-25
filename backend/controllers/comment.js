const COMMENT=require("../models/comment");

const postComment=async (req,res)=>{
    try{
        
        const {postId,comment}=req.body;
    const result=await COMMENT.create({
        comment,
        postId,
        userId:req.user._id
    });
    if(result) return res.status(200).json({success:true});
    else return res.status(404).json({success:false});
    }
    catch(err){
        
         return res.status(500).json({success:false,mssg:`${err}`});
    }
}
const getallcomment=async (req,res)=>{
    try {
        const {postId}=req.body;
        const comments=await COMMENT.find({postId:postId}).populate("userId").sort({createdAt:-1});
        console.log()
        if(comments.length>0) return res.status(200).json({success:true,comments});
        else return res.status(200).json({success:false});
    } catch (err) {
        return res.status(500).json({success:false,mssg:`${err}`});
    }
}
const deleteComment=async (req,res)=>{
    try {
        const {commentId}=req.body;
        const result=await COMMENT.findByIdAndDelete(commentId);
        if(result) return res.status(200).json({success:true})
        else return res.status(500).json({success:false,mssg:"Something Went Wrong"});
    } catch (err) {
        return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
}
module.exports={
    postComment,
    getallcomment,
    deleteComment,
}