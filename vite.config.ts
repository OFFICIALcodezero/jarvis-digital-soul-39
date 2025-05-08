
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// Only import componentTagger conditionally to avoid build errors
// when the package isn't available

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Try to import componentTagger only in development mode
  let componentTaggerPlugin = null;
  if (mode === 'development') {
    try {
      const { componentTagger } = require("lovable-tagger");
      componentTaggerPlugin = componentTagger();
    } catch (e) {
      console.warn("Could not load lovable-tagger, continuing without it");
    }
  }

  return {
    plugins: [
      react(),
      mode === 'development' && componentTaggerPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: "::",
      port: 8080
    }
  }
})
