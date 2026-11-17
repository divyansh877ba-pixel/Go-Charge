import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  server: {
    allowedHosts: true,
    host: true,
    port: 3000,
  },
  preview: {
    allowedHosts: true,
    host: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          maplibre: ['maplibre-gl'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
