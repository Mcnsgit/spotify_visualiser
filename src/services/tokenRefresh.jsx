// services/tokenRefresh.jsx

import AuthService from './AuthService';
import { reducerCases } from '../utils/Constants';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { useContext, useEffect } from 'react';

export const refreshToken = async () => {
  try {
    const newToken = await AuthService.refreshToken();
    if (newToken) {
      localStorage.setItem('spotify_access_token', newToken);
      return newToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

export const useTokenRefresh = () => {
  const { dispatch } = useContext(GlobalStateContext);

  useEffect(() => {
    const refresh = async () => {
      try {
        const accessToken = AuthService.getAccessToken();
        if (!accessToken) {
          throw new Error('Access token not found');
        }
        const newToken = await refreshToken();
        if (newToken && newToken !== accessToken) {
          localStorage.setItem('spotify_access_token', newToken);
          dispatch({ type: reducerCases.SET_TOKEN, token: newToken });
          return newToken;
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        // Handle error or provide feedback to the user
      }
    };

    refresh();
  }, [dispatch]);

  return null; // You may return something meaningful here if needed
};