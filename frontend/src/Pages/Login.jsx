import React,{useState} from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify';
import {useDispatch } from 'react-redux'
import { login } from '../features/authSlice';
function Login() {
  const url="https://socialsphere-backend-i5l1.onrender.com";
  const Dispatch=useDispatch();
  const [isSubmit,setIsSubmit]=useState(false);
  const [inputs,setInputs]=useState({
    emailOrusername:"",
    password:""
  });
  const handleChange=async (e)=>{
    setInputs(()=>({...inputs,[e.target.name]:e.target.value}));
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(isSubmit) return;
    setIsSubmit(true);
    const result=await fetch(`${url}/user/login`,{
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
          toast.error (data.mssg,{
            position:'top-center',
            autoClose:5000,
           theme:"dark"
          });
    }
    setIsSubmit(false);
  }
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-20  w-screen mt-5 md:mt-20 sm:30 h-[92vh] sm:h-[90vh] md:h-[85vh] xl:h-[80vh]  ">
       <div className='flex justify-center ' >
          <img src="../Images/image.png" className='sm:h-[500px] sm:lg:w-[500px]' alt="Failed to load" />
       </div>
       <div className='flex flex-col gap-4 justify-center w-3xs   self-center justify-self-center sm:w-5xl '>
          <h1 className='font-bold font-mono text-center text-5xl md:text-7xl text-emerald-400 '>Login</h1>
          <div className='flex justify-center'>
            <input type='text' placeholder='Enter Your Email or Username' required name="emailOrusername" value={inputs.emailOrusername} onChange={handleChange} className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl  text-[1rem] border-1 rounded pl-4'/>
          </div>
           <div className='flex justify-center'>
            <input type='password' placeholder='Enter Your Password' name="password" value={inputs.password} required onChange={handleChange} className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl text-[1rem] border-1 rounded pl-4'/>
          </div>
          <div className='flex justify-center'>
           <NavLink to='/resetpassword' ><p className='text-lg md:text-2xl text-blue-400'>Forgot Password?</p></NavLink>
          </div>
          <div className='flex justify-center'>
            <button type="submit" className={`w-28  md:w-35 lg:w-40 h-10 ${!isSubmit ? "bg-green-400" : "bg-green-200"} text-xl md:text-2xl text-gray-900 font-mono rounded`} onClick={handleSubmit}>{!isSubmit ? <span>Login</span> :
            <span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
        
            }</button>
          </div>
          <div className='flex justify-center'>
            <NavLink to='/signup'><h1 className='text-mono text-lg sm:text-xl lg:text-2xl text-orange-400'>Don't have an account? Sign up</h1></NavLink> 
          </div>
       </div>

    </div>
  )
}

export default Login
