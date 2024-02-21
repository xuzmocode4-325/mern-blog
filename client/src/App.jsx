import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Home from './pages/Home';
import Post from './pages/Post';
import Blog from './pages/Blog';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PageFooter from './components/PageFooter';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import Search from './pages/Search';
import ScrollToTop from './components/ScrollToTop';

const Layout = () => {

  return(
    <>
      <ScrollToTop/>
      <Header/>
      <Outlet/>
      <PageFooter/>
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
        path:"/blog",
        element:<Blog/>
      },
      {
        path:"/search",
        element:<Search/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/post/:slug",
        element:<Post/>
      },
      {
        element: <PrivateRoute/>,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard/>
          }
        ] 
      },
      {
        element: <AdminPrivateRoute/>,
        children: [
          {
            path: '/create',
            element: <CreatePost/>
          },
          {
            path: '/update/:postId',
            element: <UpdatePost/>
          },
        ]
      },
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
