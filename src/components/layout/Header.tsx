'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  showAdminLink?: boolean;
  transparent?: boolean;
}

export default function Header({ 
  showBackButton = false, 
  backUrl = "/", 
  showAdminLink = false,
  transparent = false 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 border-b ${
        transparent 
          ? 'bg-white/80 backdrop-blur-md border-gray-100' 
          : 'bg-white shadow-sm border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gray-900"
            >
              <span className="text-coral-primary">Tech</span>Orbitze
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* {showAdminLink && (
              <Link 
                href="/admin"
                className="text-gray-700 hover:text-coral-primary transition-colors font-medium"
              >
                📝 Admin
              </Link>
            )}
             */}
            {showBackButton && (
              <Link 
                href={backUrl}
                className="flex items-center gap-2 text-gray-700 hover:text-coral-primary transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Link>
            )}

            {!showBackButton && (
              <nav className="flex space-x-8">
                {['Services', 'Expertise', 'Clients', 'Careers', 'Blog', 'Contact'].map((item) => (
                  <motion.a
                    key={item}
                    whileHover={{ color: '#ff6b47' }}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-coral-primary transition-colors font-medium"
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>
            )}

            {!showBackButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-coral-primary text-white px-6 py-2 rounded-full font-medium hover:bg-coral-secondary transition-colors"
              >
                Get Started
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-100 py-4"
          >
            <div className="flex flex-col space-y-4 px-4">
              {/* {showAdminLink && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-coral-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📝 Admin
                </Link>
              )} */}
              
              {showBackButton ? (
                <Link
                  href={backUrl}
                  className="flex items-center gap-2 text-gray-700 hover:text-coral-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Link>
              ) : (
                <>
                  {['Services', 'Expertise', 'Clients', 'Careers', 'Blog', 'Contact'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-700 hover:text-coral-primary transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <button className="bg-coral-primary text-white px-6 py-2 rounded-full font-medium hover:bg-coral-secondary transition-colors w-full mt-4">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
