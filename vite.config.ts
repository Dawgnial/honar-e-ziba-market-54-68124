import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aggressive code splitting for maximum performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI libraries - split by usage
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          // Form handling
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms';
          }
          // Data fetching
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Heavy libraries that can be lazy loaded
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          if (id.includes('recharts')) {
            return 'charts';
          }
          // PDF and canvas - rarely used
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'pdf-utils';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // No source maps in production
    sourcemap: false,
    // Aggressive minification
    minify: 'esbuild',
    target: 'es2015',
    // CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096,
    // Reduce CSS size
    cssMinify: true,
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: ['framer-motion', 'recharts', 'jspdf', 'html2canvas'],
  },
  // Esbuild optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
}));
