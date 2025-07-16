import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@store': '/src/Store',
      // '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    },
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    hmr: {
      port: 443,
    }
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173
  }
})