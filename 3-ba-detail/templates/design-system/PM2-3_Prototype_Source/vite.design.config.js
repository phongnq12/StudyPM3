/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Trang Design System PM2 — build riêng ra dist-design.
 * Dùng CHÍNH component trong src (alias @), nên Prototype đổi control là trang Design System đổi theo. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  publicDir: path.resolve(__dirname, 'design', 'public'),
  build: { outDir: 'dist-design', emptyOutDir: true, rollupOptions: { input: path.resolve(__dirname, 'design.html') } },
  server: { port: 5177, open: '/design.html' },
});
