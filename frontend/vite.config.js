import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Ép Vite hiểu global chính là window
    global: 'window',
  },
})