import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress',
      threshold: 1024,
    }),
    visualizer({ open: true }),
  ],
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit', 'axios',
      'moment', 'chartjs', 'file-saver'
    ],
  },
  esbuild: {
    ignoreAnnotations: true,
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
    target: 'esnext',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          vendor: ['axios', 'moment', 'chartjs', 'react-toastify'],
        },
      },
    },
  },
});
