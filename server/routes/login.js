import express from 'express';
import querystring from 'querystring';
import config from '../config.js';

const router = express.Router();

router.get('/', (req, res) => {
  const auth_id = req.query.auth_id;
  const query = querystring.stringify({
    response_type: 'code',
    client_id: config.client_id,
    scope: config.scope,
    redirect_uri: config.redirect_uri,
    state: auth_id
  });

  res.cookie(config.state_key, auth_id);
  res.redirect('https://accounts.spotify.com/authorize?' + query);
});

export default router;
