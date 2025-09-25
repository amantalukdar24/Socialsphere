const {Router}=require("express");
const router=Router();
const {userAuthenticated}=require("../middlewares/authentication");
const {postComment,getallcomment,deleteComment}=require("../controllers/comment");
const {ValidateComment}=require("../middlewares/validatecomment")
router.post("/postcomment",userAuthenticated,ValidateComment,postComment);
router.post("/getallcomment",userAuthenticated,getallcomment);
router.delete("/deletecomment",userAuthenticated,deleteComment);
module.exports=router