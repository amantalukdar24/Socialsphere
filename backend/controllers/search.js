const USER=require("../models/user");
const POST=require("../models/post");

const getUsers=async (req,res)=>{
    try {
      const {searchUsername}=req.body;
    if(!searchUsername.trim()) return res.status(400).json({success:false})
    const users= await USER.find({ username: {$regex:searchUsername} });
    
   
    return res.status(200).json({success:true,users});
  
    
  
    } catch (err) {
      return res.json({success:false,mssg:`Internal Server Error`});
    }
  }
  const searchUser=async (req,res)=>{
    try {
      const {username}=req.body;
      const user=await USER.findOne({username:username});
      
      if(user){
        return res.status(200).json({success:true,user});
      }
      else return res.json(404).json({success:false,mssg:"User Not Found"});
    } catch (err) {
      console.log(`${err}`)
      return res.status(500).json({success:false,mssg:`Internal Server Error`});
    }
  }

  const getuserposts=async (req,res)=>{
    try{
      const {username}=req.body;
      const {_id}=await USER.findOne({username:username});

     const posts=await POST.find({userId:_id}).populate("userId").sort({createdAt:-1});
    
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

module.exports={
    getUsers,
    searchUser,
    getuserposts,
   
}