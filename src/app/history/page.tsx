'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import { Database, Calendar, Table, Trash2, ArrowRight, Play, Layout, GitMerge, Download, FileSpreadsheet } from 'lucide-react';
import { exportToCsv } from '@/core/exporters/exportCsv';
import { exportToXlsx } from '@/core/exporters/exportXlsx';
import { customConfirm } from '@/core/ui/customDialogs';
import { useI18n } from '@/core/i18n/I18nContext';

export default function HistoryPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useI18n();

  const loadDatasets = async () => {
    try {
      const data = await db.datasets.toArray();
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setDatasets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = await customConfirm(t('history.delete.confirm'), true);
    if (isConfirmed) {
      await db.datasets.delete(id);
      loadDatasets();
    }
  };

  if (isLoading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('history.loading')}</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('history.title')}</h2>
          <p style={{ color: '#94a3b8' }}>{t('history.subtitle')}</p>
        </div>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {t('history.newUpload')} <ArrowRight size={18} />
        </Link>
      </div>

      {datasets.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Database size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('history.empty.title')}</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            {t('history.empty.desc')}
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/upload" className="btn btn-primary">
              {t('history.empty.cta')}
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {datasets.map(dataset => (
            <div key={dataset.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, wordBreak: 'break-all', paddingRight: '1rem' }}>{dataset.name}</h3>
                <button onClick={() => handleDelete(dataset.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-md)' }} title="Delete dataset">
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Table size={14} /> {dataset.rows.length} {t('history.rows')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Layout size={14} /> {dataset.columns.length} {t('history.cols')}
                </div>
                {dataset.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> {new Date(dataset.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                  <Link
                    href={`/analyzer?id=${dataset.id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <Layout size={14} /> {t('history.btn.analyzer')}
                  </Link>
                  <Link
                    href={`/pipeline?id=${dataset.id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                  >
                    <Play size={14} /> {t('history.btn.pipeline')}
                  </Link>
                  <Link
                    href={`/merge?leftId=${dataset.id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <GitMerge size={14} /> {t('history.btn.merge')}
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => exportToCsv(dataset)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Download CSV">
                    <Download size={16} />
                  </button>
                  <button onClick={() => exportToXlsx(dataset)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', borderColor: 'rgba(16, 185, 137, 0.3)' }} title="Download Excel">
                    <FileSpreadsheet size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
