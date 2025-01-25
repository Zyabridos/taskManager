import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx'],
  },
  build: {
    outDir: 'public',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.js'),
      output: {
        entryFileNames: 'bundle.js',
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "@/styles/global.css";`,
      },
    },
  },
  server: {
  port: 3000, // Фронтенд
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // URL бэкенда
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''), // Удаление префикса при запросе
    },
  },
},

});
