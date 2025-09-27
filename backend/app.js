require("dotenv").config();
const {createServer}=require("http");
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');

const userRouter=require('./routes/user.js');
const postRouter=require('./routes/post.js');
const likeRouter=require("./routes/like.js");
const commentRouter=require("./routes/comment.js");
const searchRouter=require('./routes/search.js');
const storyRouter=require('./routes/story.js');
const {setupServer}=require("./socket.js");
const chatsRouter=require("./routes/chats.js");
const notifyRouter=require("./routes/notify.js");
const PORT=process.env.PORT || 3000;
const server=createServer(app);

setupServer(server);
mongoose.connect(process.env.MONGO_URL)
 .then(()=>console.log("Mongo Connected"))
 .catch((err)=>console.log(`Mongo Error:${err}`));
app.use(cors());

app.use(express.urlencoded({extended:true}));
async function serverRefresh(){
    const refresh=await fetch(`https://socialsphere-backend-i5l1.onrender.com/`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    });
    const data=await refresh.json();
    if(data.success) console.log("Server Refresh");
}
setInterval(serverRefresh,30000);

app.get("/",(req,res)=>{  return res.status(200).json({success:true});});
app.use('/user',userRouter); 
app.use('/post',postRouter);
app.use('/like',likeRouter);
app.use('/comment',commentRouter);
app.use("/search",searchRouter);
app.use('/story',storyRouter);
app.use('/chats',chatsRouter);
app.use("/notify",notifyRouter);
server.listen(PORT,()=>console.log(`Server Running on PORT:${PORT}`));