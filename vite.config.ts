import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for Luma Radio.
// Builds a static site (dist/) suitable for Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
