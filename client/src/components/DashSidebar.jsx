import { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmLeft } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';


const DashSidebar = () => {
    const location = useLocation()
    const dispatch= useDispatch()
    const [tab, setTab] = useState("")
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if (tabFromUrl) {
        console.log(tabFromUrl)
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
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} 
                        label={'User'} labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item> 
                </Link>
                <Sidebar.Item icon={HiArrowSmLeft} onClick={handleSignOut} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>  
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar