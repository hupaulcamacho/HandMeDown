import React, { Component } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

import LoginForm from '../Components/LoginForm';
import SignupForm from '../Components/SignupForm.jsx';

class AuthContainer extends Component {
    state = {
        username: '',
        password: '',
        avatar_url: '',
        email: '',
        isPublic: true,
        loading: false,
        error: null,
        formType: '' // 'login' or 'signup' to track which form is being loaded
    }
    
    // Update form values when user types
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Handle signup form submission
    signupUser = async () => {
        this.setState({ loading: true, error: null });
        try {
            const { username, password, avatar_url, email, isPublic } = this.state;
            const userData = {
                username,
                password,
                avatar_url,
                email,
                isPublic
            };
            
            await api.post('/auth/signup', userData);
            
            // After signup, navigate to login
            this.props.navigate('/login', { state: { newUser: true } });
        } catch (err) {
            this.setState({ 
                error: err.response?.data?.message || 'Signup failed. Please try again.' 
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    // Handle login form submission
    loginUser = async () => {
        this.setState({ loading: true, error: null });
        try {
            const { username, password } = this.state;
            const { data } = await api.post('/auth/login', { username, password });
            
            // Set user in parent component
            if (data.payload) {
                this.props.setUser(data.payload);
            }
            
            // If there's a redirect destination in the location state, go there
            const from = this.props.location?.state?.from || '/user/wardrobe';
            this.props.navigate(from);
        } catch (err) {
            this.setState({ 
                error: err.response?.data?.message || 'Login failed. Please check your credentials.' 
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    // Render the login form
    renderLogin = () => {
        const { username, password, loading, error } = this.state;
        
        // Set form type for styling
        if (this.state.formType !== 'login') {
            this.setState({ formType: 'login' });
        }
        
        return (
            <LoginForm 
                handleChange={this.handleChange}
                username={username}
                password={password}
                loginUser={this.loginUser}
                loading={loading}
                error={error}
            />
        );
    }
    
    // Render the signup form
    renderSignUp = () => {
        const { username, password, avatar_url, email, loading, error } = this.state;
        
        // Set form type for styling
        if (this.state.formType !== 'signup') {
            this.setState({ formType: 'signup' });
        }
        
        return (
            <SignupForm 
                handleChange={this.handleChange}
                username={username}
                password={password}
                email={email}
                signupUser={this.signupUser}
                avatar_url={avatar_url}
                loading={loading}
                error={error}
            />
        );
    }
    
    // Main render method
    render() {
        const { isUserLoggedIn } = this.props;
        const { formType } = this.state;
        
        return (
            <div className='main'>  
                {isUserLoggedIn ? (
                    <Navigate to='/user/wardrobe' replace />
                ) : (
                    <>
                        <div className="auth-container">
                            <div className={`form-container ${formType || ''}`}>
                                <Routes>
                                    <Route path="/login" element={this.renderLogin()} />
                                    <Route path="/signup" element={this.renderSignUp()} />
                                    <Route path="*" element={<Navigate to="/login" replace />} />
                                </Routes>
                                
                                <div className="auth-links">
                                    <Link to='/'>
                                        <button className='submit-button'>Back to Home</button>
                                    </Link>
                                    {formType === 'login' && (
                                        <div className="auth-alternate-action">
                                            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                                        </div>
                                    )}
                                    {formType === 'signup' && (
                                        <div className="auth-alternate-action">
                                            <p>Already have an account? <Link to="/login">Log in</Link></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

// Wrapper component to provide navigation props
function WithNavigate(props) {
    const navigate = useNavigate();
    const location = useLocation();
    return <AuthContainer {...props} navigate={navigate} location={location} />;
}

export default WithNavigate;
