
// Importing express module
import express, { query } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const port = 1337;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
 }

app.get("/player", (req, res) => {
        return res.redirect("player.html");
});

app.get("/auth", (req, res) => {
        const code = req.query.code;
        axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                data: querystring.stringify({
                        code: code,
                        redirect_uri: process.env.REDIRECT_URI,
                        grant_type: 'authorization_code'
                }),
                headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
                },
                json: true
                }).then(response => {
                        if (response.status === 200) {
                                res.cookie('token', `${response.data["access_token"]}`)
                                res.redirect("player");
                        } else {
                                res.send("There was an error processing your request. Please create an issue at https://github.com/callihann/spotify-express-server/issues");
                        }
                })
                .catch(function(error) {
                        res.send("There was an error processing your request. Please create an issue at https://github.com/callihann/spotify-express-server/issues");
                });
});


app.get('/', function(req, res) {
        var state = randomString(16);
        var scope = 'user-read-private user-read-email app-remote-control user-modify-playback-state playlist-read-private playlist-read-collaborative streaming';
        res.redirect('https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                        response_type: 'code',
                        client_id: process.env.CLIENT_ID,
                        scope: scope,
                        redirect_uri: process.env.REDIRECT_URI,
                        state: state
                }));
      });

app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
});

// const express = require('express');
// const SpotifyWebApi = require("spotify-web-api-node")
// const request = require('request');
// const dotenv = require('dotenv');
// const path = require('path');
// const https = require('https');  
// const fs = require('fs');
// const cors = require('cors');
// const axios = require('axios');
// const  cookieParser  = require('cookie-parser');
// const querystring = require('querystring');
// const crypto = require('crypto');

// dotenv.config();

// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(cors({
//   origin: 'https://localhost:3000',
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
// const spotifyClientId = '1f42356ed83f46cc9ffd35c525fc8541';
// const redirectUri = 'https://localhost:3000/';
// const authorizationEndpoint = "https://accounts.spotify.com/authorize?";
// const tokenEndpoint = "https://accounts.spotify.com/api/token";
// const scopes = [
//   "streaming",
//   "user-read-private",
//   "user-read-email",
//   "playlist-read-private",
//   "user-library-read",
//   "user-library-modify",
//   "user-read-playback-state",
//   "user-modify-playback-state"
// ];
// let codeVerifier;

// async function generateCodeChallenge(verifier) {
//   const hash = crypto.createHash('sha256').update(verifier).digest('base64');
//   return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// }
// const SCOPES = [
//   "streaming",
//   "user-read-private",
//   "user-read-email",
//   "playlist-read-private",
//   "user-library-read",
//   "user-library-modify",
//   "user-read-playback-state",
//   "user-modify-playback-state"
// ].join("%20");



// // Avoid infinite redirect loop

// // async function getAuthUrl() {
// //   if (codeVerifier) {
// //     const authUrl = new URL(authorizationEndpoint);
// //     const params = {
// //       response_type: 'code',
// //       client_id: spotifyClientId,
// //       scope: scope,
// //       code_challenge_method: 'S256',
// //       code_challenge: codeVerifier,
// //       redirect_uri: redirectUri
// //     };
  
// //     authUrl.search = new URLSearchParams(params).toString();
// //     window.location.href = authUrl.toString();
// //   } else {
// //       const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// //       const randomValues = crypto.getRandomValues(new Uint8Array(64));
// //       const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], '');

// //       const data = new TextEncoder().encode(codeVerifier);
// //       const hashed = await crypto.subtle.digest('SHA-256', data);
  
// //     const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
// //       .replace(/=/g, '')
// //       .replace(/\+/g, '-')
// //       .replace(/\//g, '_');
  
  
// //     const authUrl = new URL(authorizationEndpoint);
// //     const params = {
// //       response_type: 'code',
// //       client_id: spotifyClientId,
// //       scope: scope,
// //       code_challenge_method: 'S256',
// //       code_challenge: code_challenge_base64,
// //       redirect_uri: redirectUri
// //     };
  
// //     authUrl.search = new URLSearchParams(params).toString();
// //     window.location.href = authUrl.toString();
// //   }
// // }
// async function getAuthUrl(req, res) {
//   // Check for tokens before triggering auth flow
//   if (req.cookies.accessToken) {
//     return res.redirect('/dashboard');
//   }

