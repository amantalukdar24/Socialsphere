import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../socket';
function Notify() {
    const url="https://socialsphere-backend-dih0.onrender.com";
    const Navigate=useNavigate();
    const [allNotify,setAllNotify]=useState([]);
    useEffect(()=>{
      const getNotify=async ()=>{
       const result=await fetch(`${url}/notify/allnotify`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "authorization":localStorage.getItem("token")
        }
       });
       const data=await result.json();
       if(data.success){
        setAllNotify(data.notifys);
       }
      }
      getNotify();
    },[socket.id]);
 
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
  return (
    <div className='w-full h-[90vh] flex flex-col overflow-auto scrollbar-hide'>
        <div className='w-full'><button className='flex text-[2.3rem]' onClick={()=>{Navigate("/")}}>⬅️</button></div>
     {
      allNotify.length>0 ? <div className='flex flex-col justify-center    '>
        {
          allNotify.map((ele)=>(
            <div key={ele._id} className='flex flex-col justify-center gap-1 p-2  rounded-2xl w-full'>
              <h1 className='text-[1.5rem] w-full text-gray-700 border-b-2 '>{setDateInString(ele._id)}</h1>
              {
                ele.allNotify.map((allnotify)=>(
              <div className='flex flex-row items-center bg-gray-700 gap-2 rounded-xl p-2' onClick={()=>{const url=`${allnotify.type === "liked" || allnotify.type==="commented" ? `/post/${allnotify.urlId}`:`/${allnotify.urlId}`}`; Navigate(url)}}>
                    <img src={allnotify.user.profile_photo} className='w-[50px] h-[50px] rounded-full'/>
                    <h1 className='text-[1.2rem] font-[roboto] text-[yellowgreen]'>{allnotify.type==="liked" || allnotify.type==="commented" ? `${allnotify.user.username} ${allnotify.type} on your post`: `${allnotify.user.username} started following you`}</h1>
                    
                    </div>
                ))
              }
            </div>
          ))
        }
      </div>:<div className='flex flex-col justify-center items-center h-[90vh]'>
        <img src="./Images/info.png" className='w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-2xl '/>
      <h1 className='text-[1.2rem] sm:text-[1.5rem] font-serif font-bold text-red-400'>No Notification Available </h1>
      </div>
     }
    </div>
  )
}

export default Notify