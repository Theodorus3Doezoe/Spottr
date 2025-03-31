import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

//css
import './main.css'

//Components
import Header from './components/header/Header'
import Nav from './components/nav/Nav'
import Profile_card from './components/profilecard/Profile_card'
import Post from './components/post/Post'
import Match_circle from './components/match_circle/Match_circle'
import Match_message from './components/match_message/Match_message'
import Settings from './pages/settings/Settings'
import Profile from './pages/profile_settings/Profile'
import Auth from './pages/auth/Auth'
import Update_password from './pages/update_password/update_password'

const router = createBrowserRouter([
  {path: "/", element: <div className='feed_container'>
    <Header/>
    <Post/>
    <Nav/>
  </div>},
  
  {path: "/matching", element: 
    <div className='matching_container'>
    <Header/>
    <Profile_card/>
  </div>},

{path: "/messages", element: <div className='messaging_container'>
  <Header/>
  <div className="content_container">
    <div className="matches_container">
        <Match_circle/>
    </div>
    <div className="messages_container">
      <Match_message/>
    </div>
  </div>
  <Nav/>
</div>},

{path: '/settings', element: <>
  <Settings/>
</>},

{path: '/profile', element: <>
  <Profile/>
</>},

{path: '/auth', element: <>
  <Auth/>
</>},

{path: '/update_password', element: <>
  <Update_password/>
</>},


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
