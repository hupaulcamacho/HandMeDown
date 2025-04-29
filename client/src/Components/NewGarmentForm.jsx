import React, { useState } from 'react';
import api from '../services/api';

const NewGarmentForm = ({ userId, onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        garment_name: '',
        category: '',
        caption: '',
        img_url: '',
        prime_location: ''
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
        const { garment_name, img_url } = formData;
        if (!garment_name || !img_url) {
            setValidationMsg('Garment name and image URL are required');
            return;
        }
        
        // Clear validation message and start loading
        setValidationMsg(null);
        setError(null);
        setLoading(true);
        
        try {
            const URL = `/garments/user/${userId}`;
            await api.post(URL, formData);
            
            // Show success message and reset form
            setSuccess(true);
            setFormData({
                garment_name: '',
                category: '',
                caption: '',
                img_url: '',
                prime_location: ''
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
            setError(err.response?.data?.message || 'Failed to add garment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='garment-form'>
            <h3>Add New Garment</h3>
            
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
                    <p>Garment added successfully!</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <b>Name</b><br/>
                <input
                    className='garment-input'
                    type="text"
                    name="garment_name"
                    value={formData.garment_name}
                    placeholder="Garment Name"
                    onChange={handleChange}
                    disabled={loading || success}
                /><br/>
                
                <b>Category</b><br/>
                <input
                    className='garment-input'
                    type="text"
                    name="category"
                    value={formData.category}
                    placeholder="Category"
                    onChange={handleChange}
                    disabled={loading || success}
                /><br/>
                
                <b>Caption</b><br/>
                <textarea 
                    name="caption"
                    value={formData.caption} 
                    cols="42"
                    onChange={handleChange} 
                    placeholder="Caption"
                    disabled={loading || success}
                /><br/>
                
                <b>Garment Image</b><br/>
                <input
                    className='garment-input'
                    type="text"
                    name="img_url"
                    value={formData.img_url}
                    placeholder="image url"
                    onChange={handleChange}
                    disabled={loading || success}
                /><br/>
                
                <b>Location</b><br/>
                <input
                    className='garment-input'
                    type="text"
                    name="prime_location"
                    value={formData.prime_location}
                    placeholder="Location"
                    onChange={handleChange}
                    disabled={loading || success}
                /><br/>
                
                <button 
                    type="submit"
                    className="submit-button"
                    disabled={loading || success}
                >
                    {loading ? (
                        <div className="button-loading">
                            <span className="spinner-small"></span>
                            <span>Adding...</span>
                        </div>
                    ) : success ? 'Added!' : 'Add Garment'}
                </button>
            </form>
        </div>
    );
};

export default NewGarmentForm;

