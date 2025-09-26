import React,{useEffect,useCallback} from 'react'
import { useState } from 'react'
import { NavLink,useLocation } from 'react-router-dom'
function Sidebar() {
   const url="https://socialsphere-backend-i5l1.onrender.com";
   const Location=useLocation();
   const [hideSidebar,setHideSidebar]=useState(false);
   useEffect(()=>{
      
      if(Location.pathname==="/chats" || Location.pathname.startsWith("/video-call")) setHideSidebar(true);
      
      
     else  setHideSidebar(false);
     
   },[Location.pathname])
 
   const [user,setUser]=useState({
      name:"",
      username:"",
      profile_photo:"",
      followers:[],
      following:[],
      
   });
   const getPhoto=useCallback(async ()=>{
      const result=await fetch(`${url}/user/getprofileuser`,{
         method:"GET",
       headers:{
         "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
       },

      });
      const data=await result.json();
     
      
      if(data.success){
         setUser({
            name:data.user.name,
            username:data.user.username,
            profile_photo:data.user.profile_photo,
            followers:data.user.followers,
            following:data.user.following
         });
      
      }
   },[user]);
   useEffect( ()=>{
     getPhoto();
      
   },[]);

  return (
    <>
    <div className={`hidden  md:flex md:flex-col  md:w-[25vw] lg:w-[25vw] xl:w-[18vw] 2xl:w-[20vw] md:h-[92vh] xl:h-[90vh] bg-gray-900 bg-gradient-to-tr  border-2 rounded-r-2xl justify-center gap-6  ${hideSidebar ? "md:hidden" : ""}`}>
     
         <div className='bg-sky-50 flex flex-row w-full  justify-center'>
         <div className='flex justify-center w-1/2'><img src='/Images/home.png' className='md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'><NavLink to="/" className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}> <h1 className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem] font-serif '>Home</h1> </NavLink></div>
         </div>
            <div className='bg-sky-50 flex flex-row w-full  justify-center'>
         <div className='flex justify-center w-1/2'><img src='/Images/search.png' className='md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'> <NavLink to="/search" className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}>   <h1 className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem] font-serif'>Search</h1></NavLink> </div>
         </div>
            <div className='bg-sky-50 flex flex-row w-full  justify-center'>
         <div className='flex justify-center w-1/2'><img src='/Images/chat.png' className='md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'><NavLink to="/chats" className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}><h1 className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem]  font-serif'>Chats</h1></NavLink> </div>
         </div>
            <div className='bg-sky-50 flex flex-row w-full  justify-center'>
         <div className='flex justify-center w-1/2'><img src='/Images/create.png' className='md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'><NavLink to="/create" className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}><h1  className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem] font-serif' >Create</h1></NavLink> </div>
         </div>
            <div className='bg-sky-50 flex flex-row w-full  justify-center'>
         <div className='flex justify-center w-1/2'><img src='/Images/settings.png' className='md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'><NavLink to="/settings" className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}><h1 className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem] font-serif'>Settings</h1></NavLink> </div>
         </div>
 <div className='bg-sky-50 flex flex-row w-full mt-15 justify-center'>
         <div className='flex justify-center w-1/2'><img src={user.profile_photo}  
  className='object-cover md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]' alt="Failed to Load"/>  </div>
         <div className='flex flex-col justify-center w-1/2'><NavLink to="/profile"  className={({isActive})=>isActive? "text-pink-500 font-semibold" : ""}><h1 className='md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.7rem] font-serif'>Profile</h1></NavLink> </div>
         </div>
     </div>
   <div className={`flex flex-row z-10 w-screen  bottom-0 fixed h-[8vh] sm:h-[10vh] md:hidden   bg-gray-900 bg-gradient-to-br justify-between items-center ${hideSidebar ? "hidden" : ""}`}>
 <NavLink to="/" className={({isActive})=>isActive ? " rounded-xl opacity-[50%] brightness-[95%]" : ""}> <div className=" bg-white rounded"><img src='/Images/home.png' className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' alt="Failed to load" /></div>  </NavLink> 
    <NavLink to="/search" className={({isActive})=>isActive ? "opacity-[50%] brightness-[95%] rounded-xl " : ""}><div className='bg-white rounded'><img src='/Images/search.png' className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]'alt="Failed to load"/></div>    </NavLink> 
    <NavLink to="/create" className={({isActive})=>isActive ? "opacity-[50%] brightness-[95%] rounded-xl" : ""}> <div className='bg-white rounded'><img src='/Images/create.png' className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' alt="Failed to load"/></div></NavLink> 
    <NavLink to="/chats" className={({isActive})=>isActive ? "opacity-[50%] brightness-[95%] rounded-xl" : ""}><div className='bg-white rounded'><img src='/Images/chat.png' className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' alt="Failed to load"/></div></NavLink> 
    <NavLink to="/settings" className={({isActive})=>isActive ? "opacity-[50%] brightness-[95%] rounded-xl" : ""}><div className='bg-white rounded'><img src='/Images/settings.png' className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' alt="Failed to load"/></div></NavLink> 
   <NavLink to="/profile"  className={({isActive})=>isActive ? "opacity-[50%] brightness-[95%] rounded-xl" : ""}><div className='bg-white rounded'><img src={user.profile_photo} className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]' alt="Failed to load"/></div></NavLink> 
   </div>
   </>
  )
}


export default Sidebar