import React from 'react'
import { Link } from "react-router-dom"
import '../css_modules/message.css'

export default function Message() {
  return (
    <>
      <Link to={"/messaging"}>
        <button class="comment">
          <div class="avatar"><img src="src\assets\placeholder.webp" alt="" srcset="" /></div> 
          <div class="comment-content">
            <div class="comment-header">
              <span class="username">Lisanne</span>
              <span class="time">1h ago</span>
            </div>
            <p class="comment-text">Lorem ipsum dolor sit amet, consectetur aaaaaaaaaaaaaaaaaaaaa</p>
          </div>
        </button>
      </Link>
    </>
  )
}
