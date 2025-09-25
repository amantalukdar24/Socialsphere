const {Router}=require("express");
const {getUsers,searchUser,getuserposts}=require("../controllers/search");
const {userAuthenticated}=require("../middlewares/authentication")
const router=Router();

router.post("/getusers",userAuthenticated,getUsers);
router.post("/searchuser",userAuthenticated,searchUser);
router.post("/getuserposts",userAuthenticated,getuserposts);

module.exports=router;