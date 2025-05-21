
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, User, Home, Building, Heart, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const mainNavItems = [
    { name: 'Buy', href: '/properties?status=sale' },
    { name: 'Rent', href: '/properties?status=rent' },
    { name: 'Agents', href: '/agents' },
    { name: 'Mortgage', href: '/mortgage-calculator' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold text-teal-700 font-poppins">
              BRICK<span className="text-teal-500">HIVE</span>
            </span>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/properties">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link to="/add-property">
                  <Building className="mr-2 h-4 w-4" />
                  Post Property
                </Link>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User className="h-4 w-4 mr-1" />
                      {user?.name?.split(' ')[0]}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User className="h-4 w-4 mr-1" />
                      Login
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="w-full">Sign up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}

          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white p-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="border-b border-gray-100 py-3 text-sm font-medium"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/properties"
              className="border-b border-gray-100 py-3 text-sm font-medium flex items-center"
              onClick={toggleMenu}
            >
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </Link>
            <Link
              to="/add-property"
              className="border-b border-gray-100 py-3 text-sm font-medium flex items-center"
              onClick={toggleMenu}
            >
              <Building className="mr-2 h-4 w-4" />
              Post Property
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="border-b border-gray-100 py-3 text-sm font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="border-b border-gray-100 py-3 text-sm font-medium w-full text-left flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border-b border-gray-100 py-3 text-sm font-medium"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border-b border-gray-100 py-3 text-sm font-medium"
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
