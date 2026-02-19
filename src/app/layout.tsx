import type { Metadata } from 'next';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
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
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
