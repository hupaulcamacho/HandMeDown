import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const NavBar = ({ logoutUser, isUserLoggedIn, user }) => {
    if (isUserLoggedIn) {
        return (
            <nav>
                <Link to='/user/wardrobe'>Wardrobe</Link>{" "}
                <Link to='/about'>About</Link>
                <button className='logout-button' onClick={logoutUser}>Log Out</button>
            </nav>
        )
    }

    return (
        <nav>
            <Link to='/'>Home</Link>{" "}
            <Link to='/login'>Log-In</Link>{" "}
            <Link to='/signup'>Sign-Up</Link>{" "}
            <Link to='/about'>About</Link>
        </nav>
    )
}

export default NavBar