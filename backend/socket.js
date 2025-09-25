const {Server}=require("socket.io");
const jwt=require("jsonwebtoken");
function setupServer(server){
try {
    let users={};
    const io=new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    });
    io.use((socket,next)=>{
        const token=socket.handshake.auth.token;
        
        if(!token){
             return next(new Error("No token provided"));
        }
            try {
      const decoded = jwt.verify(token, process.env.JWT_Secret_Key);
      
      socket.user = decoded; 
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
    })
    io.on("connection",(socket)=>{
        
            users[socket.user._id]=socket.id;
        socket.on("send-mssg",(data)=>{
            
            const targetSocket=users[data.to];
           
            if(targetSocket){
                io.to(targetSocket).emit("recieve-mssg",{
                    from:socket.user._id,
                    to:data.to,
                    message:data.message,
                    mediapath:data.mediapath,
                    createdAt:data.createdAt,
                })
            }
    
        });
        socket.on("send-video-call",(data)=>{
            const targetSocket=users[data._id];
            if(targetSocket){
                io.to(targetSocket).emit("recieve-video-call",data);
            }
        });
          socket.on("decline-video-call",(data)=>{
            const targetSocket=users[data.from];
            
            if(targetSocket){
                
                io.to(targetSocket).emit("decline-video-call",data);
            }
        });
        socket.on("new-notify",(data)=>{
            const targetSocket=users[data.userId];
            
            if(targetSocket){
                io.to(targetSocket).emit("new-notify",data);
            }
        })
        socket.on("disconnect",()=>{
            
            delete users[socket.user._id];
        });

    });
    

} catch (err) {
    console.log(err);
}
}
module.exports={setupServer};