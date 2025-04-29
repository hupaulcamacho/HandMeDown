import React, { Component, createRef } from 'react'
import Popup from "reactjs-popup";
import { Link } from 'react-router-dom'
import api from '../services/api'
import NewGarmentForm from './NewGarmentForm'
import UserSettingsForm from './UserSettingsForm'

class Wardrobe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            garments: [],
            error: null,
            success: null,
            showSuccess: false
        };
        
        // Create refs for the popups
        this.garmentPopupRef = createRef();
        this.settingsPopupRef = createRef();
    }

    componentDidMount = () => {
        this.getUserGarments()
    }

    getUserGarments = async () => {
        this.setState({ error: null });
        let { user } = this.props;
        let URL = `/garments/garment/${user.id}`;
        try {
            let results = await api.get(URL);
            this.setState({
                garments: results.data.payload
            });
        } catch (err) {
            this.setState({ 
                error: err.response?.data?.message || 'Failed to load garments. Please try again.' 
            });
        } finally {
            // No loading state to reset here as it's handled in the form components
        }
    }

    // Handle successful garment submission
    handleGarmentSuccess = () => {
        this.getUserGarments();
        this.setState({ 
            success: 'Garment added successfully!',
            showSuccess: true
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            this.setState({ showSuccess: false });
        }, 3000);
    }
    
    // Handle successful settings update
    handleSettingsSuccess = () => {
        this.setState({ 
            success: 'Settings updated successfully!',
            showSuccess: true
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            this.setState({ showSuccess: false });
        }, 3000);
    }
    
    // Close garment popup
    closeGarmentPopup = () => {
        if (this.garmentPopupRef.current) {
            this.garmentPopupRef.current.close();
        }
    }
    
    // Close settings popup
    closeSettingsPopup = () => {
        if (this.settingsPopupRef.current) {
            this.settingsPopupRef.current.close();
        }
    }

    render () {
        const { user } = this.props;
        const { garments, error, success, showSuccess } = this.state;
        
        // Use map instead of forEach for better React pattern
        const garmentComponents = garments.map(garment => (
            <Link to={`/user/wardrobe/garment/${garment.id}`} key={garment.id}>
                <div className='garment'>
                    <img className='garment-img' src={garment.img_url} alt={garment.garment_name}/>
                    <div className='garment-wardrobe-info'>
                        <h3>{garment.garment_name}</h3>
                        <div className="location">{garment.prime_location}</div>
                        <p>{garment.caption}</p>
                    </div>
                </div>
            </Link>
        ));
        return (
            <div className='wardrobe-main'>
                <div className='header'>
                    <div className='user'>
                        <img className='avatar' src={user.avatar_url} alt={`${user.username}'s avatar`} />
                        <h1 className='username'>{user.username}'s Wardrobe</h1>
                    </div>
                    
                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {showSuccess && success && (
                        <div className="auth-success">
                            <p>{success}</p>
                        </div>
                    )}
                    
                    <nav className='garment-nav'>
                        <Popup 
                            ref={this.garmentPopupRef}
                            trigger={<h4>Add A New Garment</h4>} 
                            modal
                            position="right center"
                            className="garment-popup"
                        >
                            <NewGarmentForm 
                                userId={user.id}
                                onSuccess={this.handleGarmentSuccess}
                                onClose={this.closeGarmentPopup}
                            />
                        </Popup>
                        
                        <Popup 
                            ref={this.settingsPopupRef}
                            trigger={<h4>Settings</h4>} 
                            modal
                            position="right center"
                            className="settings-popup"
                        >
                            <UserSettingsForm 
                                userId={user.id}
                                onSuccess={this.handleSettingsSuccess}
                                onClose={this.closeSettingsPopup}
                            />
                        </Popup>
                    </nav>
                </div>
                <div className='garments-container'>
                    {garmentComponents}
                </div>
            </div>
        )
    }
}

export default Wardrobe