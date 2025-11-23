import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, cart } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Industries', href: '/industries' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  // Calculate total items in cart
  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#0A1F44]">
              GIVORA
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-[#C9A227]'
                    : 'text-[#0A1F44] hover:text-[#C9A227]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
               <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative text-[#0A1F44]">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C9A227] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="text-sm text-[#0A1F44] hover:underline font-medium">
                  My Profile
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#0A1F44]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#C9A227]'
                        : 'text-[#0A1F44] hover:text-[#C9A227]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user && (
                  <Link 
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-sm font-medium text-[#0A1F44]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart ({cartItemCount})
                  </Link>
                )}

                {user ? (
                  <>
                    <Link 
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-[#0A1F44]"
                    >
                      My Profile
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white w-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;