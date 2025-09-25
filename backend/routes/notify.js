const {Router}=require("express");
const router=Router();
const {postNotify,getAllNotify}=require('../controllers/notify');
const {userAuthenticated}=require("../middlewares/authentication");

router.post("/postnotify",userAuthenticated,postNotify);
router.get("/allnotify",userAuthenticated,getAllNotify);
module.exports=router;