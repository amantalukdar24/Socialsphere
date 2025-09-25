const {Router}=require('express');
const {userAuthenticated}=require("../middlewares/authentication");
const {likedPost,removeLikedPost,isLiked,getAllLikes}=require("../controllers/like")
const router=Router();

router.post("/likepost",userAuthenticated,likedPost);
router.delete("/removelikepost",userAuthenticated,removeLikedPost);
router.post("/islike",userAuthenticated,isLiked);
router.post("/getalllikes",userAuthenticated,getAllLikes);
module.exports=router;
