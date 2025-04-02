import React from 'react'
import Header from '../components/header/Header'
import Post from '../components/post/Post'
import Nav from '../components/nav/Nav'

import '../css/feed.css'

export default function Feed() {

  return (
    <div className='feed_container'>
        <Header/>
        <Post/>
        <Nav/>
    </div>
  )
}
