import axios from 'axios';
import { getAccessToken } from '../api/api';
import AuthService from '../services/AuthService';
import TokenService from '../services/TokenService';
import { storeAccessToken, clearAccessToken, getAuthToken  } from '../helpers/auth'; 
const BASE_URL = "https://api.spotify.com/v1";
const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = "1f42356ed83f46cc9ffd35c525fc8541";
const redirectUri = 'https://localhost:3000';
const scopes = [
  "streaming",
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state"
].join(" ");  // Just space, not %20 or %2520

const accessToken = TokenService.getAccessToken();
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TokenService.getAccessToken() || ''}`,
  }
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await AuthService.refreshToken();
        TokenService.setAccessToken(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        AuthService.logout();
      }
    }
    return Promise.reject(error);
  }
);

export const loginEndpoint = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;


    export const setClientToken = (token) => {
      instance.interceptors.request.use(async function (config) {
        config.headers.Authorization = "Bearer " + token;
        return config;
      })
    };


export default instance;