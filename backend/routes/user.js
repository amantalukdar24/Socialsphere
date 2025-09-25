const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {createAccount,existingUser,checkUsernameAvailable,generateOtp,verifyotp}=require('../controllers/user.js');
const {userSchema,passSchema,usernameSchema}=require("../middlewares/validate.js");
const {userAuthenticated}=require("../middlewares/authentication.js");
const {getProfileUser,uploadprofilepicture,updateFollowers,removeFollowers}=require('../controllers/user.js');
const {changeUsername,changePassword,deleteAccount}=require("../controllers/user1.js")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
 
   
    
    const folder="./public/Profile_Photo";
    cb(null,path.join(__dirname,"..",folder));
  },
  filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
    const filtername=file.originalname.replace(/\.[^/.]+$/, "")        
    .replace(/[^\w\s-]/g, "")      
    .trim()
    .replace(/\s+/g, "_")            
    + "." + ext;
    const fileName=`${req.user._id}-${Date.now()}-${filtername}`;
    cb(null, fileName)
  }
});

const upload = multer({ storage: storage });
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