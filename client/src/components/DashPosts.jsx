import { Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/search?userId=${currentUser._id}`)
        const data = await res.json() 
        if (res.ok) {
          setUserPosts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
         console.log(error.message)
      }
    };
    if (currentUser.administrator) {
      fetchPosts(); 
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(
        `/api/post/search?userId=${currentUser._id}&startIndex=${startIndex}`
      ); 
      const data = await res.json() 
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false)
        }
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatDateCreated = (date) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }; 

    const formattedDate =  new Date(date).toLocaleDateString('en-Us', options)
    return formattedDate
   };
  const formatLastUpdated = (date) => {
    const now = new Date();
    const deltaTime = now - new Date(date);

    // Calculate time differences in milliseconds
    const minute = 60 * 1000; // milliseconds in a minute
    const hour = 60 * minute; // milliseconds in an hour
    const day = 24 * hour; // milliseconds in a day
    const month = 30 * day; // approximate milliseconds in a month

    if (deltaTime < minute * 5) {
        return "a few minutes ago";
    } else if (deltaTime < hour) {
        const minutes = Math.floor(deltaTime / minute);
        return `about ${minutes} minutes ago`;
    } else if (deltaTime < day) {
        const hours = Math.floor(deltaTime / hour);
        return `more than ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (deltaTime < 2 * day) {
        return "more than 1 day ago";
    } else if (deltaTime < month) {
        const days = Math.floor(deltaTime / day);
        return `more than ${days} day${days > 1 ? 's' : ''} ago`;
    } else if (deltaTime < 2 * month) {
        return "more than 1 month ago";
    } else if (deltaTime < year) {
      const months = Math.floor(deltaTime / month);
      return `more than ${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(deltaTime / year);
      return `more than ${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'> 
      {
        currentUser.administrator && userPosts.length > 0  ? 
        (<>
          <Table hoverable className='shadow-sm'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Last Updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>
                  Edit
              </Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
            
            {
              userPosts.map((post) => (
            
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={post._id}>
                  <Table.Cell>{formatDateCreated(post.createdAt)}</Table.Cell>
                  <Table.Cell>{formatLastUpdated(post.updatedAt)}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className='w-20 h-10 rounded-md object-cover bg-grey-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-800 dark:text-off-white'
                      to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>{post.published ? ("Published") : ("Draft")}</Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' 
                      to={`/update/${post._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span className='text-red-500 hover:underline'  >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row> 
            ))} 
              </Table.Body>
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} 
                className='w-full font-semibold text-teal-500 self-center text-sm py-5'>
                Show More
              </button>
            )
          }
        </>
        ) : (<p>No Posts To Display</p>)
      }
    </div>
  )
}

export default DashPosts