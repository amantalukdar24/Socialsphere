import React,{useState,useCallback,useEffect, useRef} from 'react'
import Story from './Story';
import { useLocation,useNavigate,useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import socket from '../socket';
import {FacebookShareButton,WhatsappShareButton,TwitterShareButton,TelegramShareButton,TelegramIcon,FacebookIcon,WhatsappIcon,TwitterIcon} from "react-share"
function Post() {
  const url="https://socialsphere-backend-i5l1.onrender.com";
  const params=useParams();
  const [post,setPost]=useState([]);
  const [allPostInteraction,setAllPostInteraction]=useState({})
  const postbarRef=useRef({});
  const commentDivref=useRef({});
  const scrollRef=useRef({});
  const [postLike,setPostLike]=useState({});
  const [comment,setComment]=useState({});
  const [uploadComment,setUploadComment]=useState(false);
  
  const [mySelf,setmySelf]=useState({
     _id:"",
     name:"",
     username:"",
     profile_photo:"",
     followers:[],
     following:[],
   });
    const getMyself=useCallback(async ()=>{
      const result=await fetch(`${url}/user/getprofileuser`,{
         method:"GET",
       headers:{
         "Content-Type":"application/json",
          "authorization":localStorage.getItem("token")
       },
  
      });
      const data=await result.json();
   
      
      if(data.success){
         setmySelf({
            _id:data.user._id,
            name:data.user.name,
            username:data.user.username,
            profile_photo:data.user.profile_photo,
            followers:data.user.followers,
            following:data.user.following
         });
      
      }
   },[]);
   useEffect( ()=>{
     getMyself();
      
   },[]);
  

   const getPosts=useCallback(async ()=>{
     const postId=params.id;
      const result=await fetch(`${url}/post/getparticularpost`,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded",
          "authorization":localStorage.getItem("token")
        },
        body:new URLSearchParams({postId})

      });
      const data=await result.json();
      if(data.success)
      {
        setPost(data.post);
        
      }
    else{
            toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
    })
    }
    },[post]);
    
  


   const checkLiked=useCallback(async (postId)=>{
    const result=await fetch(`${url}/like/isLike`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      },
      body:new URLSearchParams({postId})
    });
    const data=await result.json();
    
   
    if(data.success) setPostLike((prev)=>({...prev,[postId]:true}));
    else  setPostLike((prev)=>({...prev,[postId]:false}));
  
   },[]);
   const postLiked=async (postId)=>{
    const result=await fetch(`${url}/like/likepost`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem('token')
      },
      body:new URLSearchParams({postId})
    });
    const data=await result.json();
    if(data.success){
       setPostLike((prev)=>({...prev,[postId]:true}));
       if(mySelf._id===userId) return;
             const type="liked";
       
              const notify=await fetch(`${url}/notify/postnotify`,{
               method:"POST",
               headers:{
                 "Content-Type":"application/x-www-form-urlencoded",
                 "authorization":localStorage.getItem("token")
               },
               body:new URLSearchParams({type,userId,urlId:postId,username:mySelf.username})
              });
              const notifyData=await notify.json();
              if(notifyData.success){
               socket.emit("new-notify",notifyData.result);
              }
    }
    else  setPostLike((prev)=>({...prev,[postId]:false}));
    toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
    })
   }
   useEffect(() => {
    
     
       getPosts();
    
 
}, []);

const removeLike=async (postId)=>{
  const result=await fetch(`${url}/like/removelikepost`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token")
    },
    body:new URLSearchParams({postId})
  });
  const data=await result.json();
    if(data.success) setPostLike((prev)=>({...prev,[postId]:!prev[postId]}))
  
}

