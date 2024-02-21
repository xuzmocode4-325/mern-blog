import { Footer } from 'flowbite-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { BsPinterest, BsReddit, BsThreads, BsTiktok, BsXCircleFill, } from 'react-icons/bs';


const PageFooter = () =>  {
  return (
    <Footer container className='border rounded-sm border-t-8 border-green-300 w-full'>
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center mx-auto m-3">
              <Link to="/" className='self-center whitespace-nowrap 
                text-lg sm:text-xl font-extralight dark:text-ivory mx-auto'>
                Exquisite
                  <span className='px-2 ml-1 font-semibold py-1 bg-gradient-to-br
                  from-purple-400 via-blue-400 to-green-400 
                hover:bg-gradient-to-bl rounded-md text-white dark:text-[rgb(31,41,55)]'>
                    Beats
                  </span>
              </Link> 
          </div>
          <div className="grid w-full sm:flex sm:items-center md:grid-cols-1 ">
            <div className="grid mx-auto grid-cols-1 gap-8 m-2 
              sm:grid-cols-3 sm:gap-6 text-center"  >
                  <div className="">
                    <Footer.Title className='w-40' title="Site Links"></Footer.Title>
                    <Footer.LinkGroup col>
                      <Footer.Link className='w-40' href="/" target='_self' rel="noopener noreferer">
                        Home
                      </Footer.Link>
                      <Footer.Link className='w-40'  href="/about" target='_self' rel="noopener noreferer">
                        About
                      </Footer.Link>
                      <Footer.Link className='w-40'  href="/blog" target='_self' rel="noopener noreferer">
                        Blog
                      </Footer.Link>
                    </Footer.LinkGroup>
                  </div>
                  <div className="">
                    <Footer.Title className='w-40' title="Follow Us"></Footer.Title>
                    <Footer.LinkGroup col>
                      <Footer.Link  className='w-40' href="#" target='_blank' rel="noopener noreferer">
                        Threads
                      </Footer.Link>
                      <Footer.Link  className='w-40' href="#" target='_blank' rel="noopener noreferer">
                        Pinterest
                      </Footer.Link>
                      <Footer.Link  className='w-40'href="#" target='_blank' rel="noopener noreferer">
                        X
                      </Footer.Link>
                      <Footer.Link className='w-40' href="#" target='_blank' rel="noopener noreferer">
                        Tik Tok
                      </Footer.Link>
                      <Footer.Link className='w-40' href="#" target='_blank' rel="noopener noreferer">
                        Reddit
                      </Footer.Link>
                    </Footer.LinkGroup>
                  </div>
                  <div className="">
                    <Footer.Title className='w-40' title="Legal"></Footer.Title>
                    <Footer.LinkGroup col>
                      <Footer.Link className='w-40' href="" target='_blank' rel="noopener noreferer">
                        Privacy Policy
                      </Footer.Link>
                      <Footer.Link className='w-40' href="" target='_blank' rel="noopener noreferer">
                        Terms &amp; Conditions
                      </Footer.Link>
                      <Footer.Link className='w-40' href="" target='_blank' rel="noopener noreferer">
                        Disclaimer
                      </Footer.Link>
                    </Footer.LinkGroup>
                  </div>
              </div>
          </div>
        <Footer.Divider/>
          <div className="w-full sm:flex sm:self-center sm:items-center sm:justify-between">
            <Footer.Copyright className='text-center' href='#' by="Exquisite Beats" year={new Date().getFullYear()}/>
            <div className="flex gap-6 sm:mt-0 mt-4 text-center">
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