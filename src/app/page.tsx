'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck, Zap, Play, Layout, Table } from 'lucide-react';
import { db } from '@/core/db';
import { Dataset } from '@/types/dataset';
import { useI18n } from '@/core/i18n/I18nContext';
import Roadmap from '@/components/Roadmap';

export default function Home() {
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    db.datasets.toArray().then(data => {
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRecentDatasets(data.slice(0, 3));
    }).catch(console.error);
  }, []);

  return (
    <>
      <div className="home-parallax-bg" />
      {/* Decorative Side Tech Images */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1000px', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <img src="/tech-left.png" alt="" className="floating-side-image" style={{ left: '-50px', top: '5%' }} />
        <img src="/tech-right.png" alt="" className="floating-side-image" style={{ right: '-50px', top: '25%' }} />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
        <h1 className="font-serif" style={{ fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--foreground), #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('home.hero.title')}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
          {t('home.hero.subtitle')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          <Link href="/upload" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            {t('home.hero.cta')} <ArrowRight size={20} />
          </Link>
        </div>

        {/* Compact Features */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', textAlign: 'left', maxWidth: '240px' }}>
             <div style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}><Database size={18} /></div>
             <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>{t('home.feat.upload.title')}</h4>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{t('home.feat.upload.desc')}</p>
             </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', textAlign: 'left', maxWidth: '240px' }}>
             <div style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }}><ShieldCheck size={18} /></div>
             <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>{t('home.feat.quality.title')}</h4>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{t('home.feat.quality.desc')}</p>
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', textAlign: 'left', maxWidth: '240px' }}>
             <div style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }}><Zap size={18} /></div>
             <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>{t('home.feat.pipeline.title')}</h4>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{t('home.feat.pipeline.desc')}</p>
             </div>
          </div>
        </div>
      </div>
      
      <Roadmap />

      {recentDatasets.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>{t('home.recent.title')}</h2>
            <Link href="/history" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t('home.recent.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {recentDatasets.map(dataset => (
              <div key={dataset.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, wordBreak: 'break-all', marginBottom: '0.5rem' }}>{dataset.name}</h3>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Table size={14} /> {dataset.rows.length} {t('home.recent.rows')}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/analyzer?id=${dataset.id}`} className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', padding: '0.5rem' }}>
                    <Play size={14} /> {t('home.recent.analyze')}
                  </Link>
                  <Link href={`/pipeline?id=${dataset.id}`} className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', padding: '0.5rem' }}>
                    <Layout size={14} /> {t('home.recent.pipeline')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      </div>
    </>
  );
}
