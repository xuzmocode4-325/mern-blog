import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import {React,  useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading]  = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please ensure all fields are filled.')
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message);
      }
      setLoading(false)
      if(res.ok){
        navigate('/sign-in')
      }
    } catch (error) {
       setErrorMessage(error.message)
       setLoading(false);
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
                <Label value='Username'/>
                <TextInput type='text' autoComplete='username'
                placeholder='Username' id='username' onChange={handleChange}/>
                <Label value='Email'/>
                <TextInput type='email'autoComplete='email' 
                  placeholder='Email' id='email' onChange={handleChange}/>
                <Label value='Password'/>
                <TextInput type='password' autoComplete='password' 
                  placeholder='Password' id='password' onChange={handleChange}/>
              </div>
              <Button gradientDuoTone='redToYellow' type='submit'>
              {
                  loading ? (
                    <>
                      <Spinner size='sm'/>
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) : 'Sign Up'
                }
              </Button>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to='/sign-in' className='text-blue-600' disabled={loading}>
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
        </div>
      </div>
    </div>
  )
}

export default SignUp