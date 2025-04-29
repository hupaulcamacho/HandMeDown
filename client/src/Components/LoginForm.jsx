import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({
  username,
  password,
  handleChange,
  loginUser,
  loading,
  error
}) => {
  const [validationMsg, setValidationMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setValidationMsg('Please enter both username and password');
      return;
    }
    
    if (password.length < 6) {
      setValidationMsg('Password must be at least 6 characters');
      return;
    }
    
    setValidationMsg('');
    loginUser();
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
      <h2>Login</h2>
      
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
            className='auth-input login-input'
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group password-input-group">
          <i className="fas fa-lock"></i>{" "}
          <input
            className='auth-input login-input'
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            placeholder="••••••••"
            onChange={handleInputChange}
            required
            minLength="6"
          />
          <button 
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>
        
        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>
        
        <button 
          className='submit-button'
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="button-loading">
              <div className="spinner-pulse"></div>
              <span>Logging in...</span>
            </div>
          ) : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
