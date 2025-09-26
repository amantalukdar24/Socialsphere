import React from 'react'

function Contact() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-[100vh]'>
          <div className='flex flex-col w-[90vw] sm:w-[80vw] md:w-[60vw] bg-gray-800 rounded-2xl shadow-xl shadow-black'>
        <div className='flex flex-row justify-center border-b-2 border-b-stone-100 p-4'>
          <h1 className='text-[1.8rem] font-[Roboto] text-[cadetblue] tracking-[4px]'>Contact</h1>
        </div>
         <div className='flex flex-col gap-10 w-full  overflow-auto scrollbar-hide p-6'>
            <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50  '>📧 Email Us</h2>
          <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>For general inquiries, technical support, or feedback:<span className='text-[beige]'> amantalukdar24@gmail.com</span></p>
         </div>
         <div className='flex flex-col '>
          <h2 className='text-[1.4rem] font-mono text-blue-50 '>📩 Feedback</h2>
          <p className='text-[1.1rem] font-sans text-[cornflowerblue]'>Your feedback helps us improve! Share your thoughts through our in-app feedback form or email us directly.</p>
         </div>
         </div>
    </div>
    </div>
  )
}

export default Contact