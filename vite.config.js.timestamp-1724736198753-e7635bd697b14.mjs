// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises'; // Use promises for async file operations
import path from 'path';

const sslKeyPath = path.resolve(__dirname, 'ssl/key.pem');
const sslCertPath = path.resolve(__dirname, 'ssl/cert.pem');

const viteConfig = defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: await fs.readFile(sslKeyPath),
      cert: await fs.readFile(sslCertPath),
    },
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:3000');
          });
        },
      },
    },
  },
  assetsInclude: [
    '**/*.{mp3,mp4,png,jpg,jpeg,gif,svg,webp}' // Simplified asset pattern
  ],
});

export default viteConfig;