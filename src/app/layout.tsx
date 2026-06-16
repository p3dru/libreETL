import type { Metadata } from 'next';
import './globals.css';

import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'DataQ - Premium Dataset Diagnosis & ETL',
  description: 'Upload, analyze, and transform your datasets with a visual ETL pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="app-main">
          {children}
        </main>
      </body>
    </html>
  );
}
