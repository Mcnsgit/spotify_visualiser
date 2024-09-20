import express from 'express';
import { ValidateToken } from '../middleware/spotifyApiMiddleware.js';

import { login } from '../routes/login.js';
import { callback } from '../routes/callback.js';
import { me } from '../routes/me.js';

import { dashboard } from '../../src/screens/Dashboard/Dashboard.jsx';  


const router = express.Router();

router.use('/login', login);
router.use('/callback', callback);
router.use('/me', ValidateToken,  me);
router.use('/play', ValidateToken, play);
router.use('/dashboard', ValidateToken, dashboard);

export default router;  