import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Make sure to link the CSS file (e.g., in your main HTML or App component)
import '../css/profile.css';

// Edit Profile Screen Component
export default function Profile() {
  // State for interactive elements
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('Friends');
  const [sportLabelInput, setSportLabelInput] = useState('');
  const [personalLabelInput, setPersonalLabelInput] = useState('');

  // Placeholder data for images and labels
  const images = [
    { id: 1, url: 'https://placehold.co/100x100/e0e0e0/777?text=Pic+1', isSet: true }, // Placeholder for existing image
    { id: 2, url: null, isSet: false },
    { id: 3, url: null, isSet: false },
    { id: 4, url: null, isSet: false },
    { id: 5, url: null, isSet: false },
    { id: 6, url: null, isSet: false },
  ];

  const sportLabels = ['Fitness', 'Running', 'Yoga'];
  // Note: Personal labels from image seem like key-value pairs, handled differently below

  // Simple SVG Icons
  const BackIcon = () => (
    <Link to={'/settings'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </Link>
  );
  const DumbbellIcon = () => ( // Simple representation
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 14.5L18 18m-3.5-3.5L18 11m-7.5 3.5L7 18m3.5-3.5L7 11M5 11h14M5 14.5h14"/></svg>
  );
   const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
  const CrossIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
   const PizzaIcon = () => ( // Emoji as simple icon
     <span role="img" aria-label="pizza">🍕</span>
   );
   const FitnessIcon = () => ( // Emoji as simple icon
     <span role="img" aria-label="muscle">💪</span>
   );
   const ClockIcon = () => ( // Emoji as simple icon
     <span role="img" aria-label="clock">🕒</span>
   );


  return (
    <div className="edit-profile-container">
      {/* Header */}
      <div className="edit-profile-header">
        <button className="back-button"><BackIcon /></button>
        <h1 className="edit-profile-title">Edit profile</h1>
        <div className="header-icon"><DumbbellIcon /></div>
      </div>

      {/* Image Grid */}
      <div className="image-grid">
        {images.map((img) => (
          <div key={img.id} className={`image-slot ${img.isSet ? 'set' : 'empty'}`}>
            {img.isSet ? (
              <>
                <img src={img.url} alt={`Profile pic ${img.id}`} className="profile-image" onError={(e) => e.target.src='https://placehold.co/100x100/e0e0e0/777?text=Error'} />
                <button className="remove-image-button"><CrossIcon /></button>
              </>
            ) : (
              <button className="add-image-button"><PlusIcon /></button>
            )}
          </div>
        ))}
      </div>
      <p className="image-grid-caption">Add up to 6 pictures</p>
      <p className="image-grid-subcaption">Your first picture will be your profile picture</p>

      {/* Bio Section */}
      <div className="form-section">
        <label htmlFor="bio" className="section-label">Bio</label>
        <textarea
          id="bio"
          className="bio-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
        ></textarea>
      </div>

      {/* Looking For Section */}
      <div className="form-section">
         <label htmlFor="looking-for" className="section-label inline-label">Looking for</label>
         <select
            id="looking-for"
            className="looking-for-select"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
         >
            <option value="Friends">Friends</option>
            <option value="Relationship">Relationship</option>
            <option value="Networking">Networking</option>
            {/* Add more options as needed */}
         </select>
      </div>

       {/* Sport Labels Section */}
      <div className="form-section">
        <label className="section-label">Sport labels</label>
        <div className="labels-container">
          {sportLabels.map((label, index) => (
            <span key={index} className={`label-tag sport-${label.toLowerCase()}`}>{label}</span>
          ))}
        </div>
        <div className="add-label-group">
            <input
                type="text"
                placeholder="Add label"
                className="add-label-input"
                value={sportLabelInput}
                onChange={(e) => setSportLabelInput(e.target.value)}
            />
            <button className="add-label-button">Add</button>
        </div>
      </div>

       {/* Personal Labels Section */}
       <div className="form-section">
        <label className="section-label">Personal labels</label>
         {/* Displaying existing key-value personal info */}
         <div className="personal-info-list">
            <div className="personal-info-item"><PizzaIcon /> Favorite meal : Pizza</div>
            <div className="personal-info-item"><FitnessIcon /> Fitness level : Advanced</div>
            <div className="personal-info-item"><ClockIcon /> Preferred workout time : 16:00 18:00</div>
         </div>
        <div className="add-label-group">
            <input
                type="text"
                placeholder="Add label"
                className="add-label-input"
                value={personalLabelInput}
                onChange={(e) => setPersonalLabelInput(e.target.value)}
            />
            <button className="add-label-button">Add</button>
        </div>
      </div>

      {/* Save Button */}
      <button className="save-changes-button">Save changes</button>

    </div>
  );
}
