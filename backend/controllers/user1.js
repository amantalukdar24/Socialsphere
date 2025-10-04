const bcrypt=require("bcrypt");
const USER = require('../models/user.js');
const POST=require("../models/post.js");
const COMMENT=require("../models/comment.js");
const LIKE=require("../models/like.js");
const STORY=require("../models/story.js");

const changeUsername=async (req,res)=>{
    try {
        const {username}=req.body;
        
        if(username===req.user.username) return res.status(200).json({success:false,mssg:"This username is your current username"});
        const existingUsername=await USER.find({username:username});
        
        if(existingUsername.length>0) return res.status(400).json({success:false,mssg:"Username Already Taken"});
        const result=await USER.findByIdAndUpdate(req.user._id,{$set:{
            username:username,
        }});
    
        if(result){
            return res.status(200).json({success:true,mssg:"Username Updated"});
        }
        else  return res.status(400).json({success:false,mssg:"Something Went Wrong"});

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json("Internal Server Error");
    }
}
const changePassword=async (req,res)=>{
    try {
        const {password}=req.body;
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(password,saltRounds);
        
        const result=await USER.findByIdAndUpdate(req.user._id,{$set:{password:hashedPassword}
        });
        console.log(result)
        if(result) return res.status(200).json({success:true,mssg:"Password Updated"});
        else return res.status(400).json({success:false,mssg:"Something Went Wrong"});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json("Internal Server Error");
    }
}
const deleteAccount = async (req, res) => {
    try {
      const userId = req.user._id;
  
      
      await Promise.all([
        POST.deleteMany({ userId }),
        LIKE.deleteMany({ userId }),
        COMMENT.deleteMany({ userId }),
        STORY.deleteMany({ userId }),
      ]);
  
      const user = await USER.findById(userId);
      if (!user) return res.status(404).json({ success: false, mssg: "User not found" });
  
      const { followers, following } = user;
  
      
      await Promise.all([
        ...followers.map(followerId =>
          USER.findByIdAndUpdate(followerId, { $pull: { following: userId } })
        ),
        ...following.map(followingId =>
          USER.findByIdAndUpdate(followingId, { $pull: { followers: userId } })
        ),
      ]);
  
      
      await USER.findByIdAndDelete(userId);
  
      return res.status(200).json({ success: true, mssg: "Account deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, mssg: "Internal Server Error" });
    }
  };
  
module.exports={changeUsername,
    changePassword,
    deleteAccount,
};