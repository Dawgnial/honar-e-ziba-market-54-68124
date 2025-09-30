import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRouteChange = () => {
  const location = useLocation();
  const previousPathRef = useRef<string>();

  useEffect(() => {
    // Only scroll to top on forward navigation, not on back/forward button
    // Check if this is a back/forward navigation by comparing with session storage
    const isBackForwardNavigation = window.performance.navigation.type === 2 ||
      (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'back_forward';
    
    if (!isBackForwardNavigation && previousPathRef.current !== location.pathname) {
      // Save scroll position before navigating
      if (previousPathRef.current) {
        sessionStorage.setItem(
          `scroll_${previousPathRef.current}`,
          window.scrollY.toString()
        );
      }

      // Only scroll to top for new forward navigation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    } else {
      // Restore scroll position for back navigation
      const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
      if (savedPosition) {
        // Delay to ensure content is loaded
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            left: 0,
            behavior: "instant",
          });
        }, 0);
      }
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;