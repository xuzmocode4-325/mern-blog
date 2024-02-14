import { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmLeft } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

function DashSidebar() {
    const location = useLocation()
    const [tab, setTab] = useState("")
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if (tabFromUrl) {
        console.log(tabFromUrl)
        setTab(tabFromUrl)
      }
    }, [location.search]);
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} 
                        label={'User'} labelColor='dark'>
                        Profile
                    </Sidebar.Item> 
                </Link>
                <Sidebar.Item icon={HiArrowSmLeft}  className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>  
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar