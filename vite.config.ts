
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "./vite-plugins/component-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: "react",
      babel: {
        plugins: [],
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('firebase')) return 'vendor-firebase';
            return 'vendor';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@babel/plugin-transform-react-jsx'
    ]
  },
  server: {
    port: 5174,
    host: true
  }
}));
