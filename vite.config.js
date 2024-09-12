import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Get the __filename and __dirname variables in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define Vite configuration
export default({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  console.log('process.env', process.env);
  //import.meta.env.VITE_CLIENT_ID;
  //import.meta.env.VITE_CLIENT_SECRET;
  //import.meta.env.VITE_REDIRECT_URI;

  return defineConfig({
    
  
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem')),
    },
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'https://localhost:3000');
          });
        },
      }
    },
  },
  assetsInclude: [
    "**/*.mp3",
    "**/*.mp4",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.webp"
  ],
});
};
