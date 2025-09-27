import React,{useEffect, useState,useRef,useCallback} from 'react'
import { useParams } from 'react-router-dom'
import Stories from 'react-insta-stories'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function StoryComponent() {
  const url="https://socialsphere-backend-i5l1.onrender.com";
   const params=useParams();
   const Navigate=useNavigate();
  const [stories,setStories]=useState([]);
  const [followingStory,setFollowingStory]=useState([]);
  const [userId,setUserId]=useState("");
  const [currentStoryIndex,setCurrentStoryIndex]=useState(0);
  
     const getUserId=useCallback(async ()=>{
      const result=await fetch(`${url}/user/getprofileuser`,{
         method:"GET",
       headers:{
         "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
       },

      });
      const data=await result.json();
      if(data.success){
         setUserId(data.user._id);
      
      }
   },[userId]);
   useEffect(()=>{
    getUserId();
   },[])
const getTime = (date) => {
  const currentDate = new Date();
  const customDate = new Date(date);

  const diffMs = currentDate - customDate; 
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `Posted just now`;
  if (diffMin < 60) return `Posted ${diffMin} min ago`;
  return `Posted ${diffHr} hr ago`;
};
   const getStory=async ()=>{
    const result=await fetch(`${url}/story/getstory`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem('token')
      },
      body:new URLSearchParams({userId:params.id})
    });
    const data=await result.json();
    if(data.success){
      
 const formatedStory=   data.story?.map((ele)=>({
           _id:ele._id,
           url:ele.story.filePath,
             userId:ele.userId._id,
              type:`${ele.story.fileType}`,
              header:{
                heading:`${ele.userId.username}`,
                subheading:getTime(ele.createdAt),
                profileImage:ele.userId.profile_photo
              },
              duration:15000,
             
           
    }))|| [];
   setStories(formatedStory);
   
    }
    else {
      if(stories.length===0) Navigate("/");
    }
   }
   useEffect(()=>{
    getStory();
  
   },[params.id]);
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
           const formattedUserId=data.results?.map((ele)=>(
              ele._id
           ));
            setFollowingStory(formattedUserId);
        }
        else{
            setFollowingStory([]);
        }
     }
     useEffect(()=>{
        getAllFollowingStory();
     },[])
   
  const storyForward = () => {
    const currentIndex = followingStory.indexOf(params.id);
    if (currentIndex < followingStory.length - 1) {
      Navigate(`/story/${followingStory[currentIndex + 1]}`);
    } else {
      Navigate("/");
    }
  };

  const storyBackward = () => {
    const currentIndex = followingStory.indexOf(params.id);
    if (currentIndex > 0) {
      Navigate(`/story/${followingStory[currentIndex - 1]}`);
    } else {
      Navigate("/");
    }
  };

const deleteStory=async (storyId,index)=>{
  
  if(storyId.length===0) return;
  const result=await fetch(`${url}/story/deletestory`,{
    method:"DELETE",
        headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "authorization":localStorage.getItem('token'),
            },
        body:new URLSearchParams({storyId})

  });
  const data=await result.json();
  if(data.success){
    toast.success(data.mssg,{
      position:"top-center",
      autoClose:5000,
      theme:"dark"
    });
 location.reload();

  }
  else{
       toast.error(data.mssg,{
      position:"top-center",
      autoClose:5000,
      theme:"dark"
    });
  }
}



  return (
    <div className='relative w-full  flex  sm:justify-center h-[100vh] '>
      <div className={`${userId === stories[0]?.userId ? "w-[85vw]":"w-full"}  max-w-[400px] md:w-[70vw] lg:w-[30vw] h-[90vh] pt-2`}>
   { stories.length>0 &&  <Stories stories={stories}
   defaultInterval={15000} keyboardNavigation={true} 
   storyContainerStyles={{borderRadius:"10px"}}
   onAllStoriesEnd={()=>{storyForward()}}
    
    onStoryStart={(index,s) => setCurrentStoryIndex(index)}
   
   loader
   width="100%"
   height="100%"
   
   
   />}

  { userId === stories[0]?.userId &&   <div className='absolute top-10 right-1 sm:right-5 flex justify-center items-center z-20'>{
   
      <button  onClick={(e)=>{e.stopPropagation();console.log(stories[currentStoryIndex]); deleteStory(stories[currentStoryIndex]._id,currentStoryIndex);}}><img src="/Images/delete.png" className='w-[40px] h-[40px]'/></button>
 
    }
   </div>}
   </div>

    <button className='hidden lg:block absolute  top-50 right-0 rounded w-[10vw] h-[10vh] text-5xl ' onClick={()=>{storyForward()}}>➡️ </button>
        <button className=' hidden lg:block absolute top-50 left-0 rounded w-[10vw] h-[10vh] text-5xl ' onClick={()=>{storyBackward()}}>⬅️ </button>
    </div>
  )
}

export default StoryComponent