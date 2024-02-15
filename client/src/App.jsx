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
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import PageFooter from './components/PageFooter';
import PrivateRoute from './components/PrivateRoute';

const Layout = () => {

  return(
    <>
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
        path:"/post/:id",
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
        path:"/blog",
        element:<Blog/>
      },
      {
        path:"/about",
        element:<About/>
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
