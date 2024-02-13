import { Footer } from 'flowbite-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { BsPinterest, BsReddit, BsThreads, BsTiktok, BsXCircleFill, } from 'react-icons/bs';


const PageFooter = () =>  {
  return (
    <Footer container className='border rounded-sm border-t-8 border-orange-300'>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between  sm:flex md:grid-cols-1">
          <div className="">
            <Link to="/" className='self-center whitespace-nowrap 
              text-lg sm:text-xl font-semibold dark:text-ivory'>
              Wellness 
                <span className='px-2 py-1 bg-gradient-to-r
                  from-yellow-200 via-red-300
                  to-orange-300 rounded-md text-ivory dark:text-zinc-900'>
                  Hub
                </span>
            </Link> 
          </div>
          <div className="grid grid-cols-1 gap-8 mt-4 
          sm:grid-cols-3 sm:gap-6" >
              <div className="">
                <Footer.Title title="Site Links"></Footer.Title>
                <Footer.LinkGroup col>
                  <Footer.Link href="/" target='_self' rel="noopener noreferer">
                    Home
                  </Footer.Link>
                  <Footer.Link href="/about" target='_self' rel="noopener noreferer">
                    About
                  </Footer.Link>
                  <Footer.Link href="/blog" target='_self' rel="noopener noreferer">
                    Blog
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="">
                <Footer.Title title="Follow Us"></Footer.Title>
                <Footer.LinkGroup col>
                  <Footer.Link href="#" target='_blank' rel="noopener noreferer">
                    Threads
                  </Footer.Link>
                  <Footer.Link href="#" target='_blank' rel="noopener noreferer">
                    Pinterest
                  </Footer.Link>
                  <Footer.Link href="#" target='_blank' rel="noopener noreferer">
                    X
                  </Footer.Link>
                  <Footer.Link href="#" target='_blank' rel="noopener noreferer">
                    Tik Tok
                  </Footer.Link>
                  <Footer.Link href="#" target='_blank' rel="noopener noreferer">
                    Reddit
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="">
                <Footer.Title title="Legal"></Footer.Title>
                <Footer.LinkGroup col>
                  <Footer.Link href="" target='_blank' rel="noopener noreferer">
                    Privacy Policy
                  </Footer.Link>
                  <Footer.Link href="" target='_blank' rel="noopener noreferer">
                    Terms &amp; Conditions
                  </Footer.Link>
                  <Footer.Link href="" target='_blank' rel="noopener noreferer">
                    Disclaimer
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
          </div>
        </div>
        <Footer.Divider/>
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href='#' by="WellnessHub" year={new Date().getFullYear()}/>
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsXCircleFill}/>
            <Footer.Icon href="#" icon={BsThreads}/>
            <Footer.Icon href="#" icon={BsPinterest}/>
            <Footer.Icon href="#" icon={BsTiktok}/>
            <Footer.Icon href="#" icon={BsReddit}/>
          </div>
        </div> 
      </div>
    </Footer>
  )
}

export default PageFooter;