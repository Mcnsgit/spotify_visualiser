import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename );

app.use(express.static(__dirname + '/public'));
const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/callback'; // Server redirect URI
const FRONTEND_URI = 'http://localhost:3000';

if (!CLIENT_ID || !CLIENT_SECRET) {

  console.error('Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set.');
  process.exit(1);
  
}
else if (CLIENT_ID && CLIENT_SECRET) {
  console.log('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set.');
}


// Spotify API Credentials
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

const stateKey = 'spotify_auth_state';
 const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];


  // Handles the login route
  // Generates a random state string and stores it in an HTTP-only cookie
  // Redirects the user to the Spotify authorization URL
  // with the scope and state parameters
  app.get('/login', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    // Store the state string in an HTTP-only cookie
    res.cookie(stateKey, state, { httpOnly: true, sameSite: 'Lax' });
  
    // Generate the authorization URL with the scope and state parameters
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  
    // Redirect the user to the authorization URL
    res.redirect(authorizeURL);
  });

  // Handles the callback route
  // Retrieves the authorization code from the URL query
  // Verifies that the state parameter is valid
  // Exchanges the authorization code for an access token and refresh token
  // Stores the tokens in HTTP-only cookies
  // Redirects the user to the frontend application
  app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    // Verify that the state parameter is valid
    if (state === null || state !== storedState) {
      // If the state is invalid, redirect to an error page
      res.redirect(`${FRONTEND_URI}/error/state_mismatch`);
    } else {
      // Clear the state cookie
      res.clearCookie(stateKey);

      try {
        // Exchange the authorization code for an access token and refresh token
        const data = await spotifyApi.authorizationCodeGrant(code);

        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];

        // Set the access token and refresh token on the Spotify API client
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        
        // Store the tokens in HTTP-only cookies
        res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'Lax' });
        res.cookie('refresh_token', refresh_token, { httpOnly: true, sameSite: 'Lax' });
        res.cookie('logged_in', true, { httpOnly: true, sameSite: 'Lax' });      

        
        // Redirect to the frontend application with the tokens as query parameters
        res.redirect(`${FRONTEND_URI}/dashboard#access_token=${access_token}&refresh_token=${refresh_token}`);
        // Redirect to your frontend application
      } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error);
        // If there is an error, redirect to an error page
        res.redirect(`${FRONTEND_URI}/error/invalid_token`);
      }
    }
  });

  // Handles the refresh token route
  // Retrieves the refresh token from the URL query
  // Exchanges the refresh token for a new access token
  // Returns the new access token in the response
  app.get('/refresh_token', async (req, res) => {
    const refresh_token = req.query.refresh_token;

    if (!refresh_token) {
      // If the refresh token is missing, return a 400 error
      return res.status(400).json({ error: 'Refresh token is missing' });
    }

    try {
      // Set the refresh token on the Spotify API client
      spotifyApi.setRefreshToken(refresh_token);
      // Exchange the refresh token for a new access token
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body['access_token'];

      // Return the new access token in the response
      res.json({
        access_token: access_token,
        expires_in: data.body['expires_in'],
      });
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // If there is an error, return a 500 error
      res.status(500).json({ error: 'Failed to refresh access token' });
    }
  });
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

function validateToken(req, res, next) {
  const access_token = req.cookies['access_token'];

  if (!access_token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  spotifyApi.setAccessToken(access_token);

  next();
}

// Protected routes
const protectedRoutes = ['/me', '/play', '/pause', '/next', '/previous', '/volume', '/currently-playing'];
app.use(protectedRoutes, validateToken);

app.get('/me', async (req, res) => {
  try {
    const data = await spotifyApi.getMe();
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error.statusCode === 401) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});