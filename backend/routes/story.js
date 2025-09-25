const {Router}=require('express');
const multer=require('multer');
const path=require('path');
const {userAuthenticated}=require("../middlewares/authentication");
const {postStory,isYourFollowingUsersAvailable,isYourStoryAvailable,getStory,deleteStory}=require("../controllers/story");
const router=Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  const isImage=file.mimetype.startsWith("image");
  
    const folder=isImage? "./public/Story/Images" : "./public/Story/Videos";
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
router.post('/poststory',userAuthenticated,upload.single("media"),postStory);
router.get("/isyourstory",userAuthenticated,isYourStoryAvailable);
router.get('/followingusersstory',userAuthenticated,isYourFollowingUsersAvailable);
router.post('/getstory',userAuthenticated,getStory);
router.delete("/deletestory",userAuthenticated,deleteStory);
module.exports=router;