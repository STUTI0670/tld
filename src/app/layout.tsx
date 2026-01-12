import type { Metadata } from 'next';
import './globals.css';
import { DebtProvider } from '@/contexts/debt-context';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/app-header';

export const metadata: Metadata = {
  title: 'Time Debt Ledger',
  description: 'An application to track and repay time debt.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <DebtProvider>
          <div className="flex flex-col h-full">
            <AppHeader />
            {children}
          </div>
          <Toaster />
        </DebtProvider>
      </body>
    </html>
  );
}
