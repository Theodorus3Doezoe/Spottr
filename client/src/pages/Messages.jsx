import React from 'react'
import Header from '../components/header/Header'
import Match_circle from '../components/match_circle/Match_circle'
import Match_message from '../components/match_message/Match_message'
import Nav from '../components/nav/Nav'
import '../css/messages.css'

export default function Messages() {
  return (
    <div className='messaging_container'>
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
    </div>
  )
}
