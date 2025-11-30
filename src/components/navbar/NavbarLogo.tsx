import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarLogoProps {
  className?: string;
}

const NavbarLogo = ({ className }: NavbarLogoProps) => {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <Link to="/" className="flex items-center space-x-2 space-x-reverse">
        <img src="/images/logo.png" alt="ایرولیا شاپ" className="h-8 w-auto" />
        <span className="text-2xl font-black text-terracotta" style={{ fontWeight: 900 }}>همراه هنرمندان سفال و سرامیک</span>
      </Link>
    </div>
  );
};

export default NavbarLogo;
