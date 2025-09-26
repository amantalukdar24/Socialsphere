import React from 'react'

function About() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-[100vh]'>
       <div className='flex flex-col w-[90vw] sm:w-[80vw] md:w-[60vw] bg-gray-800 rounded-2xl shadow-xl shadow-black'>
           <div className='flex flex-row justify-center border-b-2 border-b-stone-100 p-4'>
         <h1 className='text-[1.8rem] font-[Roboto] text-[cadetblue] tracking-[4px]'>About</h1>
        </div>
        <div className='flex flex-col gap-10 w-full h-[60vh] overflow-auto scrollbar-hide p-6'>
         <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Introduction</h2>
          <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>SocialSphere is a modern social media platform designed to bring people together. Whether you want to share moments, connect with friends, or explore new ideas, SocialSphere offers an engaging, real-time experience that is simple and fun to use.</p>
         </div>
         <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Our Mission</h2>
          <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>At SocialSphere, our mission is to create a secure, interactive, and user-friendly social platform that helps people connect and build meaningful relationships. We aim to make communication easy, engaging, and enjoyable.</p>
         </div>
            <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Core Features</h2>
         <ul className='text-[1.1rem] list-disc font-sans text-[cornflowerblue] flex flex-col pl-5  w-full '>
             <li>User Profiles: Personalize your profile and showcase your identity.</li>
             <li>Real-Time Chat: Instant messaging powered by modern web technologies.</li>
             <li>Post Feed: Stay updated with the latest posts from friends and communities.</li>
             <li>Media Sharing: Easily share photos, videos etc.</li>
             <li>Likes & Comments: Interact and engage with posts effortlessly.</li>
             <li>Responsive Design: Smooth experience on any device.</li>
         </ul>
         </div>
              <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Why Choose SocialSphere?</h2>
         <ul className='text-[1.1rem] list-disc font-sans text-[cornflowerblue] flex flex-col pl-5  w-full '>
             <li>Simple and intuitive interface</li>
             <li>Real-time updates and chat</li>
             <li>Secure and scalable backend</li>
             <li>Built with the latest technologies</li>
         </ul>
         </div>
        </div>
       </div>
    </div>
  )
}

export default About