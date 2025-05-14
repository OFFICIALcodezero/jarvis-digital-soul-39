
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

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
    // Add minify: false to speed up build
    minify: false,
    // Limit the number of chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create fewer chunks by grouping node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('firebase')) return 'vendor-firebase';
            return 'vendor'; // Group all other dependencies
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@babel/plugin-transform-react-jsx'
    ]
  },
  server: {
    host: "::",
    port: 8080
  }
}))
