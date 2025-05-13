
/// <reference types="vite/client" />

// Ensure React is properly defined in the global scope
import React from 'react';
import ReactDOM from 'react-dom';

declare global {
  // Make sure React is available globally
  const React: typeof React;
  const ReactDOM: typeof ReactDOM;
  
  // Additional type declarations for project-specific needs
  interface Window {
    supabase: any;
  }
}

// This helps TypeScript understand JSX without needing to modify tsconfig
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export {};
