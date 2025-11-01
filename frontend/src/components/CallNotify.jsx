import React,{useEffect,useState} from 'react'
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
function CallNotify({setActiveCall,callDetails}) {
    const url="https://socialsphere-backend-dih0.onrender.com";
    const Navigate=useNavigate();
     const [timeLeft, setTimeLeft] = useState(30);
     
    useEffect(() => {
    if (timeLeft <= 0) {
      setActiveCall(false);
      socket.emit("decline-video-call",callDetails);
     
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, setActiveCall]);
    const acceptCall=()=>{
        setActiveCall(false);
        
      
      Navigate(`/video-call/${callDetails.url}`);

    }
    const declinecall=()=>{
      socket.emit("decline-video-call",callDetails);
       
      
      setActiveCall(false);
    }
  return (
    <div className='w-[80vw] md:w-[50vw] lg:w-[40vw]  h-[50vh] bg-gray-800 flex flex-col justify-evenly items-center rounded-2xl p-2 '>
     <div className='flex justify-center items-center w-full'>
        <p className=' text-[1.1rem] sm:text-[1.4rem] font-[Roboto] text-[tomato] '>@{callDetails.username} ask you to join a call </p>
     </div>
     <div className='flex w-full justify-center items-center rounded'>
      <img src={callDetails.profile_photo} className='w-[100px] h-[100px] rounded-full object-contain'/>
     </div>
     <div className='w-full flex flex-row justify-center items-center gap-10'>
        <button className='animate-bounce' onClick={()=>{acceptCall();}}><img src="/Images/acceptcall.png" className='w-[50px] h-[50px]'/></button>
                <button onClick={()=>{declinecall()}} ><img src="/Images/declinecall.png" className='w-[50px] h-[50px]'/></button>
     </div>
    </div>
  )
}

export default CallNotify 