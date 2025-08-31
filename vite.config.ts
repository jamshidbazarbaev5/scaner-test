import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig({
  plugins: [react(),
    visualizer({ open: true }),],
  css: {
    postcss: './postcss.config.js',
  },
  base: '/',
  server: {

  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})