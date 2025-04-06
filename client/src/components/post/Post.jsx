import React, { useState } from 'react'
import './post.css'

const mapImageUrl = 'https://placehold.co/600x400/a3c4f3/ffffff?text=Kaart+Afbeelding(https://placehold.co/600x400/a3c4f3/ffffff?text=Kaart+Afbeelding'; // Lichtblauw
const statsImageUrl = 'https://placehold.co/600x400/f3a3a3/ffffff?text=Stats+Afbeelding(https://placehold.co/600x400/f3a3a3/ffffff?text=Stats+Afbeelding)'; // Lichtrood
const errorImageUrl = 'https://placehold.co/600x400/cccccc/ffffff?text=Error+Loading+Image(https://www.google.com/search?q=https://placehold.co/600x400/cccccc/ffffff%3Ftext%3DError%2BLoading%2BImage'; // Grijze fallback



export default function Post() {



  const [activeView, setActiveView] = useState('map'); // Start met 'map'

  const handleImageError = (e) => {
    // Voorkom een oneindige loop als de fallback ook niet laadt
    if (e.target.src !== errorImageUrl) {
       console.error("Error loading image:", e.target.src); // Log de fout
       e.target.onerror = null; // Verwijder de onerror handler om loops te voorkomen
       e.target.src = errorImageUrl; // Stel de fallback URL in
    }
  };

  return (
    <div className='post_container'>
      <div className="user_info">
        <div className="text-content">
            <img src="" alt="" srcset="" />
            <div className="name">Sven</div>
            <div className="date-time">25 March, 2025 at 14:39</div>
        </div>
        <div className="activity-tag">Running</div>
      </div>
      <div className="desccription_container">
        <h1>Running</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      </div>
      <div className="workout_info">
        <div className="stat_1">
            <img src="src/assets/post/clock.png" alt="" />
            <p>Time </p>
            <p>55m 23s</p>
        </div>
        <div className="stat_2">
            <img src="src/assets/post/ecg-lines.png" alt="" />
            <p>BPM </p>
            <p>168 </p>
        </div>
        <div className="stat_3">
            <img src="src/assets/post/flash.png" alt="" />
            <p>KCAL </p>
            <p>324</p>
        </div>
      </div>
      <div className="mapContainer">
        <div className="map_stats_btn">
          <button
            className={`tab-button ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => setActiveView('map')}
            >
            Map
          </button>
          <button
            className={`tab-button ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
            >
            Stats
          </button>
        </div>

        <div className={`image-container show-${activeView}`}>
          {/* Afbeelding voor de kaart */}
          <img
            src={mapImageUrl}
            alt="Kaart weergave"
            className="content-image map-image"
            onError={handleImageError} // Gebruik de error handler
          />
          {/* Afbeelding voor de statistieken */}
          <img
            src={statsImageUrl}
            alt="Statistieken weergave"
            className="content-image stats-image"
            onError={handleImageError} // Gebruik de error handler
          />
          
        </div>
        <div className="location_container">
          <img src="src/assets/gps.png" alt="" />
          <p>Fonty's ict campus</p>
        </div>
      </div>
      <div className="like_comment_container">
        <img src="src/assets/post/like.png" alt="" />
        <img src="src/assets/post/comment.png" alt="" />
      </div>
    </div>
  )
}
