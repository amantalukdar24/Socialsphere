const {Router}=require('express');
const {userAuthenticated}=require("../middlewares/authentication.js");
const router=Router();
const multer=require('multer');
const path=require('path');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {uploadPost,getuserposts,editCaption,getPrevcaption,deletePost,getAllposts,particularPost,checkTextisclean}=require("../controllers/post.js");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//   const isImage=file.mimetype.startsWith("image");
//     const folder=isImage? "./public/Images" : "./public/Videos";
//     cb(null,path.join(__dirname,"..",folder));
//   },
//   filename: function (req, file, cb) {
//         const ext = file.originalname.split('.').pop();
//     const filtername=file.originalname.replace(/\.[^/.]+$/, "")        
//     .replace(/[^\w\s-]/g, "")      
//     .trim()
//     .replace(/\s+/g, "_")            
//     + "." + ext;
//     const fileName=`${req.user._id}-${Date.now()}-${filtername}`;
//     cb(null, fileName)
//   }
// });

const storage=new CloudinaryStorage({
  cloudinary,
  params:async (req,file)=>{
  
     const isImage=file.mimetype.startsWith("image") ? "image":"video";
     const folder=isImage==="image" ? "Socialsphere/Posts/Images" : "Socialsphere/Posts/Videos";
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

router.post("/upload",userAuthenticated,upload.array("media",12),uploadPost);
router.get('/getuserposts',userAuthenticated,getuserposts);
router.patch('/editcaption',userAuthenticated,editCaption);
router.post('/getprevcaption',userAuthenticated,getPrevcaption);
router.delete('/deletepost',userAuthenticated,deletePost);
router.get('/getallposts',userAuthenticated,getAllposts);
router.post("/getparticularpost",userAuthenticated,particularPost);
router.post("/checktext",userAuthenticated,checkTextisclean);
module.exports=router;
