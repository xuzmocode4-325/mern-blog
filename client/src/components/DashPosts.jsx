import { Alert, Button, Modal, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// add infinite scroll 

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState({})

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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `api/post/discard/${toDelete.id}/${currentUser._id}`,
        {method: 'DELETE'}
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) => {
          return prev.filter((post) => post._id !== toDelete.id)
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'> 

      {
        currentUser.administrator && userPosts && userPosts.length > 0  ? 
        (
        <>
          <Table hoverable className='shadow-sm'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Last Updated</Table.HeadCell>
              <Table.HeadCell>Cover Image</Table.HeadCell>
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
              userPosts.map((post, idx) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={idx+1}>
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
                    <span className='text-red-500 font-medium hover:underline'
                      onClick={() => {
                        setShowModal(true)
                        setToDelete({id: post._id, title: post.title})
                      }}  >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row> 
              ))}
              </Table.Body>
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-teal-500 font-semibold self-center py-7'>
                Show More
              </button>
            )
          }
        </>
        ) : (
          <Alert color='warning'>No Posts To Show Yet - Try Refreshing This Page</Alert>
        )
      }
       <Modal 
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-red-700 mb-4 mx-auto'/> 
                    <h3 className='mb-5 text-lg text-gray-800 dark:text-gray-400'>
                        You are about to delete: <br/> 
                        <span className='font-bold'>
                          "{toDelete.title}"
                        </span><br/>
                         Proceed?
                    </h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handleDeletePost}>Yes, Delete This Post</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DashPosts