const getallInteraction=async (type,postId)=>{
  if(type==="Likes"){
    setAllPostInteraction((prev)=>({...prev,[postId]:{type:"Likes"}}))
    const result=await fetch(`${url}/like/getalllikes`,{
      method:"POST",
       headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token")
    },
    body:new URLSearchParams({postId})
    });
    const data=await result.json();
    if(data.success) setAllPostInteraction((prev)=>({...prev,[postId]:{type:prev[postId].type,likedBy:data.allLikes}}));
  }
  else if(type==="Comments"){
   
    setAllPostInteraction((prev)=>({...prev,[postId]:{type:"Comments"}}));
    const result=await fetch(`${url}/comment/getallcomment`,{
      method:"POST",
       headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token")
    },
    body:new URLSearchParams({postId})
    });
   const data=await result.json();

   if(data.success){
    setAllPostInteraction((prev)=>({...prev,[postId]:{type:prev[postId].type,comments:data.comments}}))
   }
  }
  else if(type==="Post Tools"){
    setAllPostInteraction((prev)=>({...prev,[postId]:{type:type}}));
  }
  else if(type==="Share"){
     setAllPostInteraction((prev)=>({...prev,[postId]:{type:type}}));
  }
}
const postcomment=async (postId)=>{
    if(comment[postId].length===0)  return;
    if(uploadComment) return;
    setUploadComment(true);
    const result=await fetch(`${url}/comment/postcomment`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token")
      },
      body:new URLSearchParams({postId,comment:comment[postId]})
    });
  
    const data=await result.json();
   
    if(data.success) {
       setComment((prev)=>({...prev,[postId]:""}));
      commentDivref.current[postId].click();
      if(mySelf._id===userId) return;
      const type="commented";

       const notify=await fetch(`${url}/notify/postnotify`,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded",
          "authorization":localStorage.getItem("token")
        },
        body:new URLSearchParams({type,userId,urlId:postId,username:mySelf.username})
       });
       const notifyData=await notify.json();
       if(notifyData.success){
        socket.emit("new-notify",notifyData.result);
       }
    }
    setUploadComment(false);
}

useEffect(() => {
  post.forEach(p => checkLiked(p._id));
  
}, [post]);
const deleteComment=async (commentId,postId)=>{
  const result=await fetch(`${url}/comment/deletecomment`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token")
    },
    body:new URLSearchParams({commentId})
  });
  const data=await result.json();
  if(data.success){
    commentDivref.current[postId].click();
  }
}
const getTime=(date)=>{
  const customDate=new Date(date);
  let hours=customDate.getHours();
  if(hours>12) hours=hours-12;
  if(hours==0) hours=12;
  let minutes=customDate.getMinutes();
  if(minutes<10) minutes="0"+minutes;
  let meridian="AM";
  if(customDate.getHours()>=12) meridian="PM";
 return `${hours}`+":"+`${minutes}`+" "+`${meridian}`;

}

