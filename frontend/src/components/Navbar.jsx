import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
function Navbar() {
  const Navigate=useNavigate();
  const [showNotifyicon,setShowNotifyicon]=useState(false);
  useEffect(()=>{
    if(localStorage.getItem("token")){
      setShowNotifyicon(true);
      return;
    }
    setShowNotifyicon(false);
  },[])
  return (
    <div className={`relative flex flex-row h-[8vh]  md:h-[10vh] bg-yellow-500 font-bold ${showNotifyicon ? "justify-start" : "justify-center"} sm:justify-center items-center p-2 sm:p-0 `}>
        <img src="../Images/Logo.png"  className='w-9 h-9 sm:w-13 sm:h-13 t'/>
        <h1 className='font-serif text-xl sm:text-4xl font-stretch-extra-condensed tracking-widest text-blue-500'>ocialSphere</h1>
       {showNotifyicon && <div className='flex items-center justify-center absolute top-1/2 right-5 transform translate-x-[-50%] translate-y-[-50%] bg-black rounded cursor-pointer' onClick={()=>{Navigate("/notification")}}>
         <img src="/Images/notify.png" className=' w-[40px] h-[40px] md:w-[50px] md:h-[50px]'/>
        </div>}
    </div>
  )
}

export default Navbar