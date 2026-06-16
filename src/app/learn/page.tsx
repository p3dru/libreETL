'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Activity, GitMerge, Layout, BookOpen, ChevronRight, ShieldAlert, Zap, Save } from 'lucide-react';
import { useI18n } from '@/core/i18n/I18nContext';

export default function LearnPage() {
  const { t } = useI18n();
  
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', maxWidth: '1100px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', marginBottom: '2rem', boxShadow: '0 0 40px rgba(99, 102, 241, 0.2)', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.3)' }}>
          <img src="/image.png" alt="DataQ Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 className="font-serif" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
          {t('learn.title')}
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Security Note */}
      <div className="glass" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1.25rem', marginBottom: '5rem', borderLeft: '4px solid var(--success)', maxWidth: '800px', margin: '0 auto 5rem auto', boxShadow: '0 10px 30px -10px rgba(16,185,129,0.15)' }}>
        <ShieldAlert size={28} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--success)' }}>{t('learn.security.title')}</h4>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
            {t('learn.security.desc')}
          </p>
        </div>
      </div>

      {/* The 2-Column S-Curve Layout */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4rem', padding: '0 2rem' }}>
        
        {/* SVG Arrow 1 (L -> R) */}
        <svg style={{ position: 'absolute', top: '15%', left: '48%', width: '100px', height: '120px', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M0,0 C50,0 50,120 100,120" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="90,110 100,120 85,125" fill="var(--primary)" />
        </svg>

        {/* SVG Arrow 2 (R -> L) */}
        <svg style={{ position: 'absolute', top: '40%', right: '48%', width: '100px', height: '120px', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M100,0 C50,0 50,120 0,120" fill="none" stroke="var(--success)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="10,110 0,120 15,125" fill="var(--success)" />
        </svg>

        {/* SVG Arrow 3 (L -> R) */}
        <svg style={{ position: 'absolute', top: '65%', left: '48%', width: '100px', height: '120px', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M0,0 C50,0 50,120 100,120" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="90,110 100,120 85,125" fill="#8b5cf6" />
        </svg>

        {/* SVG Arrow 4 (R -> L) */}
        <svg style={{ position: 'absolute', top: '88%', right: '48%', width: '100px', height: '120px', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M100,0 C50,0 50,120 0,120" fill="none" stroke="var(--warning)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="10,110 0,120 15,125" fill="var(--warning)" />
        </svg>


        {/* Step 1 - Left Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                <UploadCloud size={24} />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{t('learn.step1.title')}</h2>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem' }}>
              {t('learn.step1.desc')}
            </p>
          </section>
        </div>

        {/* Step 2 - Right Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
                <Activity size={24} />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{t('learn.step2.title')}</h2>
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '1rem' }}>
              {t('learn.step2.desc')}
            </p>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Zap size={20} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
                {t('learn.step2.tip')}
              </p>
            </div>
          </section>
        </div>

        {/* Step 3 - Left Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                <Layout size={24} />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{t('learn.step3.title')}</h2>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem' }}>
              {t('learn.step3.desc')}
            </p>
          </section>
        </div>

        {/* Step 4 - Right Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                <Save size={24} />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{t('learn.step4.title')}</h2>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem' }}>
              {t('learn.step4.desc')}
            </p>
          </section>
        </div>

        {/* Step 5 - Left Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                <GitMerge size={24} />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{t('learn.step5.title')}</h2>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem' }}>
              {t('learn.step5.desc')}
            </p>
          </section>
        </div>

      </div>

      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 3rem', fontSize: '1.125rem', borderRadius: 'var(--radius-full)' }}>
          {t('learn.start')} <ChevronRight size={22} />
        </Link>
      </div>
      
    </div>
  );
}
