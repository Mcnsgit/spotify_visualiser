import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      'fs': 'false',
      'os': 'false',
      'path': 'false',
    },
  },
  plugins: [react()],
  https: {
    key: 'key.pem',
    cert: 'cert.pem',
  },
  base: './',
  server: {
    port: 3000,
    proxy: {
      // Define the path(s) to proxy
      '/api': {
        target: 'http://localhost:3001',  // Backend API
        changeOrigin: true,
        secure: false,
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