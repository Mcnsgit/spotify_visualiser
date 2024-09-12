import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isDev = mode === 'development';

  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
            chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', '@chakra-ui/react'],
    },
    ...(isDev && {
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
    }),
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