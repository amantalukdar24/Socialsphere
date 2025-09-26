import React from 'react'

function Privacy() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-[100vh]'>
      <div className='flex flex-col w-[90vw] sm:w-[80vw] md:w-[60vw] bg-gray-800 rounded-2xl shadow-xl shadow-black'>
        <div className='flex flex-row justify-center border-b-2 border-b-stone-100 p-4'>
          <h1 className='text-[1.8rem] font-[Roboto] text-[cadetblue] tracking-[4px]'>Privacy Policy</h1>
        </div>
        <div className='flex flex-col gap-10 w-full h-[60vh] overflow-auto scrollbar-hide p-6'>
          <div className='flex flex-col'>
            <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>
              At SocialSphere, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.
            </p>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Information We Collect</h2>
            <ul className='text-[1.1rem] list-disc font-sans text-[cornflowerblue] flex flex-col pl-5 w-full'>
              <li>Personal Information: Name, email address, profile picture, and any information you provide during registration or while updating your profile.</li>
              <li>Usage Data: Information about your interactions within the app, such as posts you create, likes, comments, and friends added.</li>
              <li>Media Uploads: Photos, videos, or any content you share on SocialSphere.</li>
            </ul>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>How We Use Your Information</h2>
            <ul className='text-[1.1rem] list-disc font-sans text-[cornflowerblue] flex flex-col pl-5 w-full'>
              <li>To create and manage your account.</li>
              <li>To enable core features like posting, commenting, and messaging.</li>
              <li>To improve app performance and user experience.</li>
            </ul>
          </div>
           <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 underline underline-offset-4 decoration-[tomato]'>Changes to This Policy</h2>
          <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>We may update this Privacy Policy from time to time. You will be notified of any significant changes through in-app notifications or email.</p>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
