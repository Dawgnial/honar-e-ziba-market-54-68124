import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button when page is scrolled down and calculate scroll progress
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    setScrollProgress(scrollPercent);
    setIsVisible(scrollTop > 200);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Backdrop blur overlay when visible */}
      <div 
        className={cn(
          "fixed inset-0 pointer-events-none transition-opacity duration-300 z-40",
          isVisible ? "opacity-20" : "opacity-0"
        )}
      />
      
      {/* Main scroll button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out scroll-to-top-mobile",
          "transform",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-16 opacity-0 scale-75 pointer-events-none"
        )}
      >
        {/* Progress ring */}
        <div className="relative">
          <svg
            className="w-16 h-16 transform -rotate-90"
            viewBox="0 0 64 64"
          >
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="hsl(var(--border))"
              strokeWidth="4"
              fill="none"
              className="opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-300 ease-out drop-shadow-sm"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Button */}
          <button
            onClick={scrollToTop}
            className={cn(
              "absolute inset-2 rounded-full",
              "bg-background/90 hover:bg-background border-2 border-primary/20",
              "backdrop-blur-md shadow-lg hover:shadow-xl",
              "flex items-center justify-center",
              "transition-all duration-300 ease-out",
              "hover:scale-110 hover:border-primary/40",
              "active:scale-95",
              "group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
              "text-primary hover:text-primary"
            )}
            aria-label="بازگشت به بالای صفحه"
          >
            <ChevronUp 
              className={cn(
                "h-6 w-6 transition-transform duration-300",
                "group-hover:-translate-y-0.5 group-active:translate-y-0"
              )}
              strokeWidth={2.5} 
            />
          </button>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-primary/30 rounded-full",
                "animate-pulse",
                isVisible && scrollProgress > 10 ? "opacity-100" : "opacity-0"
              )}
              style={{
                top: `${20 + i * 15}%`,
                right: `${15 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .scroll-to-top-mobile {
              bottom: 1.5rem !important;
              right: 1rem !important;
            }
            
            .scroll-to-top-mobile svg {
              width: 3.5rem !important;
              height: 3.5rem !important;
            }
          }
        `
      }} />
    </>
  );
};

export default ScrollToTop;