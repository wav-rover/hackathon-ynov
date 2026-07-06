import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/pets": "http://localhost:3000",
      "/veterinary-clinics": "http://localhost:3000",
      "/clinics": "http://localhost:3000",
    },
  },
})
