import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://d0a9-82-115-47-37.ngrok-free.app',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
