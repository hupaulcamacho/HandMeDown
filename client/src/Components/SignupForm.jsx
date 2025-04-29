import React, { useState } from 'react';

const SignupForm = ({
  username,
  password,
  email,
  handleChange,
  signupUser,
  avatar_url,
  isPublic,
  loading,
  error
}) => {
  const [validationMsg, setValidationMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password || !email) {
      setValidationMsg('Please fill in all required fields');
      return;
    }
    
    if (password.length < 6) {
      setValidationMsg('Password must be at least 6 characters');
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationMsg('Please enter a valid email address');
      return;
    }
    
    setValidationMsg('');
    signupUser();
  }
  
  // Clear validation message when user starts typing
  const handleInputChange = (e) => {
    handleChange(e);
    if (validationMsg) {
      setValidationMsg('');
    }
  }

  return (
    <div className='form-container'>
      <h2>Sign-Up</h2>
      
      {error && (
        <div className="auth-error">
          <p>{error}</p>
        </div>
      )}
      
      {validationMsg && (
        <div className="auth-validation-error">
          <p>{validationMsg}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-user"></i>{" "}
          <input
            className='auth-input signup-input'
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group">
          <i className="fas fa-envelope"></i>{" "}
          <input
            className='auth-input signup-input'
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group">
          <i className="fas fa-lock"></i>{" "}
          <input
            className='auth-input signup-input'
            type="password"
            name="password"
            value={password}
            placeholder="••••••••"
            onChange={handleInputChange}
            required
            minLength="6"
          />
        </div>
        
        <div className="input-group">
          <i className="fas fa-image"></i>{" "}
          <input
            className='auth-input signup-input'
            type="text"
            name="avatar_url"
            value={avatar_url}
            placeholder="Enter Avatar URL (optional)"
            onChange={handleInputChange}
          />
        </div>
        
        <button 
          className='submit-button'
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="button-loading">
              <span className="spinner-small"></span>
              <span>Signing up...</span>
            </div>
          ) : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
