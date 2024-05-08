/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
  server: {
    proxy: {
      "/api": {
        //target: "http://10.10.102.38:8080",
         target: "http://10.10.102.97:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace("^/api/", ""),
      },
    },
  },
});
