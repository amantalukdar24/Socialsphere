
import {io} from "socket.io-client"
const socket=io("https://socialsphere-backend-dih0.onrender.com",{
    auth:{
          token:localStorage.getItem("token")
    }
});

export default socket;