import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  https: {
    key: 'key.pem',
    cert: 'cert.pem',
  },
  server: { // Moved host and port configuration under server
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: true, // Changed to true for better security
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:3000');
          });
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', '@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three'],
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          threeFiber: ['@react-three/fiber', '@react-three/drei'], // Grouped Three.js related libraries
        },
      },
    },
  },
  assetsInclude: [
    "**/*.{mp3,mp4,png,jpg,jpeg,gif,svg,webp}" // More concise asset include pattern
  ],
});