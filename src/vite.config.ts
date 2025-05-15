
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Try to import plugins only in development mode
  let componentTaggerPlugin = null;
  let reactPlugin = null;
  
  try {
    // Try to import React plugin (should be available now)
    const react = require('@vitejs/plugin-react');
    reactPlugin = react.default();
    
    // Only try to load the tagger in development mode
    if (mode === 'development') {
      try {
        const { componentTagger } = require("lovable-tagger");
        componentTaggerPlugin = componentTagger();
      } catch (e) {
        console.warn("Could not load lovable-tagger, continuing without it");
      }
    }
  } catch (e) {
    console.warn("Could not load plugins, continuing with minimal config");
  }

  return {
    plugins: [
      reactPlugin,
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
