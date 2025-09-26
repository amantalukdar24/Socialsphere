import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import socket from "../socket.js";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import {toast} from "react-toastify";




const CallPage = () => {
  const url="https://socialsphere-backend-i5l1.onrender.com";
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [token,setToken]=useState("")
  
  const navigate = useNavigate();
   const [mySelf,setmySelf]=useState({
     id:"",
     name:"",
     image:"",
    
   });
  

   
  useEffect( () => {
    const initCall = async () => {
 

      try {
        console.log("Initializing Stream video client...");
    
      const result=await fetch(`${url}/user/getprofileuser`,{
         method:"GET",
       headers:{
         "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
       },
  
      });
      const data1=await result.json();
   
      
      if(data1.success){
         setmySelf({
           id:data1.user._id,
           name:data1.user.name,
           image:data1.user.profile_photo
         });
      
        }
      const splitCallId=callId.split("-");
      if (!splitCallId.includes(data1.user._id)) {
  toast.error("Unauthorized to join this call");
  navigate("/");
  return;
}


        const user = {
          id: mySelf.id,
          name: mySelf.name,
          image: mySelf.image,
        };
          const res = await fetch(`${url}/chats/gettokenforvideocall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if(!data.success) Navigate("/");

          if (!data.token  || !callId) return;
          setToken(data.token);
        const videoClient = new StreamVideoClient({
          apiKey: data.apiKey,
          user,
          token: data.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };
   console.log(client)
    initCall();
  }, [token,callId]);

  if (isConnecting) return <p className="text-white">Loading...</p>;

  return (
    <div className="h-[100vh]  flex flex-col items-center pt-5 w-full">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [decline,setDecline]=useState(false);
  const {callId}=useParams();
    const Navigate = useNavigate();
   useEffect(() => {
    const handleDecline = (data) => {
      
        setDecline(true);  
    };

    socket.on("decline-video-call", handleDecline);

    
    return () => {
      socket.off("decline-video-call", handleDecline);
    };
  }, [callId,socket.id]);

useEffect(()=>{
      if (decline) {
      toast.error("Call Rejected", {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
      });
      setDecline(false);

      Navigate("/"); 
      location.reload();
    }
},[decline])

 
  

  if (callingState === CallingState.LEFT){
  
     return Navigate("/");
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;