'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={"fixed inset-0 z-50 lg:hidden transition-all duration-300 "}>
      <div 
        className={"fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 "}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className={"fixed top-0 right-0 h-full w-full max-w-sm bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-300 transform "}
      >
        <div className="p-6 flex items-center justify-between border-b border-stone-200/50 dark:border-stone-800/50">
          <span className="font-playfair text-2xl font-bold text-forest dark:text-stone-200">
            Menu
          </span>
          <button 
            onClick={onClose}
            className="p-3 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white focus:outline-none rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6">
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-2xl font-medium text-stone-800 dark:text-stone-200 hover:text-gold dark:hover:text-gold transition-colors py-2 border-b border-stone-200/30 dark:border-stone-800/30"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-stone-200/50 dark:border-stone-800/50 pb-8">
          <Link
            href="/book"
            className="block w-full text-center bg-gold hover:bg-gold-light text-white py-4 rounded-xl font-medium transition-colors shadow-lg text-xl"
            onClick={onClose}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
