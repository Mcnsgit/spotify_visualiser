import express from 'express';
import request from 'request';
import config from '../config.js';

const router = express.Router();

router.get('/', (req, res) => {
  const refresh_token = req.query.token;

  if (!refresh_token) {
    res.status(400).send({ ERROR: 'No token provided.' });
    return;
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(config.client_id + ':' + config.client_secret).toString('base64')
    },
    form: {
      refresh_token,
      grant_type: 'refresh_token'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    } else {
      res.send({ what: 'thefuck' });
    }
  });
});

export default router;
