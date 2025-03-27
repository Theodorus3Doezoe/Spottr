import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//components
import Header from './components/header'
import ProfileCard  from './components/profile_card'
import Interact from './components/interact'
import Nav from './components/navbar'
import Feed from './components/feed'
import Message from './components/message'
import Matches from './components/matches'

//pages
import Register from './pages/Register'
import Login from './pages/Login'
import Messaging from './pages/Messaging'

//css
import './main.css'
import './style/matches.css'
import './style/messaging.css'

const router = createBrowserRouter([
  {path: "/", element: <>
    <Header/>
    <Feed/>
    <Nav/>
  </>},
  {path: "/matching", element: <>
    <div id="matchingContainer">
      <Header/>
      <ProfileCard/>
      <Interact/>
    </div>
  </>},
  {path: "/messages", element: <>
    <Header/>
    <Matches/>
    <Message/>
    <Nav/>
  </>},
  {path: "/messaging", element: <>
    <Header/>
    <Messaging/>
  </>},
  {path: "/user", element: <>
    <Header/>
    <Nav/>
  </>},
  {path: "/register", element: <>
    {/* <Header/> */}
    <Register/>
    {/* <Nav/> */}
  </>},
    {path: "/login", element: <>
      <Header/>
      <Login/>
      <Nav/>
    </>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
