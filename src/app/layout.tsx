import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import { Toaster } from 'sonner'

import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import ClientSocketWrapper from '@/components/client-socket-wrapper';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gig Worker',
  description: 'A platform that connects gig workers with flexible, on-demand job opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <ClientSocketWrapper />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
