import React,{useState,useCallback,useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify';
import {useDispatch} from "react-redux"
import { login } from '../features/authSlice';
function Register() {
  const url="https://socialsphere-backend-i5l1.onrender.com";
  const Dispatch=useDispatch();
  const [isSubmit,setIsSubmit]=useState(false);
  const [inputs,setInputs]=useState({
  name:"",
  email:"",
  username:"",
  password:""
});
const [usernameMssg,setUsernameMssg]=useState("");

const handleChange=(e)=>{
  setInputs(()=>({...inputs,[e.target.name]:e.target.value}));
 
  
}
const checkUsername=async ()=>{
  
  const result=await fetch(`${url}/user/usernameavailable`,{
    method:"POST",
    headers:{
      "Content-type":"application/x-www-form-urlencoded",
    },
    body:new URLSearchParams(inputs)
  });
  const data=await result.json();
  setUsernameMssg(data);
  
  
}
const handleSubmit=async (e)=>{
  e.preventDefault();
  if(isSubmit) return;
  setIsSubmit(true);
  const result=await fetch(`${url}/user/register`,{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body:new URLSearchParams(inputs)
  });
  const data=await result.json();
  if(data.success){
    localStorage.setItem("token",data.token);
    toast.success(data.mssg,{
      position:'top-center',
      autoClose:5000,
     theme:"dark"
    });
    Dispatch(login());
  }
  else{
      toast.error(data.mssg,{
      position:'top-center',
      autoClose:5000,
     theme:"dark"
    });
  }
  setIsSubmit(false);
}

  return (
    <div className="flex flex-col sm:flex-row md:justify-center gap-1 sm:gap-20  w-screen     h-[100vh]   ">
       <div className='flex justify-center ' >
          <img src="../Images/image.png" alt="Failed to load" className='sm:h-[500px] sm:lg:w-[500px]'/>
       </div>
       <div className='flex flex-col gap-2 md:gap-3 justify-center w-3xs self-center justify-self-center sm:w-5xl '>
          <h1 className='font-bold font-mono text-center text-5xl md:text-7xl text-emerald-400 '>Register</h1>
          <div className='flex justify-center'>
            <input type='text' placeholder='Enter Your Name' required className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4' value={inputs.name} name="name" onChange={handleChange}/>
          </div>
          <div className='flex justify-center'>
            
            <input type='email' placeholder='Enter Your Email' required className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4' value={inputs.email} name="email" onChange={handleChange}/>
        
          </div>
          <div className='flex justify-center'>
            <div className='flex flex-col justify-center'>
            <input type='text' placeholder='Create Your Username' required className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4' value={inputs.username} name="username" onChange={handleChange} onKeyUp={checkUsername} />
       {inputs.username.length>0   &&    (usernameMssg.success? <p className='text-lime-600 font-sans text-md xl:text-xl'>{usernameMssg.Mssg}</p> : <p className='text-red-400 font-sans text-md'>{usernameMssg.Mssg}</p>)}
         </div>
          </div>
           <div className='flex justify-center'>
            <input type='password' placeholder='Create Your Password' required className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4' value={inputs.password} name="password" onChange={handleChange}/>
          </div>
          <div className='flex justify-center'>
            <button type="submit" className={`w-30 md:w-35 lg:w-40  h-10 ${!isSubmit ? "bg-green-400" : "bg-green-200"} text-xl md:text-2xl text-gray-900 font-mono rounded`} onClick={handleSubmit}>{!isSubmit ? <span>Signup</span> :<span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
        }</button>
          </div> 
          <div className='flex justify-center'>
            <NavLink to='/login'><h1 className='text-mono text-xl sm:text-xl md:text-2xl text-orange-400'>Have an account? Login</h1></NavLink> 
          </div>
       </div>

    </div>
  )
}

export default Register