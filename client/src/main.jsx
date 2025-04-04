import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
import ProtectedRoutes from './utils/ProtectedRoutes'
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
import UserProfile from "./pages/info_test";

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

  // <UserContextProvider>
  //   <Toaster position='bottom-right' toastOptions={{duration: 2000}}/>
  //   <Routes>
  //       <Route path='/' element={<ProtectedRoutes><Feed/></ProtectedRoutes>}/>
  //       <Route path='/matching' element={<ProtectedRoutes><Matching/></ProtectedRoutes>}/>
  //       <Route path='/messages' element={<ProtectedRoutes><Messages/></ProtectedRoutes>}/>
  //       <Route path='/settings' element={<ProtectedRoutes><Settings/></ProtectedRoutes>}/>
  //       <Route path='/profile' element={<ProtectedRoutes><Profile/></ProtectedRoutes>}/>
  //       <Route path='/login' element={<Login/>}/>
  //       <Route path='/register' element={<Register/>}/>
  //   </Routes>
  // </UserContextProvider>

const router  = createBrowserRouter([
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
    path: 'profile',
    element: <Profile/>,
  },
  {
    path: 'login',
    element: <Login/>,
  },
  {
    path: 'register',
    element: <Register/>,
  },
  {
    path: 'info',
    element: <UserProfile/>,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <Toaster position='top-center' toastOptions={{duration: 2000}}/>
      <RouterProvider router={router}/>
    </UserContextProvider>
  </StrictMode>,
)