const setDateInString=(date)=>{
    const todaysDate=new Date();
    const customDate=new Date(date);
    
    if(todaysDate.getDate()===customDate.getDate() && todaysDate.getMonth()+1===customDate.getMonth()+1 && todaysDate.getFullYear()===customDate.getFullYear()){
      return `Today ${getTime(date)}`
    }

     const diffinsec=Math.abs(todaysDate-customDate);
     const diffindays=Math.floor(diffinsec/(1000*60*60*24));
     if(diffindays<=7){ 
    
      if(diffindays<=1) return `Yesterday ${getTime(date)}`
      return `${customDate.toString().substring(0,3)}`;
     }
     else return `${customDate.toString().substring(4,7)} ${customDate.getDate()},${customDate.getFullYear()}`;
  
}

  return (
    <div className='relative  w-screen h-[100vh] flex flex-col overflow-auto scrollbar-hide'>
     
    
  {post.length>0 &&  <div  className='w-full md:w-[60vw] lg:w-[80vw] xl:w-[80vw] 2xl:w-[60vw] flex flex-col justify-center  gap-5 items-center h-full   md:max-h-screen   overflow-auto scrollbar-hide'>
      {
        post.map((ele)=>(
                 
             <div id={ele._id}  className=' flex flex-col lg:flex-row border-2 border-r-0 rounded-2xl ' >
            <div   className='flex flex-col w-[80vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[60vw] border-r-2   rounded-2xl' >
               <div className='flex flex-row justify-between items-center border-b-4 border-b-orange-500'>
               <div className='flex flex-row gap-5  items-center '>   
                 <img src={ele.userId.profile_photo} alt="Failed to Load" className='object-fit w-[50px] h-[50px] rounded' />
                  <div className='flex flex-col sm:flex-row  sm:gap-5 items-start sm:items-center'> <NavLink to={`/${ele.userId.username}`}  >    <h1 className='text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] font-[Arial]'>{ele.userId.username}</h1></NavLink>
                <h4 className='text-sm sm:text-md font-sans '>{setDateInString(ele.createdAt)}</h4>
              </div>
               </div>
                <button className='w-[5vw] h-[5vh] text-black font-bold text-4xl border-none' onClick={()=>{postbarRef.current[ele._id].classList.remove("hidden"); postbarRef.current[ele._id].classList.add("flex","flex-col");getallInteraction("Post Tools",ele._id)}}>⁝</button>
               </div>
               <div className=' w-full max-h-[20vh]  overflow-auto scrollbar-hide'>
                <p className='text-xl sm:text-2xl'>{ele.caption}</p>
                </div>
           
                <div  ref={(el) => {scrollRef.current[ele._id] = el; }}  className='block overflow-auto w-full max-h-[40vh] scrollbar-hide ' >
                {
                  ele.media.map((file)=>(
                    <div className='block relative  h-[40vh] w-[80vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[60vw] '>
                   {
                    file.fileType==="image" ? <img src={file.filePath} alt="Failed to Load" className='w-[80vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[60vw] h-[40vh] object-contain'/> : <video src={file.filePath} alt="Failed to Load" controls   autoPlay muted  playsInline className='w-[80vw] sm:w-[80vw] md:w-[60vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[60vw] h-[40vh] object-contain '/>
                   
                   }
                    {ele.media.length>1 && <div className='absolute flex justify-center font-sans top-2 right-10 w-[15vw] md:w-[10vw] lg:w-[8vw] xl:w-[5vw] bg-transparent backdrop-blur-xl rounded-full text-2xl '>{file.postNo}/{ele.media.length}</div> }
             
          
                    </div>
                  ))
                }


                </div>
              
                <div  className='flex flex-row justify-around w-full  bg-gray-300 rounded-b-xl '>
                 <div className='flex flex-col justify-center items-center '   >{postLike[ele._id] ? <img src="../Images/like.png" className='w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] brightness-95 ' onClick={()=>removeLike(ele._id)}/> : <img src="../Images/unlike.png" className='w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] brightness-95 ' onClick={()=>postLiked(ele._id,ele.userId._id)}/>}
                 <h1 className='text-[0.8rem] lg:text-[1rem] font-sans font-medium cursor-pointer' onClick={()=>{postbarRef.current[ele._id].classList.remove("hidden"); postbarRef.current[ele._id].classList.add('flex','flex-col'); getallInteraction("Likes",ele._id)}}>Likes</h1>
                 </div>
                 <div ref={(el)=>commentDivref.current[ele._id]=el} className='flex flex-col justify-center items-center ' onClick={()=>{postbarRef.current[ele._id].classList.remove("hidden"); postbarRef.current[ele._id].classList.add('flex','flex-col'); getallInteraction("Comments",ele._id)}}><img src="../Images/comment.png" className='w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]'/>
                 <h1 className='text-[0.8rem] lg:text-[1rem] font-sans font-medium cursor-pointer'>Comments</h1>
                 </div>
               <div className='flex flex-col justify-center items-center ' onClick={()=>{postbarRef.current[ele._id].classList.remove("hidden"); postbarRef.current[ele._id].classList.add('flex','flex-col'); getallInteraction("Share",ele._id)}}><img src="../Images/share.png" className='w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]'/>
                 <h1 className='text-[0.8rem] lg:text-[1rem] font-sans font-medium cursor-pointer'>Share</h1>
                 </div>

                </div>

            
              </div>
             <div ref={(el)=>{postbarRef.current[ele._id] = el;}} className='relative  hidden w-[80vw] h-[40vh] lg:h-full sm:w-[80vw] md:w-[60vw] lg:w-[25vw]  border-r-2 bg-white rounded-2xl '>
              <button onClick={()=>{postbarRef.current[ele._id].classList.remove("flex","flex-col"); postbarRef.current[ele._id].classList.add("hidden")}} className='absolute w-[5vw] h-[5vh]  text-2xl top-0 right-5 lg:right-0'>❌</button>
              <div className=' flex flex-col  justify-center items-center border-b-2'><h1 className='text-[1.5rem] lg:text-[1.3rem] xl:text-[1.7rem] font-mono '>{allPostInteraction[ele._id]?.type}</h1></div>
              <div className='flex flex-col w-full max-h-[25vh] lg:min-h-[20vh]  lg:max-h-[50vh] overflow-auto scrollbar-hide'>
            {
 allPostInteraction[ele._id]?.type==="Likes" ?    ( allPostInteraction[ele._id]?.likedBy?.map((likes)=>(
                  <div className='flex flex-row items-center gap-5 border-t-2 border-b-2'>
                     <img src={likes.userId.profile_photo} className='w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] object-fill rounded-2xl  ' alt="Failed to load"/>
                 <NavLink to={`/${likes.userId.username}`}> <h1 className='text-[1rem] sm:text-[1.2rem] lg:text-[1.3rem] font-medium text-blue-500  font-serif'>{likes.userId.username}</h1> </NavLink> 
                  </div>
                ))): allPostInteraction[ele._id]?.type==="Comments" ? ( <>
              {   allPostInteraction[ele._id]?.comments?.map((comment)=>(
                  <div className='flex flex-row items-center justify-start border-b-2 border-t-2 gap-2 w-full '>
                  <div className='flex justify-center'>
                  <img src={comment.userId.profile_photo} className='w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] rouded-full  object-fit'/>
                  </div>
                  <div className='flex flex-col w-[50vw] sm:w-[40vw] md:w-[30vw] lg:w-[15vw]'>
              <div className='flex flex-col sm:flex-row sm:gap-2 sm:items-center sm:justify-start lg:flex-col lg:items-start lg:gap-0   2xl:flex-row 2xl:gap-2 justify-center 2xl:items-center mb-2'><NavLink to={`/${comment.userId.username}`}> <h1 className='text-[0.8rem] sm:text-lg font-serif text-blue-500'>{comment.userId.username}</h1> </NavLink> <h1 className='text-[0.5rem] sm:text-sm font-serif'>{setDateInString(comment.createdAt)}</h1></div>  
                  <p className='text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] font-serif'>{comment.comment}</p>
                  </div>
                 {mySelf.username===comment.userId.username ? <div className='flex justify-center ml-10 '>
                  <button className="border-none" onClick={()=>{deleteComment(comment._id,ele._id)}}><img src={"../Images/delete.png"} className='w-[30px] h-[30px]'/></button>
                  </div>:<div className='w-[30px] h-[30px]'></div>}
                  </div>
                 ))
                }  
               {  <div className='flex flex-row gap-3 items-center absolute bottom-2 bg-white '><textarea placeholder='Write Comment...' className='w-[60vw] sm:w-[50vw] md:w-[40vw] lg:w-[15vw] xl:w-[20vw] 2xl:w-[15vw] h-[6vh] border-2 rounded-2xl outline-none overflow-auto text-xl font-sans' onChange={(e)=>{setComment((prev)=>({...prev,[ele._id]:e.target.value}))}} value={comment[ele._id]}/>
                {comment[ele._id]?.length>0 && <button className={`flex justify-center items-center w-[10vw] h-[8vh] lg:w-[4vw] lg:h-[5vh] ${!uploadComment ? "bg-gray-800" : "bg-orange-200"} text-green-400 rounded-2xl text-2xl font-bold `} onClick={()=>{postcomment(ele._id,ele.userId._id)}}>{!uploadComment? <span>↑</span>
                :  <span className="w-full flex justify-center items-center"><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
              }</button>}
                </div>}</>) :
               <div className='flex flex-col  h-[30vh] w-full justify-center items-center'>
                  <div className='flex flex-row gap-2'>
                    <FacebookShareButton url={`https://socialsphere-tga0.onrender.com/post/${ele._id}`}>
                      <FacebookIcon className='w-[50px] h-[50px] rounded'/>
                    </FacebookShareButton>
                    <WhatsappShareButton  url={`https://socialsphere-tga0.onrender.com/post/${ele._id}`}>
                      <WhatsappIcon className='w-[50px] h-[50px] rounded'/>
                    </WhatsappShareButton>
                    <TwitterShareButton  url={`https://socialsphere-tga0.onrender.com/post/${ele._id}`} >
                      <TwitterIcon className='w-[50px] h-[50px] rounded'/>
                    </TwitterShareButton>
                    <TelegramShareButton  url={`https://socialsphere-tga0.onrender.com/post/${ele._id}`}>
                      <TelegramIcon className='w-[50px] h-[50px] rounded'/>
                    </TelegramShareButton>
                  </div>
                </div>
}
    </div></div></div>))
          }     </div>}
  {post.length===0 &&  <div className='flex flex-col justify-center items-center h-[50vh]'>
      <img src="./Images/info.png" className='w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-2xl '/>
      <h1 className='text-[1.2rem] sm:text-[1.5rem] font-serif font-bold text-red-400'>No posts to display </h1>
    </div>}
  

    </div>
  )
}

export default Post