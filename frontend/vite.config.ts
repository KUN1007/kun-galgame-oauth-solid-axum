import path from 'path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), solid()],
  server: {
    host: '127.0.0.1',
    port: 1315,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1314',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '~': path.resolve(__dirname, './src')
    }
  }
})
