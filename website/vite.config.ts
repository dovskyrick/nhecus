import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Two pages, one build:
//   /         -> public site   (index.html)
//   /admin/   -> back-office   (admin/index.html)
// BASE_PATH is only set for GitHub Pages ("/<repo>/"); Firebase Hosting uses "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // firebase SDK is big; fine for this site
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
