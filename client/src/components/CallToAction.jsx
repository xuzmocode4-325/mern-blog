import { Button } from 'flowbite-react';
import React from 'react'

const CallToAction = () => {
  return (
    <div className="flex flex-col md:flex-row border border-green-400 justify-between
    items-center rounded-tl-2xl rounded-br-2xl rounded-tr-3xl text-center p-5">
      <div className='flex-1 flex flex-col justify-center'>
        <h2 className='text-3xl mb-3'>
          Study Advanced Beatmaking
        </h2>
        <h4 className='text-xl'>Learn everything from sampling and composition to arrangmenent as well as mixing and mastering.</h4>
        <Button className='mx-auto bg-gradient-to-br from-purple-400
           via-blue-400 to-green-400 text-xl rounded-bl-none mt-5 mb-3'>
           <a href="#" target='_blank' rel='noopener noreferrer'
            className='dark:text-[rgb(31,41,55)] text-lg'>
            99 Beat Projects
          </a> 
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img className='post-image h-auto object-cover w-72 mx-auto' 
          src="https://img.freepik.com/free-vector/dj-action_1045-152.jpg" alt="" />
      </div>
    </div>
  )
}

export default CallToAction;