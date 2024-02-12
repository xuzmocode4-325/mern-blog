import React from 'react';
import { Navbar, TextInput, Button } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

const Header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link to="/" className='self-center whitespace-nowrap 
        text-sm sm:text-xl font-semibold dark:text-white'>
        Wellness 
          <span className='px-2 py-1 bg-gradient-to-r
             from-yellow-200 via-red-300
             to-orange-300 rounded-md text-white'>
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
          color='gray'>
          <FaMoon/>
        </Button>
        <Link to='/sign-in' >
          <Button className='text-sm sm:text-xl'
            gradientDuoTone="redToYellow" outline>
            Sign In
          </Button>
        </Link>
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