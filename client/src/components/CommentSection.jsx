import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom';

const CommentSection = ({postId}) => {
  const {currentUser} = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [alert, setAlert] = useState(null); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 300 || comment.length === 0) {
      return;
    }

    try {
      const res = await fetch('/api/comment/prepend', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({userId:currentUser._id, postId, content: comment}), 
      });

      const data = await res.json();

      if (!res.ok){
        setAlert({message: data.message, type:'failure'})
      }
      if (res.ok) {
        setComment('')
        setAlert(null)
      }
    } catch (error) {
      setAlert({message: error.message, type:'failure'})
    }

   
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? 
        (
          <div className="flex items-center gap-1 my-5 text-gray text-xs">
            <p className="text-semibold">Signed in as:</p>
            <img className='h-6 w-6 object-cover rounded-full' src={currentUser.avatar} alt=""/>
            <Link className='text-green-400 text-sm hover:underline' to={'/dashboard?tab=profile'}>
              @{currentUser.username}
            </Link>
          </div>
        ) : 
        ( 
          <div className="flex flex-row text-sm gap-2">
            <p className="">You must be signed in to comment.</p>
            <Link className='text-blue-600 dark:text-blue-400 hover:underline' to={'/signin'}>
              Sign In
            </Link>
          </div>
        )
      }
      {
        currentUser && (
          <form onSubmit={handleSubmit} className='border border-purple-400 
            rounded-md p-5'>
            <Textarea placeholder='Add a comment...'
              rows='3'
              maxLength='300'
              onChange={(e) => {
                setAlert(null)
                setComment(e.target.value)
              }}/> 
              <div className="flex justify-between items-center mt-3 p-2">
                <p className='text-gray-500 text-xs'>
                  {`${300 - comment.length} characters remaining`}
                </p>
                <Button gradientDuoTone='purpleToBlue' type='submit'>
                  Submit
                </Button>
              </div>
          </form>
        )
      }
      {
        alert && (
          <Alert className='m-3' color={alert.type}>
            {alert.message}
          </Alert>
        )
      }
    </div>
  )
}

export default CommentSection; 
