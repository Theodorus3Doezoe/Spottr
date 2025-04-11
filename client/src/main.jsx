import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
import ProtectedRoute from './utils/ProtectedRoutes'
//css
import './main.css'

//Pages
import Feed from './pages/Feed'
import Matching from './pages/Matching'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from "./pages/ProfileSetup";
import Update_password from './pages/Update_password'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

const router  = createBrowserRouter([
  {
    path: 'login',
    element: <Login/>,
  },
  {
    path: 'register',
    element: <Register/>,
  },

  {
    element: <ProtectedRoute/>,
      children: [
        {
          path: '/',
          element: <Feed/>,
        },
        {
          path: 'matching',
          element: <Matching/>,
        },
        {
          path: 'messages',
          element: <Messages/>,
        },
        {
          path: 'settings',
          element: <Settings/>,
        },
        {
          path: 'updatepassword',
          element: <Update_password/>
        },
        {
          path: 'profile',
          element: <Profile/>,
        },
        {
          path: 'setup',
          element: <ProfileSetup/>,
        },
      ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <Toaster position='top-center' toastOptions={{duration: 2000}}/>
      <RouterProvider router={router}/>
    </UserContextProvider>
  </StrictMode>,
)

