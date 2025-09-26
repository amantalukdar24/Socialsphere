import React,{useEffect,useState,useCallback} from 'react'
import debounce from "lodash.debounce"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';
function Search() {
  const url="https://socialsphere-backend-i5l1.onrender.com"
  const [searchUsername,setSearchUsername]=useState("");
  const [users,setUsers]=useState([]);
 const Navigate=useNavigate();
  const getUsers=useCallback(async ()=>{
          const result=await fetch(`${url}/search/getusers`,{
            method:"POST",
            headers:{
              "Content-Type":"application/x-www-form-urlencoded",
              "authorization":localStorage.getItem("token")
            },
            body:new URLSearchParams({searchUsername})
          });
          const data=await result.json();
          if(data.success){
            setUsers(data.users);
          }
          else{
            setUsers([])
            toast.error(data.mssg,{
              position:"top-center",
              autoClose:5000,
              theme:"dark"
            });
          }
  },[searchUsername]);

  useEffect(()=>{
     getUsers();
  },[searchUsername]);
  
  return (
    <div className=' flex flex-col w-full h-[100vh]'>
     <div className=' flex justify-center mt-4 '>
      <input type="text" className='w-[90vw] sm:w-[80vw] h-[5vh] md:w-[60vw] md:h-[7vh] text-[1rem] sm:text-[1.4rem] font-sans  border-2 outline-none rounded-2xl pl-4' placeholder='@username' value={searchUsername}
      onChange={(e)=>{setSearchUsername(e.target.value);}}
      />
    
     </div>
     <div className='flex flex-col  items-center  w-full gap-2 pt-4 h-[74vh] md:h-[80vh] overflow-auto scrollbar-hide '>
       {
        users.length>0 && 

        users.map((ele)=>(
          <div className='w-[90vw] sm:w-[80vw]  p-1 md:w-[60vw] border-2 flex flex-row gap-2 sm:gap-10 rounded-2xl bg-gray-800  cursor-pointer hover:bg-gray-900 ' onClick={()=>Navigate(`/${ele.username}`)}>
            <div className='flex justify-center items-center'>
              <img src={ele.profile_photo} className='object-cover w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded'/>
              </div>
              <div className='flex flex-col  justify-center '>
                <h1 className='text-[1rem] sm:text-[1.2rem] lg:text-[1.4rem] text-yellow-400 hover:text-green-300 font-sans'>@{ele.username}</h1>
                <h1 className='text-[0.8rem] sm:text-[1rem] lg:text-[1.2rem] text-white'>{ele.name}</h1>

              </div>
          </div>
        ))

       }

     </div>
    </div>
  )
}

export default Search