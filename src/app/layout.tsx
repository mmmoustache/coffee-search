import type { Metadata } from 'next';
import { Footer } from '@/components/Footer/Footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Coffee recommendation generator',
  description: 'A basic app to recommend coffee styles',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
