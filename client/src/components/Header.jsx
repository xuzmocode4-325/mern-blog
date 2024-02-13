import { Navbar, TextInput, Button, Dropdown, Avatar } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
  return (
    <Navbar className="border-b-2">
      <Link to="/" className='self-center whitespace-nowrap 
        text-sm sm:text-xl font-semibold dark:text-ivory'>
        Wellness 
          <span className='px-2 py-1 bg-gradient-to-r
             from-yellow-200 via-red-300
             to-orange-300 rounded-md text-off-white dark:text-zinc-900'>
            Hub
          </span>
      </Link>  
      <form action="">
        <TextInput type="text" placeholder='search..'
          rightIcon={AiOutlineSearch} className='hidden lg:inline'>
        </TextInput>
      </form>
      <Button className="w-10 h-10 lg:hidden" color="gray">
        <AiOutlineSearch/>
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-10 hidden sm:inline' 
          color='gray' onClick={() => dispatch(toggleTheme())}>
            {
              theme === 'dark' ? <FaSun/> : <FaMoon/>
            }
        </Button>
        { currentUser ? (
          <Dropdown  arrowIcon={false}
          inline label={<Avatar alt='user avatar'
          img={currentUser.avatar} rounded/>}>
            <Dropdown.Header>
              <span className='block text-sm'>
                @{currentUser.username}
              </span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item>Log Out</Dropdown.Item>
          </Dropdown>
          ) : 
          ( 
            <Link to='/sign-in' >
              <Button className='text-sm sm:text-xl'
                gradientDuoTone="redToYellow" outline>
                Sign In
              </Button>
            </Link>
          )
        }
       
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
           <Navbar.Link active={path === "/"} as={'div'}>
              <Link to="/">Home</Link>
           </Navbar.Link>
           <Navbar.Link active={path === "/about"} as={'div'}>
              <Link to="/about">About</Link>
           </Navbar.Link>
           <Navbar.Link active={path === "/blog"} as={'div'}>
              <Link to="/blog">Blog</Link>
           </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;