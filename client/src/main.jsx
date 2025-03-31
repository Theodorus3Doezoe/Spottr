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

const router = createBrowserRouter([
  {path: "/", element: <div className='feed_container'>
    <Header/>
    <Post/>
    <Nav/>
  </div>},
  
  {path: "/matching", element: <div className='matching_container'>
    <Header/>
    <Profile_card/>
  </div>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
