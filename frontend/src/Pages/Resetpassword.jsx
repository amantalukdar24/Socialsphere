import React,{useState,useCallback,useEffect} from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import {toast} from "react-toastify"
function Resetpassword() {
  const Navigate=useNavigate();
  const url="https://socialsphere-backend-dih0.onrender.com";
  const [isSubmit,setIsSubmit]=useState(false);
  const [inputs,setInputs]=useState({
    email:"",
    password:"",
    otp:"",
  });
  const [secondsleft,setSecondsleft]=useState(0);
  useEffect(()=>{
    if(secondsleft<=0) return;
   const timer= setInterval(()=>{
      setSecondsleft(secondsleft-1);
    },1000);
    return ()=>clearTimeout(timer);
  },[secondsleft]);
  const handleChange= (e)=>{
    setInputs(()=>({...inputs,[e.target.name]:e.target.value}));
  };
  const getOtp=async (e)=>{
    e.preventDefault();
       setSecondsleft(90);
    const result=await fetch(`${url}/user/getotp`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body:new URLSearchParams(inputs)
    });
    const data=await result.json();
 
    if(data.success){
      
      toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
    }
    else{
      setSecondsleft(0);
         toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
    }
  
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(setIsSubmit) return;
    setIsSubmit(true);
      const result=await fetch(`${url}/user/verifyotp`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body:new URLSearchParams(inputs)
    });
   const data=await result.json();
   if(data.success)
   {
     
      toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
      Navigate('/login');
   }
   else{
      toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
   
  }
  setIsSubmit(false);
}
   return (
    <div className="flex flex-col sm:flex-row md:justify-center gap-2 sm:gap-20  w-screen mt-5      h-[100vh]  ">
       <div className='flex justify-center ' >
          <img src="../Images/image.png" className='sm:h-[500px] sm:lg:w-[500px]' alt="Failed to load" />
       </div>
       <div className='flex flex-col gap-4 justify-center w-3xs self-center justify-self-center  sm:w-5xl '>
          <h1 className='font-bold font-mono text-center text-3xl sm:text-5xl  text-emerald-400 '>Reset Password</h1>
          <div className='flex justify-center'>
            <input type='text' placeholder='Enter Your Email' required name="email" value={inputs.email} onChange={handleChange} className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4'/>
          </div>
           <div className='flex justify-center'>
            <input type='password' placeholder='Create Your New Password' name="password" value={inputs.password} onChange={handleChange} required  className='w-64 sm:w-96 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4'/>
          </div>
       <div className='flex justify-center'>
        <div className='flex flex-row  gap-1 sm:gap-4 2xl:gap-1 '>
                     <input type='text' placeholder='Enter 4 digit OTP' required name="otp" value={inputs.otp} onChange={handleChange} maxLength={4} className='w-48 sm:w-72 2xl:w-76 h-10 xl:h-11 xl:text-xl border-1 rounded pl-4'/>
               { secondsleft<=0 &&    <button type='submit' className='w-15 text-sm sm:text-lg h-10 sm:w-20 sm:h-10 xl:h-11 font-serif bg-blue-400 rounded' onClick={getOtp}>Get OTP</button>}
               {secondsleft>0 && <div className='w-15 h-10 sm:ml-5 md:ml-7 xl:h-11 xl:ml-6 2xl:ml-4 flex justify-center'> <p className='text-sm sm:text-md xl:text-lg font-medium items-center font-sans flex justify-center '>Resend?{secondsleft>=60 ? "1" : "0" }:{(secondsleft<10 || (secondsleft-60<10 &&secondsleft-60>=0 )) && '0'}{secondsleft>=60 ? `${secondsleft-60}`:`${secondsleft}`}</p></div>}
       </div>
       </div>
          <div className='flex justify-center'>
            <button type="submit" className={`w-28 md:w-35 lg:w-40 h-10 ${!isSubmit ? "bg-green-400" : "bg-green-200"} text-xl md:text-2xl text-gray-900 font-mono rounded`} onClick={handleSubmit}>{!isSubmit ? <span>Reset</span> :
           <span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
        }</button>
          </div>
          <div className='flex justify-center'>
            <NavLink to='/login'><h1 className='text-mono text-lg sm:text-xl md:text-2xl text-orange-400'>Have an account? Login</h1></NavLink> 
          </div>
       </div>

    </div>
  )
}

export default Resetpassword