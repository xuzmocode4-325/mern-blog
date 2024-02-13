import { useState } from 'react'
import { Button, Spinner } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import { app } from '../firebase';

const Oauth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch()
    const [loading, setLoading]  = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const handleGoogleClick = async () => {
        setLoading(true)
        setErrorMessage(null)
        const provider = new GoogleAuthProvider();
            provider.setCustomParameters({prompt:'select_account'})
        try {
            const googleUserResults = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'Post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: googleUserResults.user.displayName,
                    email: googleUserResults.user.email,
                    avatar: googleUserResults.user.photoURL
                })
            });
            const data = await res.join()
            if (res.ok){
                setLoading(false)
                dispatch(signInSuccess(data))
            }
        } catch(error) {
            setErrorMessage(error.message)
            setLoading(false);
        }
    }
  return (
    <Button type="button" gradientDuoTone='pinkToOrange' 
        outline onClick={handleGoogleClick}>
        {
            loading ? (
            <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
            </>
            ) : 
            <>
                <AiFillGoogleCircle className='w-6 h-6 mr-3'/>
                Continue With Google 
            </> 
        }
    </Button>
  )
}

export default Oauth;