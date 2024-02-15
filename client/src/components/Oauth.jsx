import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import { app } from '../firebase';



const Oauth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading } = useSelector(state => state.user);
    
    const handleGoogleClick = async () => {
        
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});

        try {
            dispatch(signInStart());
            const googleUserResults = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: googleUserResults.user.displayName,
                    email: googleUserResults.user.email,
                    avatar: googleUserResults.user.photoURL
                }),
            });
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/');
            }
        } catch(error) {
            dispatch(signInFailure(error.message));
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
                <span>Continue With Google </span>
            </> 
        }
    </Button>
  )
}

export default Oauth;