import React,{useEffect, useState} from 'react'
import { NavLink,useLocation } from 'react-router-dom'
function Footer() {
  const [showFooter,setShowFooter]=useState(false);
  const Location=useLocation();
  useEffect(()=>{
   if(Location.pathname==="/chats" || Location.pathname.startsWith("/video-call/")) setShowFooter(true);
   else setShowFooter(false);
  },[Location.pathname])
  return (
    <div className={`w-full h-[30vh]  bg-gray-800 flex flex-row  items-center ${showFooter ? "hidden" : ""
    }`}>
    <div className='flex flex-col w-1/3 h-full gap-10 border-r-2 border-r-gray-400 pr-5'>
        <div className='flex flex-col'>
           <div className='flex flex-row w-full  h-15 xl:h-20 font-bold justify-center items-center '>
        <img src="../Images/Logo.png"  className=' w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:h-13 md:w-13'/>
        <h1 className='font-serif text-[0.5rem] sm:text-[1.2rem] lg:text-4xl font-stretch-extra-condensed tracking-widest text-blue-500'>ocialSphere</h1>
    </div>
   <div className='flex flex-row justify-center items-center w-full'>  <p className='text-[0.7rem] sm:text-[1rem] md:text-[1.5rem] text-[yellowgreen] tracking-normal animate-pulse duration-100 ease-in-out font-light animate-'>Connect, Share and Explore</p></div> 
    </div>
      <div className="text-center mt-4 text-[0.8rem] sm:text-[1.2rem] text-blue-400">
    © 2025 SocialSphere. All Rights Reserved.
  </div>
    </div>
  <div className='flex flex-col w-1/3 h-full  border-r-2 border-r-gray-400'>
    <div className='flex flex-row justify-center items-center'><h1 className='text-[1rem] sm:text-[2rem] font-mono text-cyan-600'>Quick Links</h1></div>
    <div className='flex flex-col w-full  items-center'>
      <ul className='list-none text-md sm:text-[1.2rem] text-gray-100 ' onClick={()=>{window.scrollTo(0,0)}}>
   <NavLink to="/" > <li className='hover:text-orange-300' >Home</li></NavLink> 
   <NavLink to="/about">   <li className='hover:text-orange-300'>About</li></NavLink>
    <NavLink to="/privacy" > <li className='hover:text-orange-300'>Privacy</li></NavLink>
   <NavLink to="/contact"  > <li className='hover:text-orange-300'>Contact</li></NavLink>
      </ul>
    </div>
  </div>
   <div className='flex flex-col w-1/3 gap-5 h-full  '>
    <div className='flex flex-row justify-center items-center'><h1 className='text-[1rem] sm:text-[2rem] font-mono text-cyan-600'>Connect Us</h1></div>
    <div className='flex flex-row justify-center gap-2 sm:gap-10 w-full  items-center'>
      <NavLink to="https://www.linkedin.com/in/aman-talukdar-611391184/" target='blank'>
      <img src="https://img.icons8.com/color/96/linkedin.png" alt="linkedin" className='w-[50px] h-[50px]'/>
      </NavLink>
      <NavLink to="https://github.com/amantalukdar24" target='blank'>
      <img src="https://img.icons8.com/ios-filled/50/github.png" alt="github" className='w-[50px] h-[50px] border-2 border-white rounded-full'/>
      </NavLink>
    </div>
  </div>

    </div>
  )
}

export default Footer