import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const Layout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  className = "" 
}: LayoutProps) => {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-background ${className}`}>
        {showNavbar && <Navbar />}
        <main className={`flex-1 ${showNavbar ? 'pt-14 sm:pt-16 lg:pt-20' : ''}`}>
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default Layout;