import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import { ThemeProvider } from '@/core/theme/ThemeContext';
import { I18nProvider } from '@/core/i18n/I18nContext';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

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
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider>
          <ThemeProvider>
            <Header />
            <main className="app-main">
              {children}
            </main>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
