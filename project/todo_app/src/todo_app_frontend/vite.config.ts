import { fileURLToPath, URL } from 'url';
import { defineConfig, type Plugin } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    // EnvironmentPlugin("all", { prefix: "CANISTER_" }),
    // EnvironmentPlugin("all", {prefix: "DFX_"}),
    EnvironmentPlugin("all", { prefix: "CANISTER_" }) as unknown as Plugin,
    EnvironmentPlugin("all", { prefix: "DFX_" }) as unknown as Plugin,
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
});
