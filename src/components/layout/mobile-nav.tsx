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
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-stone-100">
          <span className="font-playfair text-xl font-bold text-green-800">
            Menu
          </span>
          <button 
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 focus:outline-none rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-6">
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xl font-medium text-stone-800 hover:text-green-700 transition-colors"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-stone-100">
          <Link
            href="/book"
            className="block w-full text-center bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-lg font-medium transition-colors shadow-sm text-lg"
            onClick={onClose}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
