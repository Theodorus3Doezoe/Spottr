import {React, useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/nav/Nav';
import '../css/settings.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from "../../context/userContext"



// Settings Screen Component
export default function Settings() {
  const {user} = useContext(UserContext)
  const navigate = useNavigate()
  // State for interactive elements (optional, for demonstration)
  const [maxDistance, setMaxDistance] = useState(50);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(25);
  const [showMePreference, setShowMePreference] = useState('Women'); // State for 'Show me' dropdown
  
  const logoutHandler = () => {
    try {
      axios.post('/logout', null, {withCredentials:true})
      .then(response => {
        if(response.status===200) {
          // window.location.href = '/login'
          navigate('/login')
          toast.success('Log out succesfull')
        }
      })
    } catch (error) {
      toast.error(error)
    }
  }

  if (!user) {
    // Optie 1: Toon een laadindicator
    return <div>Loading profile...</div>;

    // Optie 2: Render niets (of een minimale layout)
    // return null;
  }
    return (
    <div className='settings_wrapper'>
      <div className="settings-container">
        {/* Header */}
        <h1 className="settings-title">Settings</h1>

        {/* Profile Section */}
        <Link to={'/profile'} style={{ textDecoration: 'none', color: 'black' }}> 
          <div className="profile-section">
            <div className="profile-info">
              <div className="profile-pic-placeholder"></div>
              <div>
              <h1>{user.name}, {user.age}</h1>
                {/* <div className="profile-name">{!!user && (<h2>{user.name}, 21</h2>)}</div> */}
                  <div className="profile-edit-link">Edit profile</div>
              </div>
            </div>
            <span className="arrow-icon">&gt;</span>
          </div>
        </Link>

        {/* Account Section */}
        <h2 className="section-title">Account</h2>
        <div className="user_data">
          <p>{user.name}</p>
          <p>{user.surname}</p>
          <p>{user.email}</p>
        </div>
        <Link to={'/update_password'} style={{ textDecoration: 'none', color: 'black' }}>
          <div className="link-group">
            <span>Change password</span>
            <span className="arrow-icon">&gt;</span>
          </div>
        </Link>

        {/* Discovery Section */}
        <h2 className="section-title">Discovery</h2>
        <div className="link-group location-group">
          <div>
              <label>Location</label>
              <div className="current-location">Current location &gt; Tilburg</div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="show-me">Show me</label>
          {/* Actual select dropdown */}
          <select
              id="show-me"
              className="select-field" // Use the same class for styling consistency
              value={showMePreference}
              onChange={(e) => setShowMePreference(e.target.value)}
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            {/* Add other options if needed */}
            {/* <option value="Everyone">Everyone</option> */}
          </select>
        </div>
        <div className="form-group slider-group">
          <label htmlFor="max-distance">Max distance</label>
          <span className="slider-value">{maxDistance}km</span>
          <input
            type="range"
            id="max-distance"
            min="1"
            max="300"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="slider"
            />
        </div>
        <div className="form-group slider-group">
          <label htmlFor="age-range">Age range</label>
          <span className="slider-value">{minAge} - {maxAge}</span>
          {/* Note: A dual range slider is complex. This uses two simple sliders as placeholders. */}
          {/* You'd typically use a library for a true dual-handle slider. */}
          <div className="age-sliders">
              <input
                  type="range"
                  min="18"
                  max="100" // Assuming max age 70
                  value={minAge}
                  onChange={(e) => setMinAge(Math.min(e.target.value, maxAge -1))} // Ensure min < max
                  className="slider age-slider"
                  aria-label="Minimum age"
                  />
              <input
                  type="range"
                  min="18" // Ensure min age is 18
                  max="100"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Math.max(e.target.value, parseInt(minAge, 10) + 1))} // Ensure max > min
                  className="slider age-slider"
                  aria-label="Maximum age"
              />
          </div>
          <button className="save-changes-button">Save changes</button>
        </div>

        {/* Logout Button */}
        <button className="logout-button" onClick={logoutHandler}>
          {/* Simple SVG for logout icon */}
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Log out
        </button>
      </div>
      <Nav/>
    </div>
  );
}
