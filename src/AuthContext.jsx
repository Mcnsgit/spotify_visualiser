// src/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Initialize state from local storage
  const accessToken = 'BQDUxJbGVHp6x-7Twb2J-j5pk3jPFIGd63CJsnDejLrGVRpBJWFGmF8kBh0gFC-rVSb0GIyHMr5WFULfWYKANWxCeHSvQY6p3v5EZ9661c2PtDl10rc'
  function setAccessToken(accessToken) {
    console.log('Setting access token:', accessToken);
    localStorage.setItem('access_token', accessToken);
  }
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
  const [expiresIn, setExpiresIn] = useState(null);

  // Effect to store access token in local storage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      console.log('Storing access token in local storage:', accessToken);
    }
  }, [accessToken]);

  // Effect to store refresh token in local storage
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      console.log('Storing refresh token in local storage:', refreshToken);
    }
  }, [refreshToken]);

  // Effect to refresh access token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(async () => {
      try {
        console.log('Sending request to refresh access token...');
        const response = await axios.post('http://localhost:3001/refresh', {
          refresh_token: refreshToken,
        });
        console.log('Received new access token:', response.data.access_token);
        setAccessToken(response.data.access_token);
        setExpiresIn(response.data.expires_in);
      } catch (err) {
        console.error('Error refreshing access token:', err.response ? err.response.data : err.message);
      }
    }, (expiresIn - 60) * 1000); // Refresh 60 seconds before expiration

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        expiresIn,
        setExpiresIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};