import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
import ProtectedRoutes from './utils/ProtectedRoutes'
//css
import './app.css'

//Pages
import Feed from './pages/Feed'
import Matching from './pages/Matching'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

export default function App() {

  return (
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

<UserContextProvider>
    <Toaster position='bottom-right' toastOptions={{duration: 2000}}/>
    <Routes>
        <Route path='/' element={<Feed/>}/>
        <Route path='/matching' element={<Matching/>}/>
        <Route path='/messages' element={<Messages/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
    </Routes>
</UserContextProvider>
  )
}
