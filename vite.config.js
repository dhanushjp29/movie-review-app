import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const tmdbProxy = {
  "/api/tmdb": {
    target: "https://api.themoviedb.org/3",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: tmdbProxy },
  preview: { proxy: tmdbProxy },
});
