import React from 'react'
import {useState,useCallback,useRef} from "react"
import {toast} from "react-toastify"
function Create() {
  const url="https://socialsphere-backend-dih0.onrender.com";
   const [caption,setCaption]=useState("");
   const [uploading,setUploading]=useState(false);
   const [media,setMedia]=useState([]);
   const uploadRef=useRef(null);
   const handleChange=useCallback((e)=>{
    const selected=Array.from(e.target.files);
    setMedia((prev)=>[...prev,...selected]);
    
   },[media]);
     const handleRemove = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit=async (e)=>{
        e.preventDefault();
        if(uploading) return;
        setUploading(true);
   if(!caption.length && !media.length) {
    setUploading(false);
    toast.info("Atleast Caption or 1 photos/videos should be upload",{
      position:"top-center",
      autoClose:5000,
      theme:"dark"
    });
    return
   }
   media.forEach((file)=>{
    if(file.size>100*1024*1024){
      setUploading(false);
      toast.error(`${file.name}+ Files more than 100MB cannot be uploaded`,{
         position:"top-center",
      autoClose:5000,
      theme:"dark"
      })
    }
   });
   
   const checktext=await fetch(`${url}/post/checktext`,{
    method:"POST",
      headers:{
           "Content-Type":"application/x-www-form-urlencoded",
          "authorization":localStorage.getItem("token"),
        },
      body:new URLSearchParams({caption})
   });
   const checkdata=await checktext.json();
   if(!checkdata.success){
    setUploading(false);
    toast.error(checkdata.mssg,{
      position:"top-center",
      autoClose:5000,
      theme:"dark"
    });
    return;
   }

    const formData=new FormData();
   formData.append("caption",caption);
   media.forEach((file)=>formData.append("media",file));
   
   const result= await fetch(`${url}/post/upload`,{
        method:"POST",
        headers:{
          "authorization":localStorage.getItem("token"),
        },
        body:formData
  });
  
  const data=await result.json();
  if(data.success)
  {
      toast.success(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
      setMedia([]);
      setCaption("");
  }
  else{
        toast.error(data.mssg,{
        position:"top-center",
        autoClose:5000,
        theme:"dark"
      });
  }
  setUploading(false);
  };
  
 

  return (
    <div className='flex flex-col pt-20 md:pt-0 md:justify-center items-center w-screen h-screen overflow-auto '>

    <div className='flex flex-col w-[90vw] sm:w-[80vw] md:w-[50vw]    border-2 rounded-2xl'>
    <div className='flex justify-center items-center border-b bg-green-500 rounded-t-2xl  '><h1 className='font-extrabold font-serif text-3xl sm:text-4xl md:text-5xl text-gray-700'>Create Post</h1></div>
    <div className='flex justify-center items-center  content-center border-b-2 ' >
      <textarea placeholder='Share Your thoughts............' value={caption} onChange={(e)=>setCaption(e.target.value)} className='w-full h-[10vh] md:h-[10vh] outline-none text-lg sm:text-xl md:text-2xl rounded placeholder-amber-700 overflow-auto'></textarea>
    </div>
    
    <div className='flex flex-col items-center gap-5 '>
     <label for="media" className=' text-lg sm:text-xl md:text-2xl text-violet-500 font-medium'>Upload Photos/Videos</label>
     <input ref={uploadRef} type="file" multiple accept="image/*,video/*" onChange={handleChange} className='w-[70vw] hidden sm:w-[40vw] md:w-[20vw] h-[4vh] md:h-[5vh] outline-none rounded-md bg-yellow-500 text-xl font-bold italic'/>
     <button className='flex flex-row gap-5 w-[40vw] sm:w-[30vw] md:w-[25vw] lg:w-[15vw] xl:w-[15vw] xl:h-[5vh] text-xl sm:text-2xl xl:text-3xl bg-blue-300 justify-center items-center border-2 rounded' onClick={()=>uploadRef.current.click()}>
      <img src="../Images/upload.png" className='w-[30px] h-[30px]'/>
      Upload</button>

    </div>
     
  { media.length ?
           <div className="flex flex-wrap flex-row h-[20vh] sm:h-[25vh] md:h-[40vh]  border-b-2 gap-3 justify-center items-center   overflow-auto">
       {  media.map((file, index) => {
          const isImage = file.type.startsWith('image');
          const isVideo = file.type.startsWith('video');
           const src = URL.createObjectURL(file);
        
          return (
            <div key={index} className="relative w-[250px]  md:w-[300px]  border-4 rounded-2xl mt-5 mb-5">
              {isImage && <img src={src} alt="" className="object-contain w-[250px] h-[100px] md:w-[300px] md:h-[200px] rounded-xl" />}
              {isVideo && (
                <video src={src} controls   className="object-contain w-[250px] h-[100px] md:w-[300px] md:h-[200px]  rounded-xl" />
              )}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-0 right-0 object-cover text-white text-xs px-1 rounded-full"
              >
              <img src="../Images/delete.png" className='w-[50px]'/>
              </button>
            </div>
          );
        })}
      </div> : ""}
      <div className='flex flex-row justify-center h-[10vh] content-center items-center'>
        <button type="submit" onClick={handleSubmit} className={`w-[40vw] sm:w-[20vw] h-[5vh] md:w-[15vw] md:h-[5vh] text-xl sm:text-2xl md:text-3xl font-mono rounded-4xl ${!uploading ? 'bg-blue-500' : 'bg-blue-200' }`}>{!uploading ? <span>POST</span>:
        <span className='w-full flex justify-center items-center'><img src="/Images/spinner.png" className='w-[30px] h-[30px] animate-spin delay-500 ease-in-out'/></span>
        }</button>
      </div>
    </div>



    </div>
  )
}

export default Create