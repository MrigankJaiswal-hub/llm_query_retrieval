import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",   // ✅ ensures production build goes to frontend/dist
  },
  server: {
    port: 5173,       // ✅ dev server runs on 5173
    proxy: {
      "/api": {
        target: "http://localhost:8000", // ✅ forwards API requests to FastAPI
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"], // ✅ keeps your pdf.worker fix
  },
});

