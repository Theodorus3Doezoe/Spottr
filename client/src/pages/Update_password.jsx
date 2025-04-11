import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'
//heel de pagina ai
// Make sure to link the CSS file (e.g., in your main HTML or App component)
import '../css/update_password.css';

// Update Password Screen Component
export default function Update_password() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate()

  const submitHandler = (event) => {
    event.preventDefault();
    // Add password update logic here
    if (newPassword !== confirmNewPassword) {
      toast.success("New passwords don't match!")
      return;
    }
    navigate('/settings')
    toast.success('Password updated successfully!')
    // Clear fields after successful update
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // Simple SVG Icons
  const BackIcon = () => (
    <Link to={'/settings'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </Link>
  );
  const DumbbellIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 14.5L18 18m-3.5-3.5L18 11m-7.5 3.5L7 18m3.5-3.5L7 11M5 11h14M5 14.5h14"/></svg>
  );

  return (
    <div className="update-password-container">
       {/* Header */}
      <div className="update-password-header">
        <button className="back-button"><BackIcon /></button>
        <h1 className="update-password-title">Change password</h1>
        <div className="header-icon"><DumbbellIcon /></div>
      </div>

      <form onSubmit={submitHandler} className="update-password-form">
        <div className="update-password-form-group">
          <label htmlFor="current-password">Current password</label>
          <input
            type="password"
            id="current-password"
            className="update-password-input-field"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>
        <div className="update-password-form-group">
          <label htmlFor="new-password">New password</label>
          <input
            type="password"
            id="new-password"
            className="update-password-input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
         <div className="update-password-form-group">
          <label htmlFor="confirm-new-password">Confirm new password</label>
          <input
            type="password"
            id="confirm-new-password"
            className="update-password-input-field"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>

        <button type="submit" className="update-password-submit-button">
          Update password
        </button>
      </form>
    </div>
  );
}
