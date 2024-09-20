// middleware/spotifyApiMiddleware.js

import SpotifyWebAPI from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config()

// const ENV_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
// const ENV_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '1f42356ed83f46cc9ffd35c525fc8541';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// console.log("Client ID:", CLIENT_ID);
console.log("Client Secret:", process.env.SPOTIFY_CLIENT_SECRET );

async function ValidateToken(req, res, next) {
  const accessToken = req.cookies['access_token'];
  const refreshToken = req.cookies['refresh_token'];

  const spotifyApi = new SpotifyWebAPI({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });

  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);

    try {
      await spotifyApi.getMe(); // Verify the access token
      req.spotifyApi = spotifyApi;
      next();
    } catch (err) {
      if (err.statusCode === 401 && refreshToken) {
        try {
          spotifyApi.setRefreshToken(refreshToken);
          const data = await spotifyApi.refreshAccessToken();
          const newAccessToken = data.body['access_token'];

          res.cookie('access_token', newAccessToken, { httpOnly: true });
          spotifyApi.setAccessToken(newAccessToken);
          req.spotifyApi = spotifyApi;
          next();
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError);

          // Clear invalid tokens
          res.clearCookie('access_token');
          res.clearCookie('refresh_token');

          res.status(401).json({ error: 'Invalid refresh token. Please log in again.' });
        }
      } else {
        console.error('Error validating access token:', err);
        res.status(401).json({ error: 'Unauthorized' });
      }
    }
  } else {
    res.status(401).json({ error: 'Access token is missing' });
  }
}

export default ValidateToken;