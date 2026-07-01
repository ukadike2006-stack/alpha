import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ALPHA Platform — African Entrepreneurship Ecosystem',
  description:
    'Connecting African early-stage founders with funding, investors, and mentors.',
  keywords: 'Africa, entrepreneurship, funding, startup, Nigeria, TEF',
  openGraph: {
    title: 'ALPHA Platform',
    description: 'Empowering African founders to access funding and grow.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
