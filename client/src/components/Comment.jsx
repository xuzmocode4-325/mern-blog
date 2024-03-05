import { useEffect, useState } from 'react'
import moment from 'moment'; 

const Comment = ({comment}) => { 
  const id = comment.userId
  const [user, setUser] = useState({})
  console.log(user)
  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch(
                `/api/user/${id}`
            ); 
            const data = await res.json();
            if (res.ok) {
                setUser(data); 
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    getUser(); 
  }, [comment])
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3' >
            <img 
                className='w-9 rounded-full bg-gray-300' 
                src={user.avatar} 
                alt={user.username} 
            />
        </div>
        <div className="flex-1">
            <div className='text-xs flex items-center mb-1'>
                <span className='font-bold mr-1 truncate'>
                    {user ? `@${user.username}` : ("beat ninja")}
                </span>
                <span className='text-gray-500'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className='text-gray-500 mb-2'>{comment.content}</p>
        </div>
    </div>
  )
}

export default Comment