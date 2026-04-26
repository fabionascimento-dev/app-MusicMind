import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Em desenvolvimento, o proxy evita CORS: o browser fala com o Vite
 * e o Vite reencaminha /api para a API Node.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true,
      },
    },
  },
});
