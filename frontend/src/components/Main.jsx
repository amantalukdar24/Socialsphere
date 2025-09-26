import React, { useState } from 'react'

 import Sidebar from '../components/Sidebar'
 import { Routes,Route } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import Resetpassword from '../Pages/Resetpassword'
import Home from '../Pages/Home'
import Search from '../Pages/Search';
import Settings from "../Pages/Settings"
import Create from '../Pages/Create'
import Profile from '../Pages/Profile';
import UsersProfile from '../Pages/UsersProfile';
import StoryComponent from '../components/StoryComponent.jsx';
import Chats from '../Pages/Chats';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Privacy from '../Pages/Privacy';
import Post from '../Pages/Post';
import CallPage from  "../Pages/CallPage";
import socket from '../socket.js';
import CallNotify from './CallNotify.jsx';
import Notify from '../Pages/Notify.jsx';
function Main() {
   const isLoggedIn=useSelector((state)=>state.auth.value);
   const [activeCall,setActiveCall]=useState(false);
   const [callDetails,setCallDetails]=useState({
      _id:"",
     username:"",
     profile_photo:"",
     url:"",
     from:"",
   })
  const handleVideoCall=(data)=>{
     setCallDetails({
         _id:data._id,
     username:data.username,
     profile_photo:data.profile_photo,
     url:data.url,
     from:data.from,
     });
     setActiveCall(true);
  }
   socket.on("recieve-video-call",handleVideoCall);
   
  return (
    <div className="flex flex-row  relative">
     {isLoggedIn &&   <Sidebar/>  }
       <Routes>
       
          <Route index element={<Home />} />
        
       <Route path='/login' element={<Login/>}/>
       <Route path="/signup" element={<Register/>}/>
       <Route path='/resetpassword' element={<Resetpassword/>}/>
       <Route path='/search' element={<Search/>}/>
       <Route path='/create' element={<Create/>}/>
       <Route path='/settings' element={<Settings/>}/>
       <Route path='/profile' element={<Profile/>}/>
       <Route path="/:id" element={<UsersProfile/>}/>
       <Route path="/home" element={<Home/>}/>
       <Route path="/story/:id" element={<StoryComponent/>}/>
       <Route path="chats" element={<Chats/>}/>
       <Route path="/about" element={<About/>}/>
       <Route path="/privacy" element={<Privacy/>}/>
       <Route path="/contact" element={<Contact/>}/>
       <Route path="/post/:id" element={<Post/>}/>
       <Route path="/video-call/:id" element={<CallPage/>}/>
       <Route path="/notification" element={<Notify/>}/>
       <Route path="/404" element={<div className='flex flex-col justify-center items-center w-full h-[90vh]'><h1 className='text-[1.5rem] sm:text-[2rem] font-[Arial] font-bold text-gray-700'>404 Page Not Found</h1></div>} />
   </Routes>
    {activeCall && <div className='absolute left-1/2 top-1/2 transform translate-x-[-50%] sm:translate-x-[-40%] translate-y-[-50%]'><CallNotify setActiveCall={setActiveCall} callDetails={callDetails} /></div>}
    </div>
  )
}


export default Main