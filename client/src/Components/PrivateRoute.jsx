import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * A wrapper for protected routes in React Router v6
 * - Checks if user is logged in
 * - If logged in, renders the protected content
 * - If not logged in, redirects to login with return path
 */
const PrivateRoute = ({ isUserLoggedIn, children, redirectPath = '/login' }) => {
  const location = useLocation();

  // If user is not logged in, redirect to login
  if (!isUserLoggedIn) {
    // Save the current location for redirecting back after login
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  // If user is logged in, render either the children or an outlet for nested routes
  return children ? children : <Outlet />;
};

export default PrivateRoute;
