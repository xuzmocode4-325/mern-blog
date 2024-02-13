import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import Oauth from '../components/Oauth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return dispatch(signInFailure('Please ensure all fields are filled.'))
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
        dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className='max-h-screen mt-20'>
      <div className="flex p-5 max-w-3xl mx-auto
        flex-col md:flex-row gap-5 md:items-center ">
          {/* left */}
          <div className='flex-1 md:mt-20'>
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
          <div className='flex-1 md:mt-20'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className="">
                <Label value='Username' htmlFor='username'/>
                <TextInput type='text' autoComplete='username'
                placeholder='Username' id='username' onChange={handleChange}/>
                <Label value='Password' htmlFor='password'/>
                <TextInput type='password' autoComplete='current-password' 
                  placeholder='Password' id='password' onChange={handleChange}/>
              </div>
              <Button gradientDuoTone='redToYellow' type='submit'>
                {
                  loading ? (
                    <>
                      <Spinner size='sm'/>
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) : 'Sign In'
                }
              </Button>
              <Oauth/>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Don't have an account?</span>
              <Link to='/sign-up' className='text-blue-600' disabled={loading}>
                Sign Up
              </Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5 text-center font-semibold' color='failure'>
                  {errorMessage}
                </Alert>
              )
            }
        </div>
      </div>
    </div>
  )
}

export default SignIn