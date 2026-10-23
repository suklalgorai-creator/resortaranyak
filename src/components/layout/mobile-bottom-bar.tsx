'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BedDouble, Image, CalendarCheck, Phone } from 'lucide-react';

const mobileNavItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Rooms', href: '/rooms', icon: BedDouble },
  { label: 'Gallery', href: '/gallery', icon: Image },
  { label: 'Book', href: '/book', icon: CalendarCheck, highlight: true },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-stone-200/50 dark:border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isHighlight = item.highlight;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                isHighlight
                  ? 'relative -mt-5'
                  : ''
              }`}
            >
              {isHighlight ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center mb-0.5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-gold">{item.label}</span>
                </div>
              ) : (
                <>
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-forest dark:text-gold'
                      : 'text-stone-400 dark:text-stone-500'
                  }`} />
                  <span className={`text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'text-forest dark:text-gold'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
