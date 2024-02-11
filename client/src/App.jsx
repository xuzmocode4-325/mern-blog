import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Post from './pages/Post';
import Blog from './pages/Blog';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = () => {

  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Layout/></div>,
    children: [
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/post/:id",
        element:<Post/>
      },
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/blog",
        element:<Blog/>
      }
    ]
  },
  {
    path:"/signup",
    element: <div className="page"><SignUp/></div>
  },
  {
    path:"/signin",
    element: <div className="page"><SignIn/></div>
  }
])

const App = () => {

  return (
    <div className="app">
      <div className="window">
        <RouterProvider router={router}/>
      </div>
  </div>
  )
}

export default App
