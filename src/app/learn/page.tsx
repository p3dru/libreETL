'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Activity, GitMerge, Layout, BookOpen, ChevronRight, ShieldAlert, Zap, Save, CheckCircle2 } from 'lucide-react';

import { useI18n } from '@/core/i18n/I18nContext';

export default function LearnPage() {
  const { t } = useI18n();
  
  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <BookOpen size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('learn.title')}
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Security Note */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', marginBottom: '4rem', borderLeft: '4px solid var(--success)', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <ShieldAlert size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--success)' }}>{t('learn.security.title')}</h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            {t('learn.security.desc')}
          </p>
        </div>
      </div>

      {/* Zig-Zag Timeline Steps List */}
      <div style={{ position: 'relative', paddingBottom: '2rem' }}>
        
        {/* Central Line */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'var(--surface-border)', transform: 'translateX(-50%)', zIndex: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Step 1 - Left */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', width: '100%' }}>
            <div style={{ width: '45%', position: 'relative', zIndex: 1 }}>
              <div style={{ position: 'absolute', right: '-11%', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)', border: '4px solid var(--primary)', transform: 'translateX(50%)', zIndex: 2 }} />
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                    <UploadCloud size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('learn.step1.title')}</h2>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {t('learn.step1.desc')}
                </p>
              </section>
            </div>
          </div>

          {/* Step 2 - Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', width: '100%' }}>
            <div style={{ width: '45%', position: 'relative', zIndex: 1 }}>
              <div style={{ position: 'absolute', left: '-11%', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)', border: '4px solid var(--success)', transform: 'translateX(-50%)', zIndex: 2 }} />
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
                    <Activity size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('learn.step2.title')}</h2>
                </div>
                <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {t('learn.step2.desc')}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Zap size={18} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                    {t('learn.step2.tip')}
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Step 3 - Left */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', width: '100%' }}>
            <div style={{ width: '45%', position: 'relative', zIndex: 1 }}>
              <div style={{ position: 'absolute', right: '-11%', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)', border: '4px solid #8b5cf6', transform: 'translateX(50%)', zIndex: 2 }} />
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                    <Layout size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('learn.step3.title')}</h2>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {t('learn.step3.desc')}
                </p>
              </section>
            </div>
          </div>

          {/* Step 4 - Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', width: '100%' }}>
            <div style={{ width: '45%', position: 'relative', zIndex: 1 }}>
              <div style={{ position: 'absolute', left: '-11%', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)', border: '4px solid var(--warning)', transform: 'translateX(-50%)', zIndex: 2 }} />
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                    <Save size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('learn.step4.title')}</h2>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {t('learn.step4.desc')}
                </p>
              </section>
            </div>
          </div>

          {/* Step 5 - Left */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', width: '100%' }}>
            <div style={{ width: '45%', position: 'relative', zIndex: 1 }}>
              <div style={{ position: 'absolute', right: '-11%', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--background)', border: '4px solid #ec4899', transform: 'translateX(50%)', zIndex: 2 }} />
              <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                    <GitMerge size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('learn.step5.title')}</h2>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {t('learn.step5.desc')}
                </p>
              </section>
            </div>
          </div>

        </div>
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem' }}>
          {t('learn.start')} <ChevronRight size={20} />
        </Link>
      </div>
      
    </div>
  );
}
