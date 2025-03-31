import React from 'react'
import './post.css'

export default function Post() {
  return (
    <div className='post_container'>
      <div className="user_info">
        <div class="text-content">
            <img src="" alt="" srcset="" />
            <div class="name">Sven</div>
            <div class="date-time">25 March, 2025 at 14:39</div>
        </div>
        <div class="activity-tag">Running</div>
      </div>
      <div className="workout_info">
        <h1></h1>
        <p></p>
        <div className="stat_1">
            <img src="" alt="" />
            <p>Time <br /> 55m 23s</p>
        </div>
        <div className="stat_2">
            <img src="" alt="" />
            <p>BPM <br /> 168 </p>
        </div>
        <div className="stat_3">
            <img src="" alt="" />
            <p>KCAL <br /> 324</p>
        </div>
      </div>
    </div>
  )
}
