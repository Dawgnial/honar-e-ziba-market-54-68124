import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/serviceWorker";
import { cacheManager } from "./utils/cacheManager";
import { initializePerformanceOptimizations } from "./utils/performanceOptimizations";

// Temporarily disable Service Worker to fix loading issues
// if (import.meta.env.PROD) {
//   registerServiceWorker();
// }

// Cleanup expired cache on startup
cacheManager.cleanup();

// Initialize performance optimizations - but only after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);
} else {
  // DOM already loaded
  setTimeout(initializePerformanceOptimizations, 0);
}

// Create a client with optimized caching settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000, // 3 minutes - reduced for fresher data
      gcTime: 15 * 60 * 1000, // 15 minutes - reduced memory usage
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 1; // Only retry once for faster feedback
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false, 
      refetchOnReconnect: true,
      // Request deduplication
      networkMode: 'online',
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
