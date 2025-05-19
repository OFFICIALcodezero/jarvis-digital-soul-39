
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, className }) => {
  return (
    <Link 
      to={to}
      className={cn(
        "text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors",
        className
      )}
    >
      {label}
    </Link>
  );
};

interface MobileNavProps {
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={cn("md:hidden", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-white/10 p-4 z-50 animate-fade-in">
          <div className="flex flex-col space-y-2">
            <NavItem to="/" label="Home" />
            <NavItem to="/startup" label="Get Started" />
            <NavItem to="/interface" label="Interface" />
            <NavItem to="/features" label="Features" />
            <NavItem to="/about" label="About" />
            
            <div className="pt-4">
              <Button className="w-full bg-jarvis hover:bg-jarvis/90 text-white">
                Launch JARVIS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DesktopNav: React.FC = () => {
  return (
    <div className="hidden md:flex space-x-4 items-center">
      <NavItem to="/" label="Home" />
      <NavItem to="/startup" label="Get Started" />
      <NavItem to="/interface" label="Interface" />
      <NavItem to="/features" label="Features" />
      <NavItem to="/about" label="About" />
    </div>
  );
};
