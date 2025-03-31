import React, { useState } from 'react';
// Make sure to link the CSS file (e.g., in your main HTML or App component)
import './auth.css';

// Authentication Screen Component (Login / Sign Up)
export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true); // true for Login, false for Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
    // Clear fields on mode switch
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // Add authentication logic here (e.g., API calls)
    console.log('Submitting:', { email, password, confirmPassword: !isLoginMode ? confirmPassword : undefined });
    alert(`${isLoginMode ? 'Login' : 'Sign Up'} successful! (Placeholder)`);
  };

  // Simple SVG Icon
  const DumbbellIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 14.5L18 18m-3.5-3.5L18 11m-7.5 3.5L7 18m3.5-3.5L7 11M5 11h14M5 14.5h14"/></svg>
  );


  return (
    <div className="auth-container">
      {/* Header Icon */}
      <div className="auth-header-icon">
        <DumbbellIcon />
      </div>

      <h1 className="auth-title">{isLoginMode ? 'Log In' : 'Sign Up'}</h1>

      <form onSubmit={submitHandler} className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="auth-input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="auth-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="auth-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        {/* Confirm Password field only for Sign Up */}
        {!isLoginMode && (
          <div className="auth-form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="auth-input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button type="submit" className="auth-submit-button">
          {isLoginMode ? 'Log In' : 'Create Account'}
        </button>
      </form>

      <button onClick={toggleModeHandler} className="auth-toggle-button">
        {isLoginMode ? 'Don\'t have an account? Sign Up' : 'Already have an account? Log In'}
      </button>
    </div>
  );
}
