import React, { createContext, useContext, useReducer } from 'react';
import AuthService from '../services/AuthService';
import { extractTokenFromUrl, storeAccessToken, clearAccessToken } from '../helpers/auth';
import PropTypes from 'prop-types';

const initialState = {
  token: null,

};
const SpotifyAuthContext = createContext();


const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_Token':
      return { ...state, token: action.payload };
    case "LOGIN_SUCCESS":
      return { ...state, token: action.payload, error: null };
    case "LOGIN_FAILURE":
      return { ...state, error: action.payload, token: null };
    case "LOGOUT":
      return { ...initialState };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.payload };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "SET_PLAYBACK_STATE":
      return { ...state, playbackState: action.payload };
    default:
      return state;
  }
};

export const SpotifyAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SpotifyAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

SpotifyAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (context === undefined) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};
