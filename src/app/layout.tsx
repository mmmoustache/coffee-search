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
        <a
          href="#content"
          className="skip-to-content | font-body absolute top-2 left-2 z-70 -m-px h-px w-px overflow-hidden border-0 bg-white p-0 whitespace-nowrap focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:p-5 focus:whitespace-normal"
        >
          Skip to content
        </a>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