//   // Generate a new code verifier for PKCE flow
//   codeVerifier = crypto.randomBytes(64).toString('hex');
//   const codeChallenge = await generateCodeChallenge(codeVerifier);

//   const authUrl = new URL(authorizationEndpoint);
//   authUrl.search = new URLSearchParams({
//     response_type: 'code',
//     client_id: spotifyClientId,
//     scope: scopes,
//     code_challenge_method: 'S256',
//     code_challenge: codeChallenge,
//     redirect_uri: redirectUri
//   }).toString();

//   res.redirect(authUrl.toString());
// }


// // Spotify API calls
// async function getToken(code) {
//   const response = await axios.post(tokenEndpoint, new URLSearchParams({
//     client_id: spotifyClientId,
//     grant_type: 'authorization_code',
//     code: code,
//     redirect_uri: redirectUri,
//     code_verifier: codeVerifier, // Use the codeVerifier generated earlier
//   }), {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
  
//   // Store tokens securely in cookies
//   res.cookie('accessToken', response.data.access_token, { httpOnly: true, secure: true, sameSite: 'strict' });
//   res.cookie('refreshToken', response.data.refresh_token, { httpOnly: true, secure: true, sameSite: 'strict' });
  
//   return response.data;
// }

// // Refresh the access token using the refresh token
// async function refreshToken(refreshToken) {
//   const response = await axios.post(tokenEndpoint, new URLSearchParams({
//     client_id: spotifyClientId,
//     grant_type: 'refresh_token',
//     refresh_token: refreshToken,
//   }), {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
  
//   return response.data;
// }
// // Example endpoint to get user data from Spotify
// app.get('/me', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ error: 'Access token not found' });
//   }

//   try {
//     const userData = await getUserData(accessToken);
//     res.json(userData);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch user data' });
//   }
// });
// app.get('/refresh_token', async (req, res) => {
//   const refresh_token = req.cookies.refresh_token;

//   const authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//           refresh_token: refresh_token,
//           grant_type: 'refresh_token',
//           client_id: spotifyClientId,
//           client_secret: spotifyClientSecret
//       },
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//       },
//   };

//   try {
//       const response = await axios.post(authOptions.url, stringify(authOptions.form), { headers: authOptions.headers });
//       const { access_token } = response.data;

//       res.cookie('access_token', access_token, { httpOnly: true });
//       res.json({ access_token });
//   } catch (error) {
//       console.error('Error during token refresh:', error);
//       res.status(500).json({ error: 'Failed to refresh token' });
//   }
// });
// async function getUserData(accessToken) {
//   const response = await axios.get("https://api.spotify.com/v1/me", {
//     headers: { 'Authorization': `Bearer ${accessToken}` },
//   });
//   return response.data;
// }

// // // Handle /login endpoint
// // app.get('/login', (req, res) => {
// //   const authUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`;
// //   // const codeChallenge = generateCodeChallenge(codeVerifier);
// //   res.redirect('https://localhost:3000/dashboard');
// // });
// // Endpoint to handle login and redirect to Spotify
// const generateRandomString = function (length) {
//   const text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (const i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };



// app.get('/auth/login', (req, res) => {

//   const scope = "streaming user-read-email user-read-private"
//   const state = generateRandomString(16);

//   const auth_query_parameters = new URLSearchParams({
//     response_type: "code",
//     client_id: spotifyClientId,
//     scope: scope,
//     redirect_uri: spotify_redirect_uri,
//     state: state
//   })

//   res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
// })

// app.get('/login', async (req, res) => {
//   codeVerifier = crypto.randomBytes(64).toString('hex');
//   const codeChallenge = await generateCodeChallenge(codeVerifier);

//   const authUrl = `${authorizationEndpoint}?response_type=code&client_id=${spotifyClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
//   res.redirect(authUrl);
// });

// // Handle the callback from Spotify
// // Callback endpoint after Spotify authorization
// app.get('/callback', async (req, res) => {
//   const code = req.query.code || null;

//   try {
//     const tokenData = await getToken(code);
//     const { access_token, refresh_token } = tokenData;

