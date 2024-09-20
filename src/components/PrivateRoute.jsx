// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = React.memo(({ children }) => {
  const { access_token } = useContext(AuthContext);

  // If the access token is not present, redirect to login
  if (!access_token) {
    return <Navigate to="/login" />;
  }
  
  // Authenticated, render the children
  return children;
});

export default PrivateRoute;