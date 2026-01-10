import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const target = "http://127.0.0.1:8787";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // canonical
      "/api": { target, changeOrigin: true },

      // UI currently calls these at root — rewrite them to the server’s /api/* routes
      "/witness": {
        target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/witness\b/, "/api/witness"),
      },
      "/ledger": {
        target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ledger\b/, "/api/ledger"),
      },
      "/progress": {
        target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/progress\b/, "/api/progress"),
      },

      // if you also call /mirror/* directly
      "/mirror": { target, changeOrigin: true },
    },
  },
});
