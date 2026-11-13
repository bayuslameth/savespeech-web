import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Konfigurasi Vite SAVESPEECH - Phase 10: Optimasi Performa & Chunk Splitting
 * Memisahkan vendor inti (React, React Router, Framer Motion) ke dalam chunk terpisah
 * agar ukuran file individual optimal (<500 kB) dan browser dapat melakukan caching efisien.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Target browser modern untuk efisiensi output JS
    target: "esnext",
    // Strategi pemecahan chunk (manual chunking)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Chunk 1: Inti React & DOM
            if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
              return "vendor-react";
            }
            // Chunk 2: Navigasi Routing
            if (id.includes("react-router") || id.includes("@remix-run")) {
              return "vendor-router";
            }
            // Chunk 3: Animasi & Gestur
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
          }
        },
      },
    },
  },
});
