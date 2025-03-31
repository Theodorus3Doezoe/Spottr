import React from 'react'
import { Link } from 'react-router-dom'
import './profile_card.css'

export default function Profile_card() {
  return (
    <>
    <Link to={'/'}>
      <button className='back_btn'><img src="src\assets\arrow_left.png" alt="" /></button>
    </Link>

    <Link to={''}>
      <button className="settings_btn">
        <img src="src/assets/profile_card/panel.png" alt="" />
      </button>
    </Link>
    <div className="profile_card_container">
      <div className='profile_card'>
        <div className="profile_card_image_container">
          <img src="src/assets/placeholder.jpg" alt="" className='profile_card_image'/>
          <h1 className="profile_card_name_age">Sven, 21</h1>
          <div className="summary_container">
            <div className="tags_container">
              <div className="looking_container">
                <img src="src/assets/profile_card/magnifying_glass.png" alt="" />
                <p>Looking for friends</p>
              </div>
              <div className="location_container">
                <img src="src/assets/gps.png" alt="" />
                <p>Within 10km</p>
              </div>
            </div>
            <div className="label_container">
              <div className="label_1 labels">Boxing</div>
              <div className="label_2 labels">Fitness</div>
            </div>
          </div>
        </div>
        <div className="profile_card_bio_container">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero aliquid sit facere asperiores animi consequatur perspiciatis.</p>
            <div className="bio_tags_container">
              <div className="bio_tag_1">
                <img src="src/assets/profile_card/meal.png" alt="" />
                <p className='bio_tag_text'>
                  Favorite meal: Pizza
                </p>
              </div>
              <div className="bio_tag_2">
                <img src="src/assets/profile_card/medal.png" alt="" />
                <p>
                  Fitness level: Advanced
                </p>
              </div>
              <div className="bio_tag_3">
                <img src="src/assets/profile_card/clock.png" alt="" />
                <p>
                  preffered workout time: 16:00 - 18:00
                </p>
              </div>
              <p className="bio_more_info">More info</p>
            </div>
            <div className="reject_match_btns">
              <button>
                <img src="src/assets/profile_card/reject.png" alt="" />
              </button>
              <button>
                <img src="src/assets/profile_card/love.png" alt="" />
              </button>
            </div>
        </div>
      </div>
    </div>
    </>
  )
}
