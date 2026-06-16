'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import { TransformationStep, TransformationStepSchema } from '@/types/pipeline';
import { exportToCsv } from '@/core/exporters/exportCsv';
import { exportToJsonReport } from '@/core/exporters/exportJson';
import { exportToXlsx } from '@/core/exporters/exportXlsx';
import DataPreviewTable from '@/components/DataPreviewTable';
import PipelineBuilder from '@/components/PipelineBuilder';
import BeforeAfterDashboard from '@/components/BeforeAfterDashboard';
import { customPrompt, customAlert, customChoice } from '@/core/ui/customDialogs';
import { ArrowLeft, Save, Download, Loader, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/core/i18n/I18nContext';

function PipelineContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { t } = useI18n();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [steps, setSteps] = useState<TransformationStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push('/upload');
      return;
    }

    db.datasets.get(id).then(data => {
      if (data) {
        setDataset(data);
        const addStep = searchParams.get('addStep');
        const payload = searchParams.get('payload');
        if (addStep && payload) {
          try {
            const decodedPayload = JSON.parse(decodeURIComponent(payload));
            const newStep: any = {
              id: Date.now().toString(),
              type: addStep,
              ...decodedPayload
            };
            setSteps([newStep]);
            router.replace(`/pipeline?id=${id}`);
          } catch(e) {
            console.error("Failed to parse auto-fix payload", e);
          }
        }
      } else {
        router.push('/upload');
      }
      setIsLoading(false);
    });
  }, [id, router, searchParams]);

  const [transformedDataset, setTransformedDataset] = useState<Dataset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../core/workers/pipeline.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent) => {
      if (event.data.success) {
        setTransformedDataset(event.data.result);
      } else {
        console.error('Worker error:', event.data.error);
        setTransformedDataset(dataset); // fallback
      }
      setIsProcessing(false);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, [dataset]);

  useEffect(() => {
    if (!dataset || !workerRef.current) return;
    setIsProcessing(true);
    const validSteps = steps.filter(s => TransformationStepSchema.safeParse(s).success);
    workerRef.current.postMessage({ dataset, steps: validSteps, jobId: Date.now() });
  }, [dataset, steps]);

  const handleExportCsv = () => {
    if (!dataset || !transformedDataset) return;
    exportToCsv(transformedDataset);
    exportToJsonReport(transformedDataset, dataset, steps);
  };

  const handleExportXlsx = () => {
    if (!dataset || !transformedDataset) return;
    exportToXlsx(transformedDataset);
    exportToJsonReport(transformedDataset, dataset, steps);
  };

  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const handleSaveToHistory = async () => {
    if (!transformedDataset) return;
    setIsSavingHistory(true);

    const defaultName = `[ETL] ${dataset?.name || 'Dataset'}`;
    const customName = await customPrompt(t('pipeline.prompt.name'), defaultName);

    if (!customName) {
      setIsSavingHistory(false);
      return;
    }

    const newDataset = {
      ...transformedDataset,
      id: crypto.randomUUID(),
      name: customName.trim(),
      createdAt: Date.now()
    };
    await db.datasets.put(newDataset as any);

    setIsSavingHistory(false);

    const choice = await customChoice(t('pipeline.saved.msg', { name: newDataset.name }), [
      { label: t('pipeline.choice.stay'), value: 'stay' },
      { label: t('pipeline.choice.history'), value: 'history' },
      { label: t('pipeline.choice.merge'), value: 'merge', isPrimary: true }
    ]);

    if (choice === 'history') router.push('/history');
    if (choice === 'merge') router.push(`/merge?leftId=${newDataset.id}`);
  };

  if (isLoading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <style dangerouslySetInnerHTML={{__html: `.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (!dataset || !transformedDataset) return null;

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('pipeline.title')}</h2>
          <p style={{ color: '#94a3b8' }}>{t('pipeline.subtitle')} <strong>{dataset.name}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/analyzer?id=${dataset.id}`} className="btn btn-secondary">
            <ArrowLeft size={18} /> {t('pipeline.back')}
          </Link>
          <button className="btn btn-secondary" onClick={handleSaveToHistory} disabled={isSavingHistory} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
            <Save size={18} /> {isSavingHistory ? t('pipeline.saving') : t('pipeline.saveHistory')}
          </button>
          <button className="btn btn-primary" onClick={handleExportCsv} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> CSV
          </button>
          <button className="btn btn-primary" onClick={handleExportXlsx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}>
            <FileSpreadsheet size={18} /> Excel
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
        <PipelineBuilder
          steps={steps}
          onChange={setSteps}
          columns={dataset.columns}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '2rem' }}>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.875rem' }}>{t('pipeline.originalRows')}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{dataset.rows.length}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.875rem' }}>{t('pipeline.rowsAfter')}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: transformedDataset.rows.length < dataset.rows.length ? 'var(--warning)' : 'inherit' }}>
                {transformedDataset.rows.length}
              </span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.875rem' }}>{t('pipeline.columns')}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{transformedDataset.columns.length}</span>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            {isProcessing && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(2px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--surface-border)' }}>
                  <Loader size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t('pipeline.processing')}</span>
                </div>
              </div>
            )}
            <BeforeAfterDashboard originalDataset={dataset} transformedDataset={transformedDataset} />
          </div>

          <DataPreviewTable dataset={transformedDataset} />
        </div>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <PipelineContent />
    </Suspense>
  );
}
