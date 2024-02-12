import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto
        flex-col md:flex-row gap-5 md:items-center">
        {/* left */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            Wellness 
              <span className='px-2 py-1 bg-gradient-to-r
                from-yellow-200 via-red-300
                to-orange-300 rounded-md text-white'>
                Hub
              </span>
          </Link>  
          <div className="text-sm mt-5">
            <p>
            Cillum amet qui incididunt laboris commodo officia reprehenderit ipsum adipisicing tempor veniam.
            </p>
          </div>
        </div>  
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'action="">
            <div className="">
              <Label value='Username'/>
              <TextInput type='text' placeholder='Username' id='username'/>
              <Label value='Email'/>
              <TextInput type='text' placeholder='Email' id='email'/>
              <Label value='Password'/>
              <TextInput type='text' placeholder='Password' id='password'/>
            </div>
            <Button gradientDuoTone='redToYellow' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-600'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp