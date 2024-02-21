import { Alert, Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import { FaFrown } from 'react-icons/fa';

const Post = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [updateAlert, setUpdateAlert] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [post, setPost] = useState(null); 
  const { slug } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/search?slug=${slug}`) 
        const data = await res.json(); 
        setPost(data); 
        if (!res.ok) {
          setUpdateAlert({message: data.message, type:"failure"});
          setLoading(false);
          return
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setUpdateAlert({message: error, type:"failure"});
        setLoading(false)
      }
    };
    fetchPost();
  }, [slug]); 

  const formatDateCreated = (date) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }; 
    
    const formattedDate =  new Date(date).toLocaleDateString('en-Us', options)
    return formattedDate
  }

  const calculateReadability = (content) =>  {
    const wordCount = content ? content.split(' ').length : 0 
    const minsRead = (wordCount / 250).toFixed(0) 
    return minsRead > 1 ? `${minsRead} min read` : "< 1 min read" 
  }

  const handlePublish = async (e) => {
    e.preventDefault();
    setUpdateAlert(null)
    const newStatus = !post.published 
    const updatedStatusPost = {...post, published:newStatus}
    if (slug === post.slug) {
      try {
        const res = await fetch(`/api/post/update/${post._id}/${currentUser._id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(updatedStatusPost), 
        });
        const data = await res.json();
        if (!res.ok) {
            setUpdateAlert({message: data.message, type: "failure"});
            return; 
        } 
        if (res.ok) {
          const currentMessage = newStatus ? "Post Successfully Published" :  "Post Reverted To Draft"
          setUpdateAlert({message:currentMessage, type: "success"});
          setPost(data)
        }
      } catch (error) {
          setUpdateAlert({message:"Something Went Wrong", type: "failure"});
          console.log(error);
      }
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'> 
        <Spinner size='xl'/>
      </div>
    ) 
    
  }

  if (post) {
    return (
      <>
        <main className='p-5 flex flex-col max-w-6-xl mx-auto min-h-screen'>
          <h1 className='text-3xl mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
          </h1>
          {
            (currentUser && currentUser.administrator) && (
            <Alert  className='m-1 mx-auto w-24 flex ' color={
              !post.published ? "warning" : "success"
              }>
              <p className='align-center'>{post.published ? "Published" : "Draft Post"}</p>
            </Alert>)
          }
          <Link to={`/search?category=${post && post.category}`}
          className='self-center mt-5'>
            <Button color='teal' className='bg-transparent' outline pill size='xs' >
              <p className='text-teal'>{post && post.category}</p>
            </Button>
          </Link>
          <img src={post && post.image} alt={post && post.title} 
          className='post-image mt-5 max-h-[600px] w-full object-cover'/>
          <div className='p-5 mx-auto w-full flex text-xs
            justify-between max-w-xl sm:max-w-2xl border-b border-slate-300 mb-1'>
            <span>{post && formatDateCreated(post.createdAt)}</span>
            <span className='italic'>{post && calculateReadability(post.content)}</span>
          </div>
          <div className='p-5 max-w-3xl mx-auto w-full post-content'dangerouslySetInnerHTML={{__html: post && post.content}}>
          </div>
          <div className='max-w-4xl mx-auto w-full'>
            <CallToAction/>
          </div>
          <CommentSection postId={post._id}/>
        </main>
      {
        <div className='flex flex-col w-full'>
          <Button className='m-5 self-center w-40' type='submit' gradientDuoTone='tealToLime'
            onClick={handlePublish}>
            {
              post.published ? "Revert To Draft" : "Publish"
            }
          </Button>
          
        </div>
      }
    </>
    )
  } else {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen text-center'>
        <FaFrown className='h-14 w-14 text-green-400 mb-4 mx-auto'/> 
        <p className='text-gray-500 text-xl'>Oops! Something Went Wrong.</p>
        <p className='text-gray-500'>Please Refresh The Page.</p>
      </div>
    )
  }
  
}

export default Post;