//     // Set tokens in cookies
//     res.cookie('accessToken', access_token, { httpOnly: true, secure: true, sameSite: 'strict' });
//     res.cookie('refreshToken', refresh_token, { httpOnly: true, secure: true, sameSite: 'strict' });

//     res.redirect('https://localhost:3000/dashboard'); // Redirect to your dashboard after successful login
//   } catch (error) {
//     console.error('Error during Spotify token exchange:', error.response?.data || error.message);
//     res.redirect('/error');
//   }
// });
// // app.get('/callback', async (req, res) => {
// //   const code = req.query.code || null;

// //   const authOptions = {
// //     url: 'https://accounts.spotify.com/api/token',
// //     form: {
// //         code: code,
// //         redirect_uri: redirectUri,
// //         grant_type: 'authorization_code',
// //         client_id: spotifyClientId,
// //         client_secret: spotifyClientSecret
// //     },
// //     headers: {
// //         'Content-Type': 'application/x-www-form-urlencoded',
// //     },
// //     json: true
// //   };
  
// //   try {
// //     const response = await axios.post(authOptions.url, stringify(authOptions.form), { headers: authOptions.headers });
// //     const { access_token, refresh_token } = response.data;

// //     // Set tokens in cookies
// //     res.cookie('access_token', access_token);
// //     res.cookie('refresh_token', refresh_token);

// //     res.redirect('https://localhost:3000/');
// // } catch (error) {
// //     console.error('Error during Spotify token exchange:', error);
// //     res.redirect('/error');
// // }
// // });


// // Endpoint to refresh token
// app.post('/auth/refresh', async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(401).json({ error: 'No refresh token' });
//   }

//   try {
//     const tokenData = await refreshToken(refreshToken);
//     const newAccessToken = tokenData.access_token;
//     res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//     res.json({ accessToken: newAccessToken, expires_in: tokenData.expires_in });
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint to search for a song
// app.get('/api/search', async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(401).json({ error: 'No refresh token' });
//   }
//   try {
//   const query = req.query.q;
//   const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`;
//   const accessToken = req.cookies.accessToken;

//     const response = await axios.get(searchUrl, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send(error.response?.data || { error: 'Failed to search tracks' });
//   }
// });

// app.post('/api/playlist/add', async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(401).json({ error: 'No refresh token' });
//   }
//   try {
//   const { playlistId, trackUri } = req.body;
//   const addTrackUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUri}`;
//   const accessToken = req.cookies.accessToken;

//     const response = await axios.post(addTrackUrl, {}, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send(error.response?.data || { error: 'Failed to add track to playlist' });
//   }
// });

// app.get('/me/player', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ error: 'Access token not found' });
//   }

//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/player', {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching playback state:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ error: 'Failed to fetch playback state' });
//   }
// });

// app.get('/me/player/devices', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.get('/api/me/player/currently-playing', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {  
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.get('/api/me/player/recently-played', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {  
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.get('/api/me/tracks', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.put('/api/me/player/pause', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.put('https://api.spotify.com/v1/me/player/pause', req.body, {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.send(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.put('/api/me/player/seek', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.put('https://api.spotify.com/v1/me/player/seek', req.body, {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.send(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.put('/api/me/player/volume', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.put('https://api.spotify.com/v1/me/player/volume', req.body, {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.send(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.put('/api/me/player/play', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) return res.status(401).json({ error: 'Access token not found' });

//   try {
//     const response = await axios.put('https://api.spotify.com/v1/me/player/play', req.body, {
//       headers: { 'Authorization': `Bearer ${accessToken}` },
//     });
//     res.send(response.data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });

// app.get('/auth', (req, res) => {
//   const auth_id = Math.random().toString(36).slice(5, 11)
//   res.set('Content-Type', 'application/json');
//   res.send(JSON.stringify({ auth_id: Math.random().toString(36).slice(5, 11) }));
// });

// // SSL configuration for HTTPS server
// const httpsOptions = {
//   key: fs.readFileSync('./ssl/key.pem'),
//   cert: fs.readFileSync('./ssl/cert.pem')
// };

// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log(`Server is running on https://localhost:${PORT}`);
// });

