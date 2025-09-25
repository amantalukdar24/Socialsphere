const NOTIFY=require("../models/notify");
const {Types}=require("mongoose")
const postNotify=async (req,res)=>{
 try {
    const {type,userId,urlId,username}=req.body;
    const result=await NOTIFY.create({
        type,
        userId:userId,
        username,
        urlId
    });

    if(result) return res.status(201).json({success:true,result});
    else return res.status(400).json({success:false});
    
 } catch (err) {
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
 }
}

const getAllNotify=async (req,res)=>{
    try {
        const notifys=await NOTIFY.aggregate([{$match:{userId:new Types.ObjectId(req.user._id.toString())}},
             {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
 
            {
            $group:{
                 _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt",timezone:"Asia/Kolkata"}},
                 allNotify:{
                    $push:{
                        _id:"$_id",
                        type:"$type",
                        user: { username: "$user.username", profile_photo: "$user.profile_photo" },
                        urlId:"$urlId",
                        createdAt:"$createdAt"
                    }
                 }
            }},
            {
  $project: {
    allNotify: {
      $sortArray: { input: "$allNotify", sortBy: { createdAt: -1 } }
    }
  }

        }]);
       
   if(notifys.length>0)  return res.status(200).json({success:true,notifys});
   else return res.status(400).json({success:false});
    } catch (err) {
        console.log(`${err}`)
        return res.status(500).json({success:false,mssg:"Internal Server Error"}); 
    }
}

module.exports={postNotify,getAllNotify}