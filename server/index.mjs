import dotenv from "dotenv"
import express from "express"
import cors from "cors"
// import bodyParser from "body-parser"

import axios from "axios"
import queryString from 'query-string';
import crypto from 'crypto'


dotenv.config()
const client_id = process.env.VITE_SPOTIFY_CLIENT_ID || '1f42356ed83f46cc9ffd35c525fc8541';
console.log(client_id)
const client_secret = process.env.VITE_SPOTIFY_CLIENT_SECRET;
console.log(client_secret)
const redirectUri = 'http://localhost:3000'; // Ensure this matches your application settings
const PORT =  3001

const app = express()
app.use(express.json())


app.use(cors( {
  origin: 'http://localhost:3000'
}))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', function (req, res) {
  console.log('Received login request');
  const state = crypto.randomBytes(16).toString('hex');

  // Check for Spotify API credentials
  if (!client_id || !client_secret) {
    console.error('Missing Spotify API credentials');
    return res.status(500).send('Spotify credentials missing');
  } else {
    console.log('Spotify credentials received');
  }
  const redirect_uri = 'http://localhost:3000'; // Ensure this matches your application settings

  // Define the state and scope
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
  ];
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true,
    }));
  // Define the redirect URI

  // Redirect to Spotify's authorization page
  console.log('Redirecting to Spotify authorization URL');
});

// Route to handle the callback and exchange the code for tokens
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    });
    const { access_token, refresh_token } = response.data;

    // Redirect to the frontend dashboard with the access token and refresh token as query parameters
    res.redirect(`http://localhost:3000/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.response ? error.response.data : error.message);
    res.status(400).send('Failed to exchange code for tokens');
  }
});
// Route to refresh the access token
app.post('/refresh', async (req, res) => {
  const refresh_token = req.body.refresh_token;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    res.status(400).send('Failed to refresh access token');
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const type = req.query.type;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!type || !['track', 'artist', 'album'].includes(type)) {
    return res.status(400).json({ error: 'Invalid or missing type parameter' });
  }

  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q: query, type },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error?.message || 'Internal Server Error' });
  }
});

const generateAuthHeader = () => {
  const { client_id, client_secret } = process.env;
  return `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
};

const getAccessToken = async () => {
  try {
    const authResponse = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': generateAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    return authResponse.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to get access token');
  }
};

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});