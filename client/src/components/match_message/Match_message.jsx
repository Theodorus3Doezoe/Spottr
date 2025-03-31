import React from 'react'
import './match_message.css'

export default function Match_message() {
  return (
    <div class="profile-card">
        <div class="profile-picture">
        </div>
        <div class="content">
            <div class="top-row">
                <span class="name-age">Lisanne, 20</span>
                <span class="timestamp">Just now</span>
            </div>
            <p class="snippet">
                Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem...
            </p>
            <div class="tags">
                <span class="tag tag-blue">Fitness</span>
                <span class="tag tag-pink">Running</span>
                <span class="tag tag-purple">Yoga</span>
            </div>
        </div>
    </div>
  )
}
