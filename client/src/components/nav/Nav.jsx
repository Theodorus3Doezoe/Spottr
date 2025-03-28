import React from 'react'
import { Link } from 'react-router-dom'
import './nav.css'

export default function Nav() {
  return (
    <div className='nav_container'>
      <Link to={'/'}>
        <button>
          <img src="src/assets/nav/feed.png" alt="" />
        </button>
      </Link>
      <Link to={'/matching'}>
        <button>
          <img src="src/assets/nav/matching.png" alt="" />
        </button>
      </Link>
      <Link to={'/messages'}>
        <button>
          <img src="src/assets/nav/messages.png" alt="" />
        </button>
      </Link>
      <Link to={'/settings'}>
        <button>
          <img src="src/assets/nav/settings.png" alt="" />
        </button>
      </Link>
    </div>
  )
}
