import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo at /Task-Manager-/ (not domain root),
  // so all built asset paths need this prefix. If you deploy elsewhere
  // (Vercel/Netlify) at the domain root, change this back to '/'.
  base: '/Task-Manager-/',
  server: {
    port: 5173,
  },
});
