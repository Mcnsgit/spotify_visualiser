import { createProxyMiddleware } from 'http-proxy-middleware';

app.use('/auth', createProxyMiddleware({ 
  target: 'https://localhost:3001',
  secure: false,
  changeOrigin: true,
}));

app.use('/spotify', createProxyMiddleware({
  target: 'https://localhost:3001',
  secure: false,
  changeOrigin: true,
  pathRewrite: {
    '^/spotify': '/spotify',
  },
}));