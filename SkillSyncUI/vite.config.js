import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to your Spring Boot backend so you avoid CORS in dev
    proxy: {
      '/api': {
       target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
});
