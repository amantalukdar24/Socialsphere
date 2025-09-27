import React,{useState,useEffect} from 'react'
import {useDispatch } from 'react-redux'
import { logout } from '../features/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Settings() {
  const url="https://socialsphere-backend-i5l1.onrender.com";
  const Navigate=useNavigate();
  const [activateAccountCenter,setActivateAccountCenter]=useState(false);
  const [changeUsername,setchangeUsername]=useState(false);
  const [changePassword,setChangePassword]=useState(false);
  const [delelteInfo,setdeleteInfo]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [input,setInput]=useState("");
  const [usernameMssg,setUsernameMssg]=useState("");
 const Dispatch=useDispatch();
 const checkUsername=async ()=>{
  
  const result=await fetch(`${url}/user/usernameavailable`,{
    method:"POST",
    headers:{
      "Content-type":"application/x-www-form-urlencoded",
    },
    body:new URLSearchParams({username})
  });
  const data=await result.json();
  setUsernameMssg(data);
  
   }
const updateUsername=async ()=>{
    const result=await fetch(`${url}/user/changeusername`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      },
      body:new URLSearchParams({username})
    });
    const data=await result.json();
    if(data.success){
       Navigate("/");
       toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
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
const updatePassword=async ()=>{
const result=await fetch(`${url}/user/changepassword`,{
  method:"PATCH",
        headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      },
      body:new URLSearchParams({password})
});
const data=await result.json();
if(data.success){
     Navigate("/");
       toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
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

const deleteAccount=async ()=>{
  if(input==="delete"){
  const result=await fetch(`${url}/user/deleteaccount`,{
    method:"DELETE",
    headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      }
  });
  const data=await result.json();
  if(data.success){
       toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
       });
       localStorage.removeItem("token");
       Dispatch(logout());
  }
  else{
        toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
       });
  }
}
else return;
}
  return (
    <div className='relative w-full h-[100vh] flex flex-col justify-center  items-center'>
      <div className='w-[90vw] md:w-[60vw]  lg:w-[60vw]   bg-gray-800 rounded-4xl h-[70vh]   shadow-2xl shadow-black'>
       <div className='flex flex-row justify-center items-center border-b-2 border-amber-50 '>
        <h1 className='text-[2rem] font-[roboto] tracking-[2px] text-orange-500'>Settings</h1>
       </div>
       <div className='flex flex-col w-full gap-10 mt-4   rounded-[5px]'>
     { !activateAccountCenter && 
       (<> <div className='w-full flex flex-col gap-2 bg-amber-50 p-2 cursor-pointer' onClick={()=>{setActivateAccountCenter(true)}}>
         <h1 className='text-[1rem] sm:text-[1.3rem] font-[Arial] '>Account Center</h1>
         <p className='text-[0.8rem] sm:text-[1.1rem]'>Change Username And Password,Delete Account</p>

        </div>
         <div className='w-full h-[10vh] flex flex-row justify-between items-center p-2 bg-amber-50'>
         <h1 className='text-[1rem] sm:text-[1.3rem] font-[Arial] '>Exit from this device</h1>
        <button className='text-[1rem] sm:text-[1.2rem] w-[30vw] sm:w-[15vw] h-[5vh] rounded-2xl font-[sans] bg-[tomato]' onClick={()=>{localStorage.removeItem('token'); Dispatch(logout());}}>Logout</button>

        </div>
        </>)
}
{
  activateAccountCenter && (
    <>
    <div className='w-full flex p-2'>
      <button className='text-4xl' onClick={()=>{setActivateAccountCenter(false)}}>⬅️</button>
    </div>
    <div className='w-full flex flex-row p-2   justify-between items-center bg-amber-100'>
   {!changeUsername && <> <h1 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.4rem] xl:text-[1.5rem] font-[Arial]'>Change Username</h1>
      <button className='text-[1.3rem] sm:text-[1.5rem] w-[25vw] sm:w-[20vw] xl:w-[15vw] h-[5vh] rounded-2xl font-[sans] bg-emerald-300' onClick={()=>{setchangeUsername(true); setChangePassword(false); }}>Change</button></> }
      {
        changeUsername && <>
   <div className='flex flex-col '>   <input type="text" value={username} placeholder='Enter Username' className='w-[40vw] sm:w-[30vw] md:w-[20vw] h-[6vh] rounded-xl bg-amber-50 text-[0.8rem] sm:text-[1rem] border-2' onChange={(e)=>{setUsername(e.target.value); }} onKeyUp={()=>{checkUsername()}}/>
    {username.length>0   &&    (usernameMssg.success? <p className='text-lime-600 font-sans text-md xl:text-xl'>{usernameMssg.Mssg}</p> : <p className='text-red-400 font-sans text-md'>{usernameMssg.Mssg}</p>)}
   </div>
   <div className='flex flex-row gap-2 justify-center items-center' >
    <button className='text-[1rem] sm:text-[1.3rem] w-[18vw] sm:w-[15vw] h-[5vh]  rounded-2xl font-[sans] bg-emerald-300' onClick={()=>{updateUsername()}}>Submit</button>
        <button className='text-[1rem] sm:text-[1.3rem] w-[18vw] sm:w-[15vw] h-[5vh]  rounded-2xl font-[sans] bg-[cornflowerblue]' onClick={()=>{setchangeUsername(false)}}>Cancel</button>
    </div>  
        </>
      }
    </div>
       <div className='w-full flex flex-row p-2   justify-between items-center bg-amber-100'>
       { !changePassword && <>
      <h1 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.4rem] xl:text-[1.5rem]font-[Arial]'>Change Password</h1>
      <button className='text-[1.3rem] sm:text-[1.5rem] w-[25vw] sm:w-[20vw] xl:w-[15vw] h-[5vh] rounded-2xl font-[sans] bg-emerald-300' onClick={()=>{setChangePassword(true); setchangeUsername(false);}}>Change</button></>}
      {
        changePassword && <>
         <input type="text" value={password} placeholder='Enter New Password' className='w-[40vw] sm:w-[30vw] md:w-[20vw] h-[6vh] rounded-xl bg-amber-50 text-[0.8rem] sm:text-[1rem] border-2' onChange={(e)=>{setPassword(e.target.value); }} />
          <div className='flex flex-row gap-2 justify-center items-center' >
    <button className='text-[1rem] sm:text-[1.3rem] w-[18vw] sm:w-[15vw] h-[5vh]  rounded-2xl font-[sans] bg-emerald-300' onClick={()=>{updatePassword()}}>Submit</button>
        <button className='text-[1rem] sm:text-[1.3rem] w-[18vw] sm:w-[15vw] h-[5vh]  rounded-2xl font-[sans] bg-[cornflowerblue]' onClick={()=>{setChangePassword(false)}}>Cancel</button>
    </div>
        </>
      }
    </div>
       <div className='w-full flex flex-row p-2   justify-between items-center bg-amber-100'>
      <h1 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.4rem] xl:text-[1.5rem] font-[Arial]'>Delete Your Account Permanently</h1>
      <button className='text-[1.3rem] sm:text-[1.5rem] w-[25vw] sm:w-[20vw] xl:w-[15vw] h-[5vh] rounded-2xl font-[sans] bg-[tomato]' onClick={()=>{setdeleteInfo(true)}}>Delete</button>
    </div>
    </>
  )
}
       </div>
      </div>
  {delelteInfo && <>   <div className='absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] xl:w-[50vw] p-4 bg-gray-900 rounded-2xl flex flex-col gap-5'>
   <div className='flex flex-row gap-5 justify-center items-center '>
        <p className='text-md sm:text-xl md:text-2xl font-[roboto] text-gray-300'>All your posts and diffrent activity will be removed permanently</p>
      </div>
     <div className='flex flex-row justify-center'>
      <input className='md:w-[25vw] lg:w-[20vw] xl:w-[15vw] h-[6vh] rounded-xl font-[Arial] text-[1rem] bg-amber-50' value={input} placeholder='Type "delete" to confirm' onChange={(e)=>{setInput(e.target.value)}}/>
     </div>
           <div className='flex flex-row gap-2 justify-center items-center' >
    <button className='w-[15vh] h-[5vh] text-[1.5rem] rounded-2xl font-[sans] bg-[tomato]' onClick={()=>{deleteAccount()}} >Confirm</button>
        <button className='w-[15vh] h-[5vh] text-[1.5rem] rounded-2xl font-[sans] bg-[cornflowerblue]' onClick={()=>{setdeleteInfo(false);}}>Cancel</button>
    </div> 
      
      </div></>}   </div>
  )
}

export default Settings