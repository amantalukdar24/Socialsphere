import React,{useMemo,useState,useCallback, useEffect,useRef} from 'react'
import socket from "../socket.js"
import {toast} from "react-toastify"
import { useNavigate,NavLink } from 'react-router-dom';
function ChatComponent({senderId,setActiveChatPage,yourUser}) {
    const url="https://socialsphere-backend-i5l1.onrender.com";
    const chatBoxRef=useRef(null);
    const inputRef=useRef(null);
  const [message,setMessage]=useState("");
  const [chat,setChat]=useState([]);
 const [deleteTextBar,setDeleteTextBar]=useState(false);
 const [chatId,setChatId]=useState("");
 const [deleteDone,setDeleteDone]=useState(false);
 const [media,setMedia]=useState(null);
 const [showchatMedia,setShowchatMedia]=useState(false);
 const [chatmedia,setChatmedia]=useState({type:"",link:""});
 const [sendingMess,setSendingMess]=useState(false);
 const Navigate=useNavigate();
useEffect(() => {
  const handleReceiveMsg = (data) => {
   
    const now = new Date(data.createdAt);
    const createDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    const messageData = {
      from: data.from,
      to: data.to,
      message: data.message,
      mediapath: data.mediapath,
      createdAt: data.createdAt,
    };

    setChat((prev) => {
      const exists = prev.some((allChats) => allChats._id === createDate);
      if (exists) {
        return prev.map((allChats) =>
          allChats._id === createDate
            ? { ...allChats, chats: [...allChats.chats, messageData] }
            : allChats
        );
      } else {
        return [...prev, { _id: createDate, chats: [messageData] }];
      }
    });
  };

 
  socket.on("recieve-mssg", handleReceiveMsg);

  
  return () => {
    socket.off("receive-msg", handleReceiveMsg);
  };
}, [senderId._id]); 
 
  const sendMessage=async ()=>{
   if(message.length===0 && media === null) return;
    if(sendingMess) return;
    setSendingMess(true);
    const now = new Date();
const createDate = `${now.getFullYear()}-${(now.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
   const messageData=new FormData();
   messageData.append("to",senderId._id);
   messageData.append("message",message);
   messageData.append("media",media);

    if(messageData===undefined) return;
   
    const result=await fetch(`${url}/chats/savemessage`,{
      method:"POST",
      headers:{
        
        "authorization":localStorage.getItem("token")
      },
      body:messageData
    });
    const data=await result.json();
   
    if(data.success){
      
     const tempMessageData={_id:data._id,to:senderId._id,message:message,mediapath:data.mediapath,createdAt:Date.now()};
      socket.emit("send-mssg",tempMessageData);
      setChat((prev)=>{
        const exists=prev.some((allChats)=>allChats._id===createDate);
        if(exists){
          return prev.map((allChats)=>
            allChats._id===createDate ?
            {...allChats,chats:[...allChats.chats,tempMessageData]} :
            allChats
          );
          
        }

        else{
          return [...prev,{_id:createDate,chats:[tempMessageData]}]
        }
      });
      setMessage("");
      setMedia(null);
    }
    else{
      toast.error("Message Can't be Sent. Try Again Later",{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      })
    }
    setSendingMess(false);
  }
   useEffect(()=>{
    chatBoxRef.current?.scrollTo(0,chatBoxRef.current?.scrollHeight);
  },[chat])
const getMessage=async ()=>{
     
     const result=await fetch(`${url}/chats/getmessages`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      },
      body:new URLSearchParams(senderId)
    });
    const data=await result.json();
    if(data.success){
      setChat([]);
    data.messages.map((ele)=>{
      setChat((prev)=>[...prev,ele])
    });
  }
  else{
     toast.error("No messages Found",{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      })
  }
}


const deleteTextMsg=async (chatId)=>{
  if(chatId==="") return;
  const result=await fetch(`${url}/chats/deletetextmsg`,{
    method:"delete",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem('token')
    },
    body:new URLSearchParams({chatId})
  });
  const data=await result.json();
  if(data.success) {
    setDeleteDone(true);
     setDeleteTextBar(false);
  }
  else{
    toast.error("Something Went Wrong",{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
  }
}
  useEffect( ()=>{
 getMessage();
 setDeleteDone(false);
  },[deleteDone]);

const getTime=(date)=>{
  const customDate=new Date(date);
  let hours=customDate.getHours();
  if(hours>12) hours=hours-12;
  if(hours==0) hours=12;
  let minutes=customDate.getMinutes();
  if(minutes<10) minutes="0"+minutes;
  let meridian="AM";
  if(customDate.getHours()>=12) meridian="PM";
 return `${hours}`+":"+`${minutes}`+" "+`${meridian}`;

}
const setDateInString=(date)=>{
    const todaysDate=new Date();
    const customDate=new Date(date);
    if(todaysDate.getDate()===customDate.getDate() && todaysDate.getMonth()+1===customDate.getMonth()+1 && todaysDate.getFullYear()===customDate.getFullYear()){
      return "Today"
    }
    if(todaysDate.getFullYear()!==customDate.getFullYear()) return `${customDate.toString().substring(0,3)} ${customDate.getDate()}, ${customDate.getFullYear()}`;
  else {
     const diffinsec=Math.abs(todaysDate-customDate);
     const diffindays=Math.floor(diffinsec/(1000*60*60*24));
     if(diffindays<=7){ 
    
      if(diffindays<=1) return "Yesterday"
      return `${customDate.toString().substring(0,3)}`;
    }
     else return `${customDate.toString().substring(4,7)} ${customDate.getDate()}`;
  }
}
const handelJoinVideoCall=()=>{
  
  const callId=`${yourUser._id}-${senderId._id}`;
  const videocallInfo={
    _id:senderId._id,
     username:yourUser.username,
     profile_photo:yourUser.profile_photo,
     url:callId,
     from:yourUser._id,

  }
  socket.emit("send-video-call",videocallInfo);
  Navigate(`/video-call/${callId}`)
 
}
  return (
    <div  className='w-full relative  flex flex-col '>
        <div className='relative flex flex-row justify-start  items-center  w-full p-1 bg-gray-800 rounded-xl gap-10'>
         <button className='w-[5vw] h-[8vh] text-4xl' onClick={()=>{setActiveChatPage(false)}}>⬅️</button>
  <NavLink to={`/${senderId.username}`} >   <div className='flex flex-row justify-center items-center gap-5'  >
        <img src={senderId.profile_photo} className='w-[50px] sm:w-[80px] h-[50px] sm:h-[80px] rounded-full'/>
        <h1 className='text-xl sm:text-2xl text-orange-600'>{senderId.username}</h1>
        </div></NavLink>
        <div className='flex justify-center items-center absolute top-1/2 right-0 transform translate-x-[-50%] translate-y-[-50%]'>
          <button onClick={()=>{handelJoinVideoCall()}}><img src="/Images/videocall.png" className=' w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]'/></button>
        </div>
       </div>
        <div ref={chatBoxRef} className=' flex flex-col   w-full gap-1 h-[70vh] sm:h-[73vh] md:h-[70vh] xl:h-[70vh] bg-gray-700 rounded-2xl overflow-auto scrollbar-hide '>
          {
            chat.map((ele)=>(
             <div className='flex flex-col w-full items-center'>
             <div className='flex justify-center items-center bg-amber-300 w-[34vw] sm:w-[25vw] md:w-[18vw] lg:w-[10vw] rounded-xl'><h1 className='text-md sm:text-lg md:text-xl font-sans'>{setDateInString(ele._id)}</h1></div>
             <div className='flex flex-col w-full' >
          {  ele.chats?.map((chats)=>(

              <div  id={`${chats._id}`}  className={`w-full flex flex-col items-center justify-center  p-1 ${chats.to===senderId._id ? ' justify-end  items-end' : 'justify-start items-start '} `} onDoubleClick={(e)=>{if(chats.to===senderId._id){setDeleteTextBar(true);setChatId(e.currentTarget.id)}}}>
              {chats.message.length>0 &&  <div  className=
              {`text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] rounded-xl p-4 font-serif  text-gray-900  w-[44vw] sm:w-[35vw] md:w-[25vw] min-h-[2vh] ${chats.to===senderId._id ? 'bg-teal-500':' bg-cyan-500'} `}  >{chats.message}</div> }
       <div className='flex flex-row justify-center items-center  relative rounded-xl' onClick={()=>{setShowchatMedia(true); setChatmedia({type:chats?.mediapath?.fileType,link:chats?.mediapath?.filePath.replace("./public","")})}}>   {chats?.mediapath?.fileType==="image" ? <img src={chats.mediapath?.filePath} className='w-[100px] sm:w-[200px] h-[100px] object-contain rounded-xl'  /> : chats?.mediapath?.fileType==="video" ?<> <video src={chats.mediapath?.filePath} className='w-[100px]  sm:w-[200px] h-[100px]  object-contain rounded-xl'  /><img src="./Images/playbtn.png" className='absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] w-[30px] h-[30px]' alt="play" /> </>:""
          }</div>

            
               <h1 className='text-[0.7rem] sm:text-[0.8rem] lg::text-[1rem] font-mono text-orange-400'>{getTime(chats.createdAt)}</h1>

          
              </div>
             
            )) 
          }

          </div>
          </div>
            ))
          }
                 { deleteTextBar &&      <div className='absolute transform translate-x-[-50%] translate-y-[-50%]  top-1/2 left-1/2 w-[40vw] lg:w-[30vh] h-[20vh] bg-gray-900 rounded-4xl flex flex-col items-center gap-3'>
                <div className='flex flex-col w-full justify-end items-end pr-5'><h1 className='text-xl lg:text-2xl ' onClick={()=>{setDeleteTextBar(false)}}>❌</h1></div>
          <div className='flex w-full flex-row justify-center  border-b-2 border-b-cyan-400'>      <button className='text-2xl lg:text-3xl text-orange-600 font-serif' onClick={()=>{deleteTextMsg(chatId)}}>Delete</button></div>
              </div>}

{
showchatMedia &&
<div className='absolute  left-1/2 top-1/2 transform translate-x-[-50%]  translate-y-[-50%] flex flex-col bg-gray-950 rounded-xl w-[90vw] sm:w-[80vw] lg:w-[60vw] h-[70vh] lg:h-[60vh] xl:h-[65vh] ' >
<div className='flex flex-row justify-end w-full gap-10 p-5'>
   
  <button className='text-3xl' onClick={()=>{setShowchatMedia(false)}}>❌</button>
</div>
<div className='w-full h-[50vh]  flex justify-center items-center  '>
  {
    chatmedia?.type?.startsWith("image") ? <img src={chatmedia.link} className='w-[500px] h-[300px] object-contain'/> : <video src={chatmedia.link} className='w-[80vw] sm:w-[70vw] lg:w-[50vw] h-[40vh] xl:h-[50vh] object-cover rounded-xl' controls/>
  }
</div>
</div>
}


   {  <div className='absolute bottom-16 w-full  rounded-bl-2xl rounded-br-2xl  flex flex-row justify-center items-center '>
 <div className='relative flex flex-row justify-center items-center'>  {media?.type?.startsWith("image") ?  <img src={URL.createObjectURL(media)} className=' w-[200px] h-[100px] object-contain'/> : media?.type?.startsWith("video") ? <video src={URL.createObjectURL(media)} className=' w-[200px] h-[100px] object-contain' controls/>: "" }
   <button className='absolute top-0 right-0' onClick={()=>{setMedia(null)}}>❌</button></div>
    </div>}
        </div>
        <div className='w-full h-[9vh] z-40   flex flex-row pl-1 sm:pl-10  items-center  gap-3 sm:gap-5 bg-gray-700 rounded-2xl border-t-2 '>
          <input ref={inputRef} type="file" accept='image/*,video/*' className='hidden' onChange={(e)=>{setMedia(e.target.files[0])}}/>
          <button className='flex justify-center items-center' onClick={()=>{inputRef.current?.click()}}><img src="./Images/sharechat.png" className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]'/></button>
          <textarea placeholder='write message...' className='w-[75vw] sm:w-[70vw]  md:w-[70vw] lg:w-[70vw] xl:w-[80vw] h-[5vh] sm:h-[6vh] rounded-xl text-[1rem] sm:text-[1.2rem] border-2 text-neutral-100 bg-gray-800  overflow-auto scrollbar-hide' value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
          <button className={`flex justify-center items-center w-[20vw]  sm:w-[10vw] md:w-[10vw] lg:w-[8vw] xl:w-[5vw] h-[4vh] sm:h-[5vh] rounded-full ${!sendingMess ? "bg-pink-500" : "bg-pink-300"}`} onClick={()=>{sendMessage()}}>{!sendingMess ? <img src="./Images/sent.png"  className='w[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/>:
          <span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
          }</button>
          </div> 
        
    </div>
  )
}

export default ChatComponent
