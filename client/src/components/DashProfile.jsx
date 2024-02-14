import { Button, TextInput } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux';

function DashProfile() {
  const {currentUser} = useSelector(state=> state.user)

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold
            text-2xl'>
            Profile
        </h1>
        <form className='flex flex-col gap-7'>
            <div className='w-32 h-32 self-center cursor-pointer
                shadow-md overflow-hidden rounded-full'>
                <img src={currentUser.avatar} alt='user-avatar'
                className='rounded-full w-full h-full object-cover 
                border-gray-300 border-8'/>
            </div>
            <TextInput type='text' id='username' placeholder='username' 
                defaultValue={currentUser.username}>
            </TextInput>
            <TextInput type='email' id='email' placeholder='email' 
                defaultValue={currentUser.email}>
            </TextInput>
            <TextInput type='text' id='password' placeholder='password'>
            </TextInput>
            <Button type='submit' gradientDuoTone='greenToBlue' outline>
                Update
            </Button>
        </form>
        <div className='text-red-700 flex justify-between mt-6'>
            <span className='cursor-pointer p-1'>Delete Account</span>
            <span className='cursor-pointer p-1'>Log Out</span>
        </div>
      
    </div>
  )
}

export default DashProfile;