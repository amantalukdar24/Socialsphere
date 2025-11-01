import React,{useState,useEffect} from 'react'
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';
import ChatComponent from '../components/ChatComponent';
import socket from "../socket.js"
function Chats() {
  const url="https://socialsphere-backend-dih0.onrender.com";
  const [input,setInput]=useState("");
  const [input1,setInput1]=useState("");
  const Navigate=useNavigate();
  const [activateChatpage,setActiveChatPage]=useState(false);
  const [senderId,setSenderId]=useState({});
  const [recentchats,setRecentChats]=useState([]);
  const [filteredRecentChats,setFilteredRecentChats]=useState([]);
  const [followingUsers,setFollowingUsers]=useState([]);
  const [filteredFollowingUsers,setFilteredFollowingUsers]=useState([]);
   const [addUserForChats,setAddUserForChats]=useState(false);
   const [yourUser,setYourUser]=useState({
    _id:"",username:"",profile_photo:""
   });
    const getUsers=async ()=>{
      const result=await fetch(`${url}/chats/getmyfollowingusers`,{
        method:"GET",
         headers:{
          "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
         }
      });
      const data=await result.json();
      if(data.success){
        setFollowingUsers(data.followingUsers);
        setYourUser({
          _id:data.userId,
          username:data.username,
          profile_photo:data.profile_photo
        });
      }
      else{
           toast.error(data.mssg,{
            position:"top-center",
            autoClose:5000,
            theme:"dark"
           });
      }
    }
    useEffect(()=>{
      getUsers();
    },[addUserForChats]);
    useEffect(()=>{
      const result=followingUsers.filter((ele)=>{
       return (ele.username?.includes(input) || ele.name.includes(input));
      });
      
      setFilteredFollowingUsers(result);
    },[input,addUserForChats]);
    const getRecentChats=async ()=>{
      const result=await fetch(`${url}/chats/getrecentchats`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
        }
      });
      const data=await result.json();
      if(data.success){
        setRecentChats(data.results);
      }
    

    }
  useEffect(()=>{
  getRecentChats();
  },[addUserForChats,activateChatpage]);

  useEffect(()=>{
  
    socket.on("recieve-mssg",(data)=>{
    
   setRecentChats((prevChats)=>{
     const exists=prevChats.some((allChats)=>allChats._id===data.from);
    if(exists){
      return prevChats.map((chat) =>{
     
      return  chat?._id === data?.from ? { ...chat, message: data.message? data.message : "You have a new attachment" } : chat;
        }
      )
    }
    else{
       getRecentChats();
       return prevChats;
    }
    
   })
    });
   
    return () => {
          socket.off("receive-msg");
        };
  },[socket._id,senderId._id])


  useEffect(()=>{
     const results=recentchats.filter((ele)=>{
   
      return (ele.username?.toLowerCase().includes(input1.toLowerCase()) || ele.message.toLowerCase().includes(input1.toLowerCase()));
     });
      const sortedResults=[...results].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
     setFilteredRecentChats(sortedResults);
  },[input1,recentchats,activateChatpage]);
 
  return (
    <div className='relative w-full h-[100vh'>
     { !addUserForChats && !activateChatpage && <div className='fixed  z-30  bottom-32 right-10  '><button className="cursor-pointer" onClick={()=>{setAddUserForChats(true)}}><img src="./Images/chartnew.png" className='w-[50px] h-[50px] sm:w-[80px] sm:h-[80px]'/></button></div>}
  { addUserForChats && !activateChatpage && <div className='absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] bg-gray-800  w-[90vw] sm:w-[60vw] md:w-[50vw] h-[60vh] border-2 rounded-2xl shadow-2xl shadow-gray-600 flex flex-col'>
      <div className='relative flex justify-center gap-10 pt-5'>
        <input type="text" placeholder='@username/name' className='w-[60vw] sm:w-[40vw] md:w-[30vw] h-[6vh] sm:h-[8vh] bg-white rounded-2xl shadow-2xl shadow-gray-400 text-xl sm:text-2xl  ' value={input} onChange={(e)=>{setInput(e.target.value)}}/>
       <div className='absolute top-6 sm:top-8 right-5 md:right-0'><button className='text-3xl w-[5vw] h-[5vh]' onClick={()=>{setAddUserForChats(false)}}>❌</button></div>
      </div>
        
        <div className='flex flex-col justify-center w-full pt-5 overflow-auto scrollbar-hide gap-5'>
          {
            filteredFollowingUsers.map((ele)=>(
              <div className="flex flex-row justify-between bg-yellow-50 rounded-2xl ">
                <div className='flex flex-row justify-center items-center gap-4 sm:gap-10'>
                <img src={ele.profile_photo} className='w-[50px] h-[50px] rounded-full'/>
                <h1 className='text-lg sm:text-2xl text-blue-500'>{ele.username}</h1>
                </div>
                <div className='flex justify-center items-center sm:mr-5'>
                  <button className='w-[25vw] sm:w-[15vw] md:w-[15vw] lg:w-[8vw] h-[5vh] text-lg sm:text-xl md:text-2xl bg-green-300 rounded-2xl shadow-2xl shadow-green-500' onClick={()=>{setSenderId(ele); setActiveChatPage(true);}}>Message</button>
                  </div>
              </div>
            ))
}
        </div>
      
      
     </div>
      }
      {activateChatpage  && <ChatComponent senderId={senderId} setActiveChatPage={setActiveChatPage} yourUser={yourUser}/>}
      <div className='w-full flex flex-row ' >
 {!activateChatpage && <button className='w-[5vw] h-[8vh] text-4xl' onClick={()=>{Navigate("/")}}>⬅️</button>}</div>
 {
  !activateChatpage &&
  <div className='flex flex-col w-full '>
      <div className='flex flex-row justify-center'>
         <input type="text" placeholder='Search....' className='w-[80vw] sm:w-[70vw] md:w-[60vw] xl:w-[50vw] h-[6vh] sm:h-[7vh] bg-gray-800 text-orange-400 rounded-2xl shadow-2xl shadow-gray-400 text-[1rem] sm:text-[1.3rem] pl-4  ' value={input1} onChange={(e)=>{setInput1(e.target.value)}}/>
      </div>
      <div className='flex flex-col items-center w-full pt-4 gap-3  overflow-auto scrollbar-hide h-[70vh]'>
        {
          filteredRecentChats.map((ele)=>(
            <div className='flex flex-row w-[80vw] sm:w-[70vw] md:w-[60vw] xl:w-[50vw] gap-10 cursor-pointer rounded-2xl bg-[lightskyblue] pl-2' onClick={()=>{setActiveChatPage(true); setSenderId(ele)}}>
              <div className='flex justify-center items-center'>
                <img src={ele.profile_photo} className='w-[50px] h-[50px] sm:h-[60px] sm:w-[60px] rounded-full object-contain'/>
              </div>
              <div className='flex flex-col justify-center'>
                <h1 className='text-[1.1rem] sm:text-[1.4rem] text-[black] font-[Geneva] '>{ele.username}</h1>
                <p className='text-[0.8rem] sm:text-[1rem] font-sans'>{ele.message.substring(0,50)}{ele.message.substring(0,50).length>=50 ? "........." : ""}</p>
              </div>
            </div>
          ))
        }
        </div>
  </div>
 }
      
    </div>
  )
}

export default Chats