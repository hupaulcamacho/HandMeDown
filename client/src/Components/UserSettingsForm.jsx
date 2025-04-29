import React, { useState } from 'react';
import api from '../services/api';

const UserSettingsForm = ({ userId, onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationMsg, setValidationMsg] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear validation message when user starts typing
        if (validationMsg) {
            setValidationMsg(null);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const { username, email, password } = formData;
        if (!username || !email) {
            setValidationMsg('Username and email are required');
            return;
        }
        
        if (password && password.length < 6) {
            setValidationMsg('Password must be at least 6 characters');
            return;
        }
        
        // Clear validation message and start loading
        setValidationMsg(null);
        setError(null);
        setLoading(true);
        
        try {
            // For demonstration, simulate an API call
            // const userData = { ...formData };
            // await api.put(`/users/${userId}`, userData);
            
            // For now, just simulate a delay and success
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message and reset form
            setSuccess(true);
            setFormData({
                username: '',
                email: '',
                password: '',
                avatar_url: ''
            });
            
            // Call success callback after short delay
            setTimeout(() => {
                onSuccess();
                // Close popup after a short delay
                setTimeout(() => {
                    onClose();
                }, 500);
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='user-form'>
            <h3>User Info</h3>
            
            {validationMsg && (
                <div className="auth-validation-error">
                    <p>{validationMsg}</p>
                </div>
            )}
            
            {error && (
                <div className="auth-error">
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="auth-success">
                    <p>Settings updated successfully!</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <i className="fas fa-user"></i>{" "}
                    <input
                        className='auth-input signup-input'
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                    />
                </div>
                
                <div className="input-group">
                    <i className="fas fa-envelope"></i>{" "}
                    <input
                        className='auth-input signup-input'
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                    />
                </div>
                
                <div className="input-group password-input-group">
                    <i className="fas fa-lock"></i>{" "}
                    <input
                        className='auth-input signup-input'
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="••••••••"
                        onChange={handleChange}
                        disabled={loading || success}
                    />
                </div>
                
                <div className="input-group">
                    <i className="fas fa-image"></i>{" "}
                    <input
                        className='auth-input signup-input'
                        type="text"
                        name="avatar_url"
                        value={formData.avatar_url}
                        placeholder="Enter Avatar URL"
                        onChange={handleChange}
                        disabled={loading || success}
                    />
                </div>
                
                <button 
                    type="submit"
                    className="submit-button"
                    disabled={loading || success}
                >
                    {loading ? (
                        <div className="button-loading">
                            <span className="spinner-small"></span>
                            <span>Saving...</span>
                        </div>
                    ) : success ? 'Saved!' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default UserSettingsForm;

