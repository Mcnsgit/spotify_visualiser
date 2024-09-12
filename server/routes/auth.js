import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const auth_id = Math.random().toString(36).slice(5, 11);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ auth_id }));
});

export default router;
