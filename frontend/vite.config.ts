import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: "0.0.0.0",
    port: 3000, // Change default port to 3000
    https: {
      key: fs.readFileSync('/config/keys/cert.key'),
      cert: fs.readFileSync('/config/keys/cert.crt'),
    },
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true
      }
    },
    allowedHosts: ['joblen.socs.uoguelph.ca']
  },
  test: {
    globals: true,  // This enables the use of global `expect` and `test`
    environment: 'jsdom',
  },
})
