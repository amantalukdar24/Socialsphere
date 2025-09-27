const {Router}=require('express');
const multer=require('multer');
const path=require('path');
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary")
const {userAuthenticated}=require("../middlewares/authentication");
const {postStory,isYourFollowingUsersAvailable,isYourStoryAvailable,getStory,deleteStory}=require("../controllers/story");
const router=Router();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage=new CloudinaryStorage({
 cloudinary,
 params:async (req,file)=>{
  
     const isImage=file.mimetype.startsWith("image") ? "image":"video";
     const folder=isImage==="image" ? "Socialsphere/Story/Images" : "Socialsphere/Story/Videos";
     const ext = file.originalname.split('.').pop();
    const filtername=file.originalname.replace(/\.[^/.]+$/, "")        
    .replace(/[^\w\s-]/g, "")      
    .trim()
    .replace(/\s+/g, "_")            
    + "." + ext;
    const fileName=`${req.user._id}-${Date.now()}-${filtername}`;
      
      return {
        folder,
 resource_type: "auto",
      public_id: fileName, 
      };
  }
})
const upload = multer({ storage: storage });
router.post('/poststory',userAuthenticated,upload.single("media"),postStory);
router.get("/isyourstory",userAuthenticated,isYourStoryAvailable);
router.get('/followingusersstory',userAuthenticated,isYourFollowingUsersAvailable);
router.post('/getstory',userAuthenticated,getStory);
router.delete("/deletestory",userAuthenticated,deleteStory);
module.exports=router;