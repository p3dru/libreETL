import type { Metadata } from 'next';
import './globals.css';

import Header from '@/components/Header';
import { ThemeProvider } from '@/core/theme/ThemeContext';
import { I18nProvider } from '@/core/i18n/I18nContext';

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
    <html lang="en" suppressHydrationWarning>
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
