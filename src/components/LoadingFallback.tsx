/**
 * Loading Fallback Component
 * Used as Suspense fallback for lazy-loaded routes
 */

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground animate-pulse">در حال بارگذاری...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
