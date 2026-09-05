'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import WhatsAppButton from '@/components/shared/whatsapp-button';
import CallButton from '@/components/shared/call-button';
import { Toaster } from 'sonner';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <CallButton />
      <Toaster position="top-center" />
    </>
  );
}