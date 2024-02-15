import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [loading, setLoading] = useState(false) 
  const navigate = useNavigate();
  const handleChange = (e) => {
    setErrorMessage(null)
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please ensure all fields are filled.')
    }
    try {
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      
      if(res.ok){
        setLoading(false);
        setSuccessAlert("Sign Up Successful.")
        setTimeout(() => {
          navigate('/signin');
        }, 4000);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message); 
    }
  }

  return (
    <div className='min-h-screen m-auto'>
      <div className="flex p-5 max-w-3xl mx-auto
        flex-col md:flex-row gap-5 md:items-center ">
          {/* left */}
          <div className='flex-1 md:mt-20'>
            <Link to="/" className='font-bold dark:text-white text-4xl'>
              Wellness 
                <span className='px-2 ml-1 py-1 bg-gradient-to-br
                 from-purple-400 via-blue-400 to-green-400 
              hover:bg-gradient-to-bl rounded-md text-white' >
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
                <Label value='Email' htmlFor='email'/>
                <TextInput type='email'autoComplete='email' 
                  placeholder='Email' id='email' onChange={handleChange}/>
                <Label value='Password' htmlFor='password'/>
                <TextInput type='password' autoComplete='new_password' 
                  placeholder='Password' id='password' onChange={handleChange}/>
              </div>
              <Button className='bg-gradient-to-br 
              from-purple-400 via-blue-400 to-green-300 
              hover:bg-gradient-to-bl' type='submit' disabled={loading}>
              {
                  loading ? (
                    <>
                      <Spinner size='sm'/>
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) : 'Sign Up'
                }
              </Button>
              <Oauth/>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to='/signin' className='text-blue-600' disabled={loading}>
                Sign In
              </Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5 text-center font-semibold' color='failure'>
                  {errorMessage}
                </Alert>
              )
            }
            {
              successAlert && (
                <Alert className='mt-5 text-center font-semibold' color='success'>
                  {successAlert}
                </Alert>
              )
            }
        </div>
      </div>
    </div>
  )
}

export default SignUp