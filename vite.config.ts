import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /* Two pages: the portfolio and the 404 page, which Vercel serves for unknown addresses. */
  build: isSsrBuild
    ? undefined
    : {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, "index.html"),
            notFound: path.resolve(__dirname, "404.html"),
          },
        },
      },
}));
