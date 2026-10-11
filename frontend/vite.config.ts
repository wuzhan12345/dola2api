import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/admin": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/v1": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/health": { target: "http://127.0.0.1:8080", changeOrigin: true },
      "/media": { target: "http://127.0.0.1:8080", changeOrigin: true },
    },
  },
  build: {
    target: ["chrome92", "edge92", "firefox91", "safari15"],
    cssTarget: ["chrome92", "edge92", "firefox91", "safari15"],
    outDir: "dist",
    emptyOutDir: true,
  },
});
