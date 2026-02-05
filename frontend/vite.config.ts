import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      "admniaga.com",
      ".admniaga.com",   // subdomain (aman)
    ],
    proxy: {
      "/api": {
        target: "http://backend:3001",
        changeOrigin: true,
      },
    },
  },
});
