'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import DataPreviewTable from '@/components/DataPreviewTable';
import { Dataset } from '@/types/dataset';
import { ArrowRight } from 'lucide-react';
import { db } from '@/core/db';
import { useI18n } from '@/core/i18n/I18nContext';

export default function UploadPage() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  const handleDatasetLoaded = (loadedDataset: Dataset) => {
    setDataset(loadedDataset);
  };

  const handleSaveAndAnalyze = async () => {
    if (!dataset) return;
    setIsSaving(true);
    try {
      await db.datasets.put(dataset);
      router.push(`/analyzer?id=${dataset.id}`);
    } catch (error) {
      console.error("Failed to save dataset", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <div style={{ paddingBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('upload.title')}</h2>
        <p style={{ color: '#94a3b8' }}>{t('upload.subtitle')}</p>
      </div>

      {!dataset ? (
        <FileUploader onDatasetLoaded={handleDatasetLoaded} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
              <span style={{ fontWeight: 500 }}>{t('upload.loaded')}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setDataset(null)}
                className="btn btn-secondary"
                disabled={isSaving}
              >
                {t('upload.another')}
              </button>
              <button
                onClick={handleSaveAndAnalyze}
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? t('upload.saving') : t('upload.analyze')} <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <DataPreviewTable dataset={dataset} />
        </div>
      )}
    </div>
  );
}
