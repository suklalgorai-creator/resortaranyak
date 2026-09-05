import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="overflow-x-hidden font-sans antialiased min-h-screen flex flex-col relative">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
