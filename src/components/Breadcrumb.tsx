import { ChevronLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  return (
    <nav 
      className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
      aria-label="breadcrumb"
    >
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
        aria-label="خانه"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronLeft className="h-4 w-4" />
          {item.isActive ? (
            <span className="text-primary font-medium" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link 
              to={item.url} 
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};