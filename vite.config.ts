import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['fs', 'path', 'url']
    }
  },
  define: {
    'global': 'globalThis',
    'process.env.REACT_APP_GBOX_API_KEY': JSON.stringify(process.env.REACT_APP_GBOX_API_KEY),
    'process.env.GBOX_API_KEY': JSON.stringify(process.env.GBOX_API_KEY),
    'process.env.GBOX_BASE_URL': JSON.stringify(process.env.GBOX_BASE_URL),
    'process.env.GRU_BASE_URL': JSON.stringify(process.env.GRU_BASE_URL),
    'process.env.GRU_USER_ID': JSON.stringify(process.env.GRU_USER_ID),
    'process.env.GRU_USER_NAME': JSON.stringify(process.env.GRU_USER_NAME),
    'process.env.GBOX_INSTANCE_ID': JSON.stringify(process.env.GBOX_INSTANCE_ID)
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://gbox.ai',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
