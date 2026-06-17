'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import { QualityReport } from '@/types/quality';
import { calculateQualityScore } from '@/core/analyzer/calculateQualityScore';
import QualityScoreCard from '@/components/QualityScoreCard';
import ColumnProfileCard from '@/components/ColumnProfileCard';
import { exportToCsv } from '@/core/exporters/exportCsv';
import { exportToXlsx } from '@/core/exporters/exportXlsx';
import { ArrowLeft, ArrowRight, Loader, Download, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/core/i18n/I18nContext';

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { t } = useI18n();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [report, setReport] = useState<QualityReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push('/upload');
      return;
    }

    const loadAndAnalyze = async () => {
      try {
        const data = await db.datasets.get(id);
        if (!data) {
          router.push('/upload');
          return;
        }
        setDataset(data);
        const result = calculateQualityScore(data);
        setReport(result);
      } catch (error) {
        console.error("Error analyzing dataset", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndAnalyze();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader size={48} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem' }}>{t('analyzer.loading.title')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t('analyzer.loading.subtitle')}</p>
        <style dangerouslySetInnerHTML={{__html: `
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (!dataset || !report) return null;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('analyzer.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('analyzer.subtitle')} <strong>{dataset.name}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/upload" className="btn btn-secondary" title={t('analyzer.back')}>
            <ArrowLeft size={18} /> {t('analyzer.back')}
          </Link>
          <button className="btn btn-secondary" onClick={() => exportToCsv(dataset)} title="Download CSV">
            <Download size={18} />
          </button>
          <button className="btn btn-secondary" onClick={() => exportToXlsx(dataset)} title="Download Excel" style={{ color: '#10b981', borderColor: '#10b981' }}>
            <FileSpreadsheet size={18} />
          </button>
          <Link href={`/pipeline?id=${dataset.id}`} className="btn btn-primary">
            {t('analyzer.buildPipeline')} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <QualityScoreCard report={report} />
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('analyzer.columnProfiles')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {report.columns.map((colProfile) => (
          <ColumnProfileCard key={colProfile.column} profile={colProfile} />
        ))}
      </div>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <AnalyzerContent />
    </Suspense>
  );
}
