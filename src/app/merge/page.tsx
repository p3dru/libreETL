'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import MergeConfigurator from '@/components/MergeConfigurator';
import { GitMerge, Loader } from 'lucide-react';

function MergeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optional: /merge?leftId=xxx  (pre-selects a dataset from the History page)
  const initialLeftId = searchParams.get('leftId') ?? undefined;

  const handleMergeComplete = async (result: Dataset) => {
    try {
      await db.datasets.add(result);
      // Do not redirect, let the configurator show Step 4
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
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Merge Datasets</h2>
        </div>
        <p style={{ color: '#94a3b8', maxWidth: '600px' }}>
          Combine two saved datasets using a SQL-style join. The merged result will be saved
          to your history and opened in the Analyzer.
        </p>
      </div>

      {/* 3-step wizard */}
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: '#94a3b8' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin{100%{transform:rotate(360deg)}}`}} />
        Loading…
      </div>
    }>
      <MergeContent />
    </Suspense>
  );
}
