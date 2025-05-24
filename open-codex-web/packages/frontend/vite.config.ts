import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on port 3000
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:3001', // Backend runs on port 3001
        changeOrigin: true,
      },
    },
  },
})
