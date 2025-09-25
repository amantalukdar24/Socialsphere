const {Router}=require("express");
const { userAuthenticated } = require("../middlewares/authentication");
const {getMyFollowingUsers,saveMessage,getMessages,getRecentChats,deleteTextMsg,createTokenForvideoCall}=require("../controllers/chats");
const multer=require("multer");
const path=require("path")
const router=Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  const isImage=file.mimetype.startsWith("image");
  
    const folder=isImage? "./public/Chats/Images" : "./public/Chats/Videos";
    cb(null,path.join(__dirname,"..",folder));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filtername=file.originalname.replace(/\.[^/.]+$/, "")        
    .replace(/[^\w\s-]/g, "")      
    .trim()
    .replace(/\s+/g, "_")            
    + "." + ext;
    const fileName=`${req.user._id}-${req.body.to}-${req.body.createdAt}-${filtername}`;
    cb(null, fileName)
  }
});

const upload = multer({ storage: storage });
router.get("/getmyfollowingusers",userAuthenticated,getMyFollowingUsers);
router.post("/savemessage",userAuthenticated,upload.single("media"),saveMessage);
router.post("/getmessages",userAuthenticated,getMessages);
router.get("/getrecentchats",userAuthenticated,getRecentChats);
router.get("/gettokenforvideocall",userAuthenticated,createTokenForvideoCall);
router.delete("/deletetextmsg",userAuthenticated,deleteTextMsg);

module.exports=router;
