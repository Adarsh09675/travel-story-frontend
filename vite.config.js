import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // ensure output folder is dist
  },
  server: {
    port: 5173,
  },
  base: "/", // important for Netlify SPA routing
})
