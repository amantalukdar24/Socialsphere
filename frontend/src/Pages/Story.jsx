import React,{useState,useRef} from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
function Story() {
    const url="https://socialsphere-backend-i5l1.onrender.com";
    const [uploadStory,setUploadStory]=useState(false);
    const inputRef=useRef(null);
    const [media,setMedia]=useState({});
    const [isStoryAvail,setIsStoryAvail]=useState({});
    const [yourStory,setYourStory]=useState(false);
    const [followingStory,setFollowingStory]=useState([]);
    const [uploading,setUploading]=useState(false);
    const handleChange=(file)=>{
        setMedia(file);
    }
 const handleupload=async ()=>{
    if(uploading) return;
    setUploading(true);
    const formData=new FormData();
    formData.append("media",media);
    const result=await fetch(`${url}/story/poststory`,{
        method:"POST",
        headers:{
            "authorization":localStorage.getItem('token'),
        },
        body:formData,
    });
    const data=await result.json();
    if(data.success){
       toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
       });
       setMedia({});
       setUploadStory(false);
    }
    else{
           toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
       });
    }
    setUploading(false);
 }
 const yourStoryAvail=async ()=>{
    const result=await fetch(`${url}/story/isyourstory`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "authorization":localStorage.getItem('token')
        },
    });
    const data=await result.json();
    if(data.success){
        
        setIsStoryAvail(true);
        setYourStory(data.userId)
    }
    else{
         setIsStoryAvail(false);
    }
 }
 useEffect(()=>{
    yourStoryAvail();
 },[media]);
 const getAllFollowingStory=async ()=>{
    const result=await fetch(`${url}/story/followingusersstory`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "authorization":localStorage.getItem('token'),
        },
        
    });
    const data=await result.json();
    if(data.success){
        setFollowingStory(data.results);
    }
    else{
        setFollowingStory([]);
    }
 }
 useEffect(()=>{
    getAllFollowingStory();
 },[])
  return (
    <div className='w-full  h-[20vh] border-b-2 overflow-auto scrollbar-hide flex flex-row'>
        <div className=' h-full flex items-center border-r-2'>
            <div className='flex flex-col justify-center items-center w-[22vw] sm:w-[20vw] md:w-[12vw] xl:w-[8vw] h-[15vh] ml-2 mr-2 border-2 rounded-2xl cursor-pointer' onClick={()=>setUploadStory(true)}>
             <img src="./Images/create.png" className='w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]  rounded-full '/>
           <h1 className='text-sm sm:text-xl font-serif'>Add Story</h1>
            </div>
        </div>
        {
            uploadStory && <div className='absolute z-10 top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[70vh] bg-gray-800 flex flex-col gap-10  items-center  right-64 rounded-2xl'>
                <div className='relative flex justify-center w-full mt-5'>
                <h1 className='text-4xl sm:text-5xl font-bold text-amber-600 font-mono'>Story Upload</h1>
                <button className='absolute top-0 sm:top-1 right-4 md:right-0 w-[5vw] h-[5vh] text-2xl sm:text-3xl' onClick={()=>{setUploadStory(false); setMedia({})}}>❌</button>
                </div>
                <div className='flex justify-center'>
                    <input ref={inputRef} type="file" accept="image/*,video/*" className='hidden' onChange={(e)=>{handleChange(e.target.files[0])}}/>
                    <button className='flex flex-row gap-5 w-[40vw] sm:w-[30vw] md:w-[25vw] lg:w-[15vw] xl:w-[15vw] xl:h-[5vh] text-2xl xl:text-3xl bg-blue-300 justify-center items-center border-2 rounded cursor-pointer' onClick={()=>inputRef.current.click()}>
      <img src="../Images/upload.png" className='w-[30px] h-[30px]'/>
      Upload</button>
                </div>
                 <div className='flex '>
                        {
                            media.type?.startsWith("image")? <img src={URL.createObjectURL(media)} className='w-[70vw] sm:w-[60vw] md:w-[40vw] h-[30vh] object-contain'/>:media.type?.startsWith("video")? <video src={URL.createObjectURL(media)} controls  className='w-[70vw] sm:w-[60vw] md:w-[40vw] h-[30vh] object-contain'/>:""
                        }
                    </div>
                
                <div className='flex justify-center w-full'>
                   <button className={`w-[20vw] sm:w-[15vw] md:w-[10vw] h-[5vh] mb-5 rounded-full text-2xl font-mono ${!uploading ? 'bg-green-300' : 'bg-green-200'}`} onClick={()=>{handleupload()}}>{!uploading ? <span>POST</span> : 
                    <span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
                   }</button>
                </div>
            </div>
        }
        <div className='flex flex-row items-center  w-full '>
           {isStoryAvail && <NavLink to={`story/${yourStory._id}`}><div className='flex flex-col justify-center items-center'>
                <div className='ml-2 border-4  rounded-full cursor-pointer'><img src={yourStory.profile_photo} className='w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full object-fill'/> </div>
                <h1 className='text-[1rem] sm:text-[1.1rem] font-serif font-medium '>Your Story</h1>
            </div></NavLink>}
            <div className='flex flex-row items-center overflow-auto scrollbar-hide'>
                {
                    followingStory.map((ele)=>(
           <NavLink to={`/story/${ele._id}`}>            <div className='flex flex-col justify-center items-center '>
                <div className='ml-2 border-4  rounded-full cursor-pointer'><img src={ele.profile_photo} className='w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full object-fill'/> </div>
                <h1 className='text-[1rem] sm:text-[1.1rem] font-[Arial] font-medium '>{ele.username}</h1>
            </div></NavLink> 
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Story