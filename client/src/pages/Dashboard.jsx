import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';

const Dashboard = () => {
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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
      {/*sidebar*/}
      <DashSidebar/>
      {/*profile*/}
      </div>
      {tab == 'profile' && <DashProfile/>}
    </div>
  )
}

export default Dashboard; 