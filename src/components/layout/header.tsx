'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navigationLinks } from '@/config/navigation';
import MobileNav from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'glass shadow-sm py-4 dark:bg-[#1E1E1E]/80' 
            : 'bg-white dark:bg-[#1E1E1E] py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair text-2xl font-bold text-forest dark:text-stone-200 tracking-tight">
              Resort Arranyak
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-stone-600 dark:text-stone-300 hover:text-gold dark:hover:text-gold font-medium transition-colors text-sm uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/book" 
              className="bg-gold hover:bg-gold/90 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm"
            >
              Book Now
            </Link>
          </div>
          
          <button 
            className="lg:hidden p-2 text-stone-600 dark:text-stone-300 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={navigationLinks}
      />
    </>
  );
}
