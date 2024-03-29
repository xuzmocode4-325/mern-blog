import { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmLeft, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';


const DashSidebar = () => {
    const location = useLocation()
    const dispatch= useDispatch()
    const [tab, setTab] = useState("")
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if (tabFromUrl) {
        setTab(tabFromUrl)
      }
    }, [location.search]);

    const handleSignOut = async () => {
      try {
          const res = await fetch('/api/user/signout', {
              method: "POST"
          });
          const data = await res.json(); 
          if (!res.ok) {
              console.log(data.message)
          } else {
              dispatch(signOutSuccess()); 
          }
      } catch (error) {
          console.log(error.message)
      }

  }

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} 
                        label={currentUser.administrator ? 'Admin' : "User"} 
                        labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item> 
                </Link>
                { currentUser.administrator && (
                     <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} 
                            as='div'>
                            Posts
                        </Sidebar.Item> 
                    </Link>
                )}
                  { currentUser.administrator && (
                     <Link to='/dashboard?tab=users'>
                        <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} 
                            as='div'>
                            Users
                        </Sidebar.Item> 
                    </Link>
                )}
                <Sidebar.Item icon={HiArrowSmLeft} onClick={handleSignOut} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>  
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar