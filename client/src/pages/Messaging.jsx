import React from 'react'
import { Link } from "react-router-dom"

export default function Messaging() {
  return (
    <>
        <div class="message-screen">
            <div class="message-header">
                <div class="match-info">
                    <img src="src/assets/placeholder.webp" alt="Match Profile" class="profile-pic"/>
                    <span class="match-name">Jessica</span>
                </div>
                <Link to={"/messages"}>
                    <button class="back-button">Back</button>
                </Link>
            </div>

            <div class="message-area">
                <div class="message-bubble">
                    <p>Hey there!</p>
                </div>
                <div class="message-bubble">
                    <input type="text" placeholder='prompt' className='prompt-input'/>
                    <p className='line-text'>Generate opening line</p>
                </div>
            </div>

            <div class="message-input-area">
                <input type="text" placeholder="Type your message..." class="message-input"/>

                <button class="send-button">Send</button>
            </div>
        </div>
    </>
  )
}
