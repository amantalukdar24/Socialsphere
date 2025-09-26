import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import Footer from './components/Footer'
import './App.css'

 import { ToastContainer,toast } from 'react-toastify'
 import RefreshHandler from './RefreshHandler'
 import socket from './socket'

function App() {
  
 useEffect(()=>{
  const handleNotify=(data)=>{
    const postFixSen=data.type==="liked" || data.type==="commented" ? `${data.type} on your post` : "started following you";
     toast.info(`${data.username} ${postFixSen} `,{
      position:"top-center",
      autoClose:5000,
      theme:"dark"
     });
  }
  socket.on("new-notify",handleNotify);
   return () => {
      socket.off("new-notify", handleNotify);
    };
},[socket.id])
 
  return (
  <>
  <RefreshHandler/>

  <ToastContainer />
   <Navbar />
  <Main/>
  <Footer/>
   
  </>
  )
}

export default App
