
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarLogoProps {
  className?: string;
}

const NavbarLogo = ({ className }: NavbarLogoProps) => {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <Link to="/" className="flex items-center space-x-2 space-x-reverse">
        <img src="/lovable-uploads/02981d52-21f8-4f3c-8650-579882fa62e7.png" alt="ایرولیا شاپ" className="h-8 w-auto" />
        <span className="text-2xl font-bold text-terracotta font-estedad">همراه هنرمندان سفال و سرامیک</span>
      </Link>
    </div>
  );
};

export default NavbarLogo;
