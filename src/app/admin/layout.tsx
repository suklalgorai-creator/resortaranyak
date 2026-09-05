'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '??' },
  { label: 'Rooms', href: '/admin/rooms', icon: '???' },
  { label: 'Bookings', href: '/admin/bookings', icon: '??' },
  { label: 'Gallery', href: '/admin/gallery', icon: '???' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: '??' },
  { label: 'Settings', href: '/admin/settings', icon: '??' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#111] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white glass-card border-r border-stone-200 dark:border-stone-800 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-stone-200 dark:border-stone-800">
          <Link href="/admin/dashboard" className="block">
            <h1 className="font-serif text-xl font-bold text-green-800 dark:text-green-400">Resort Arranyak</h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Admin Panel</p>
          </Link>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={lex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all {
                  isActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200 dark:border-stone-800">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
            ? Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white glass-card border-b border-stone-200 dark:border-stone-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-800 dark:text-green-400 font-bold text-sm">A</div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Admin</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">admin@arranyak.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
