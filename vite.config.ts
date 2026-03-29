import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/data': resolve(__dirname, 'src/data'),
      '@/ui': resolve(__dirname, 'src/ui')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
