'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, Activity, Layout, Save, GitMerge, Zap } from 'lucide-react';
import { useI18n } from '@/core/i18n/I18nContext';

export default function Roadmap() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const transitionStyle = (delay: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.6s ease-out ${delay}s`
  });

  return (
    <div ref={containerRef} style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '3rem', ...transitionStyle(0) }}>
        Guia Rápido
      </h2>
      
      {/* The 2-Column S-Curve Layout */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4rem', padding: '0 2rem', width: '100%', maxWidth: '1000px' }}>
        
        {/* SVG Arrow 1 (L -> R) */}
        <svg style={{ position: 'absolute', top: '15%', left: '48%', width: '100px', height: '120px', zIndex: 0, pointerEvents: 'none', ...transitionStyle(0.2), opacity: isVisible ? 0.5 : 0 }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M0,0 C50,0 50,120 100,120" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="90,110 100,120 85,125" fill="var(--primary)" />
        </svg>

        {/* SVG Arrow 2 (R -> L) */}
        <svg style={{ position: 'absolute', top: '40%', right: '48%', width: '100px', height: '120px', zIndex: 0, pointerEvents: 'none', ...transitionStyle(0.4), opacity: isVisible ? 0.5 : 0 }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M100,0 C50,0 50,120 0,120" fill="none" stroke="var(--success)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="10,110 0,120 15,125" fill="var(--success)" />
        </svg>

        {/* SVG Arrow 3 (L -> R) */}
        <svg style={{ position: 'absolute', top: '65%', left: '48%', width: '100px', height: '120px', zIndex: 0, pointerEvents: 'none', ...transitionStyle(0.6), opacity: isVisible ? 0.5 : 0 }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M0,0 C50,0 50,120 100,120" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="90,110 100,120 85,125" fill="#8b5cf6" />
        </svg>

        {/* SVG Arrow 4 (R -> L) */}
        <svg style={{ position: 'absolute', top: '88%', right: '48%', width: '100px', height: '120px', zIndex: 0, pointerEvents: 'none', ...transitionStyle(0.8), opacity: isVisible ? 0.5 : 0 }} viewBox="0 0 100 120" preserveAspectRatio="none">
          <path d="M100,0 C50,0 50,120 0,120" fill="none" stroke="var(--warning)" strokeWidth="3" strokeDasharray="6 6" />
          <polygon points="10,110 0,120 15,125" fill="var(--warning)" />
        </svg>


        {/* Step 1 - Left Column */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--primary)', ...transitionStyle(0.1) }}>
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
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--success)', ...transitionStyle(0.3) }}>
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
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid #8b5cf6', ...transitionStyle(0.5) }}>
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
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid var(--warning)', ...transitionStyle(0.7) }}>
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
          <section className="glass" style={{ width: '45%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1, borderTop: '4px solid #ec4899', ...transitionStyle(0.9) }}>
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
    </div>
  );
}
