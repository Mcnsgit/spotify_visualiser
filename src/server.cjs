const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');  
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const  cookieParser  = require('cookie-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const { redirect } = require('react-router-dom');
const axiosInstance = require('./axiosInstance'); // Import the configured Axios instance

dotenv.config();

const PORT = process.env.PORT || 3001;


const app = express();
const port = 3001;

app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const spotifyClientId = '1f42356ed83f46cc9ffd35c525fc8541';
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
// const redirectUri = 'https://localhost:3000/auth/callback';
const redirectUri = 'https://localhost:3000';
let accessToken = '';

// Endpoint to get Spotify access token
app.get('/login', (req, res) => {
  const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private';
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  try {
    const response = await axiosInstance.post(authOptions.url, authOptions.form, { headers: authOptions.headers });
    accessToken = response.data.access_token;
    res.cookie('accessToken', accessToken, { secure: true, httpOnly: true });
    res.redirect('https://localhost:3000/dashboard');
  } catch (error) {
    console.error('Error fetching token:', error.response?.data || error.message);
    res.status(500).send(error.response?.data || { error: 'Failed to fetch token' });
  }
});

// Endpoint to search for a song
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`;

  try {
    const response = await axiosInstance.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to add a song to a playlist
app.post('/api/playlist/add', async (req, res) => {
  const { playlistId, trackUri } = req.body;
  const addTrackUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUri}`;

  try {
    const response = await axiosInstance.post(addTrackUrl, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Endpoint to get user data
app.get('/me', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json({ error: 'Access token not found' });
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch user data' });
  }
}

);
app.get('/me/player', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching playback state:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch playback state' });
  }
});


app.get('/me/player/devices', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});


  app.get('/api/me/player/currently-playing', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {  
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
    }
  });

  app.get('/api/me/player/recently-played', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {  
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
    }
  });

  app.get('/api/me/tracks', async (req, res) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
    }
  });

  app.put('/api/me/player/pause', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/player/pause';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const response = await axios.put(url, req.body, { headers });
    res.send(response.data);
  });

  app.put('/api/me/player/seek', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/player/seek';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const response = await axios.put(url, req.body, { headers });
    res.send(response.data);
  });

  app.put('/api/me/player/volume', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/player/volume';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const response = await axios.put(url, req.body, { headers });
    res.send(response.data);
  });

  app.put('/api/me/player/play', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const response = await axios.put(url, req.body, { headers });
    res.send(response.data);
  });

  // const options = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./cert.pem')
  // };
  const httpsOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  };


https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

  function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const { config } = require('dotenv');
// const { createServer } = require('https');
// const fs = require('fs/promises');
// const axios = require('axios');
// const querystring = require('querystring');
// const passport = require('passport');
// const session = require('express-session');
// const dotenv = require('dotenv');

// const { createProxyMiddleware } = require('http-proxy-middleware');
// dotenv.config();

// const path = require('path');
// // Spotify API endpoints
// const CLIENT_ID = '1f42356ed83f46cc9ffd35c525fc8541';
// const REDIRECT_URI = 'https://localhost:3000';
// const CLIENT_SECRET = '487ec052888b4917b00665fc65b8df9f';
// const CLIENT_ORIGIN = 'https://localhost:3000' || 'http://localhost:3000';
// const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
// const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
// const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

// // Load environment variables
// config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//   origin: CLIENT_ORIGIN,
//   credentials: true,
// }));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_session_secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Route handlers
// app.get('/auth/login', (req, res) => {
//   const state = generateRandomString(16);
//   const scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state';

//   const auth_query_parameters = new URLSearchParams({
//     response_type: 'code',
//     client_id: CLIENT_ID,
//     scope,
//     redirect_uri: REDIRECT_URI,
//     state,
//   });

//   res.redirect(`${SPOTIFY_AUTH_URL}?${auth_query_parameters.toString()}`);
// });

// app.get('/auth/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(`${process.env.CLIENT_ORIGIN}?login=success`);
// });

// app.post('/refresh_token', async (req, res) => {
//   const refresh_token = req.body.refresh_token;
//   const { data } = await axios.post(SPOTIFY_TOKEN_URL, querystring.stringify({
//     grant_type: 'refresh_token',
//     refresh_token,
//   }), {
//     headers: {
//       'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   res.send(data);
// });

// // Proxy requests to the Spotify API
// app.use('/api', createProxyMiddleware({
//   target: 'https://api.spotify.com',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api': '',
//   },
//   onProxyReq: (proxyReq, req, res) => {
//     if (req.headers.authorization) {
//       proxyReq.setHeader('Authorization', req.headers.authorization);
//     }
//   },
// }));


// app.get('/auth/token', (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ error: 'No access token' });
//   }
//   res.json({ accessToken });
// });

// // Serve static files
// app.use(express.static(path.join(__dirname, '../dist')));
// // Catch-all handler for React routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname,'dist','index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error details:', err);
//   console.error('Stack trace:', err.stack);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
//   });
// });
// const generateRandomString = (length) => {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// app.get('/auth/login', (req, res) => {
//   const state = generateRandomString(16);
//   const scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state';

//   const auth_query_parameters = new URLSearchParams({
//     response_type: 'code',
//     client_id: CLIENT_ID,
//     scope,
//     redirect_uri: REDIRECT_URI,
//     state,
//   });

//   res.redirect(`${SPOTIFY_AUTH_URL}?${auth_query_parameters.toString()}`);
// });

// app.get('/auth/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(`${process.env.CLIENT_ORIGIN}?login=success`);
// });

// app.post('/refresh_token', async (req, res) => {
//   const refresh_token = req.cookies.refresh_token;
//   if (!refresh_token) {
//     return res.status(401).json({ error: 'No refresh token' });
//   }

//   try {
//     const response = await axios.post(SPOTIFY_TOKEN_URL, querystring.stringify({
//       grant_type: 'refresh_token',
//       refresh_token,
//     }), {
//       headers: {
//         'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });

//     if (response.status === 200) {
//       const { accessToken, expires_in } = response.data;
//       res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//       res.json({ accessToken, expires_in });
//     } else {
//       res.status(response.status).json({ error: 'Failed to refresh token' });
//     }
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.use((err, req, res, next) => {
//   console.error('Error details:', err);
//   console.error('Stack trace:', err.stack);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
//   });
// });

// app.use('/spotify', async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ error: 'No access token' });
//   }

//   try {
//     const response = await axios({
//       method: req.method,
//       url: `${SPOTIFY_API_BASE_URL}${req.url}`,
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       data: req.body,
//     });

//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error('Error proxying to Spotify API:', error);
//     console.error('Error details:', error.response?.data);
//     res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
//   }
// });
// app.get('/auth/token', (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ error: 'No access token' });
//   }
//   res.json({ accessToken });
// });

// app.use(express.static('build'));

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// const startServer = async () => {
//   try {
//     const [key, cert] = await Promise.all([
//       fs.readFile('key.pem'),
//       fs.readFile('cert.pem'),
//     ]);

//     const httpsServer = createServer({ key, cert }, app);
//     httpsServer.listen(PORT, () => {
//       console.log(`HTTPS Server running on https://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     console.error('Error details:', error.stack);
//     process.exit(1);
//   }
// };

// startServer();

