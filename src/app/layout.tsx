import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import WhatsAppButton from '@/components/shared/whatsapp-button';
import CallButton from '@/components/shared/call-button';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Resort Arranyak | Premium Nature Resort near Ghatsila',
  description: 'Experience nature at its finest at Resort Arranyak. A premium forest resort located near Ghatsila, Jharkhand offering luxurious stays, organic dining, and nature trails.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="overflow-x-hidden font-sans antialiased min-h-screen flex flex-col relative">`n<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CallButton />
        <Toaster position="top-center" />
      </ThemeProvider>`n</body>
    </html>
  );
}
