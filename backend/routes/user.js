const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage=new CloudinaryStorage({
  cloudinary,
  params:async (req,file)=>{
  
     
     const folder="Socialsphere/Profile_Photo";
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
const {createAccount,existingUser,checkUsernameAvailable,generateOtp,verifyotp}=require('../controllers/user.js');
const {userSchema,passSchema,usernameSchema}=require("../middlewares/validate.js");
const {userAuthenticated}=require("../middlewares/authentication.js");
const {getProfileUser,uploadprofilepicture,updateFollowers,removeFollowers}=require('../controllers/user.js');
const {changeUsername,changePassword,deleteAccount}=require("../controllers/user1.js")



router.post('/register',userSchema,createAccount);
router.post('/login',existingUser);
router.post('/usernameavailable',checkUsernameAvailable);
router.post('/getotp',generateOtp);
router.post('/verifyotp',passSchema,verifyotp);
router.get('/getprofileuser',userAuthenticated,getProfileUser);
router.post('/uploadprofilepicture',userAuthenticated,upload.single("profile_photo"),uploadprofilepicture);
router.patch("/updatefollower",userAuthenticated,updateFollowers);
router.delete('/removefollower',userAuthenticated,removeFollowers);
router.patch("/changeusername",userAuthenticated,usernameSchema,changeUsername);
router.patch("/changepassword",userAuthenticated,passSchema,changePassword);
router.delete("/deleteaccount",userAuthenticated,deleteAccount);
module.exports=router;