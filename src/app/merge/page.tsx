'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import MergeConfigurator from '@/components/MergeConfigurator';
import { GitMerge, Loader } from 'lucide-react';
import { useI18n } from '@/core/i18n/I18nContext';

function MergeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const initialLeftId = searchParams.get('leftId') ?? undefined;

  const handleMergeComplete = async (result: Dataset) => {
    try {
      await db.datasets.add(result);
    } catch (e) {
      console.error('Failed to save merged dataset:', e);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem 0' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
            background: 'rgba(99,102,241,0.15)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GitMerge size={22} />
          </div>
          <h2 className="font-serif" style={{ fontSize: '2rem', margin: 0 }}>{t('merge.title')}</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
          {t('merge.subtitle')}
        </p>
      </div>

      {/* 4-step wizard */}
      <MergeConfigurator
        onMergeComplete={handleMergeComplete}
        initialLeftId={initialLeftId}
      />
    </div>
  );
}

export default function MergePage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-secondary)' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin{100%{transform:rotate(360deg)}}`}} />
        Loading…
      </div>
    }>
      <MergeContent />
    </Suspense>
  );
}
