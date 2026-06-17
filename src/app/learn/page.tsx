'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, UploadCloud, Activity, Layout, GitMerge, Download, ShieldAlert, Zap, Save, ChevronRight } from 'lucide-react';
import { useI18n } from '@/core/i18n/I18nContext';

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    padding: '0.15rem 0.45rem',
    borderRadius: '4px',
    fontSize: '0.85em',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    color: 'var(--primary)'
  }}>{children}</code>
);

const Tag = ({ children, color = 'var(--primary)' }: { children: React.ReactNode, color?: string }) => (
  <span style={{
    background: `color-mix(in srgb, ${color} 15%, transparent)`,
    border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
    color,
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  }}>{children}</span>
);

const Heading2 = ({ icon, children, color = 'var(--primary)' }: { icon: React.ReactNode, children: React.ReactNode, color?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
    <div style={{ padding: '0.6rem', borderRadius: '10px', background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>{icon}</div>
    <h2 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 700, margin: 0 }}>{children}</h2>
  </div>
);

const InfoBox = ({ title, children, color = 'var(--primary)' }: { title?: string, children: React.ReactNode, color?: string }) => (
  <div className="glass" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${color}`, marginBottom: '1.25rem' }}>
    {title && <h5 style={{ margin: '0 0 0.4rem 0', fontWeight: 600, color }}>{title}</h5>}
    <div style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{children}</div>
  </div>
);

const ParamRow = ({ name, type, desc }: { name: string, type: string, desc: string }) => (
  <div style={{ display: 'flex', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--surface-border)', alignItems: 'flex-start' }}>
    <Code>{name}</Code>
    <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontFamily: 'monospace', marginTop: '2px', whiteSpace: 'nowrap' as const }}>{type}</span>
    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

export default function LearnWikiPage() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', label: t('learn.nav.intro') },
    { id: 'upload', label: t('learn.nav.upload') },
    { id: 'diagnostics', label: t('learn.nav.diagnostics') },
    { id: 'pipeline', label: t('learn.nav.pipeline') },
    { id: 'transforms', label: t('learn.nav.transforms') },
    { id: 'merge', label: t('learn.nav.merge') },
    { id: 'history', label: t('learn.nav.history') },
    { id: 'export', label: t('learn.nav.export') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
  };

  const transforms = [
    { key: 'dropnulls' }, { key: 'fillnulls' }, { key: 'dropdupes' },
    { key: 'case' }, { key: 'trim' }, { key: 'rename' }, { key: 'filter' },
  ];

  return (
    <div className="container" style={{ display: 'flex', gap: '3rem', padding: '2.5rem 0 10rem', maxWidth: '1200px', alignItems: 'flex-start' }}>

      {/* Sidebar */}
      <aside className="glass" style={{ width: '260px', position: 'sticky', top: '90px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
          <BookOpen size={18} style={{ color: 'var(--primary)' }} />
          <span className="font-serif" style={{ fontWeight: 700, fontSize: '1.05rem' }}>LibreETL Docs</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? 'var(--primary)' : '#94a3b8',
              background: activeSection === s.id ? 'rgba(99,102,241,0.12)' : 'transparent',
              transition: 'all 0.18s',
            }}>{s.label}</button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, minWidth: 0 }}>

        {/* INTRO */}
        <section id="intro" style={{ marginBottom: '5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Tag>{t('learn.nav.intro')}</Tag>
            <h1 className="font-serif" style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.75rem 0 1rem', lineHeight: 1.2 }}>{t('learn.page.title')}</h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.75 }}>{t('learn.page.subtitle')}</p>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.75, marginTop: '0.75rem' }}>{t('learn.page.subtitle2')}</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--success)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldAlert size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--success)' }}>{t('learn.privacy.title')}</h4>
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>{t('learn.privacy.desc')}</p>
              </div>
            </div>
          </div>
          <InfoBox title={t('learn.when.title')}>{t('learn.when.desc')}</InfoBox>
        </section>

        {/* UPLOAD */}
        <section id="upload" style={{ marginBottom: '5rem', scrollMarginTop: '110px' }}>
          <Heading2 icon={<UploadCloud size={22} />}>{t('learn.upload.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.upload.intro')}</p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>{t('learn.upload.formats.title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', marginBottom: '2rem' }}>
            <InfoBox title={t('learn.upload.csv.title')}>{t('learn.upload.csv.desc')}</InfoBox>
            <InfoBox title={t('learn.upload.xlsx.title')}>{t('learn.upload.xlsx.desc')}</InfoBox>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>{t('learn.upload.after.title')}</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>{t('learn.upload.after.desc')}</p>
          <InfoBox title={t('learn.upload.tip.title')} color="var(--warning)">{t('learn.upload.tip.desc')}</InfoBox>
        </section>

        {/* DIAGNOSTICS */}
        <section id="diagnostics" style={{ marginBottom: '5rem', scrollMarginTop: '110px' }}>
          <Heading2 icon={<Activity size={22} />} color="var(--success)">{t('learn.diag.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.diag.intro')}</p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>{t('learn.diag.score.title')}</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1rem' }}>{t('learn.diag.score.desc')}</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, marginBottom: '2rem' }}>
            <ParamRow name={t('learn.param.nulls')} type={t('learn.param.penalty.high')} desc={t('learn.diag.nulls')} />
            <ParamRow name={t('learn.param.dupes')} type={t('learn.param.penalty.med')} desc={t('learn.diag.dupes')} />
            <ParamRow name={t('learn.param.mixed')} type={t('learn.param.penalty.var')} desc={t('learn.diag.mixed')} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>{t('learn.diag.stats.title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, marginBottom: '2rem' }}>
            <ParamRow name={t('learn.param.numeric')} type="number" desc={t('learn.diag.numeric')} />
            <ParamRow name={t('learn.param.text')} type="string" desc={t('learn.diag.text')} />
            <ParamRow name={t('learn.param.nullpct')} type="all" desc={t('learn.diag.nullpct')} />
          </div>
          <InfoBox title={t('learn.diag.fixbtn.title')} color="var(--warning)">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Zap size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            </div>
            {t('learn.diag.fixbtn.desc')}
          </InfoBox>
        </section>

        {/* PIPELINE */}
        <section id="pipeline" style={{ marginBottom: '3rem', scrollMarginTop: '110px' }}>
          <Heading2 icon={<Layout size={22} />} color="#8b5cf6">{t('learn.pipeline.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.pipeline.intro')}</p>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '2rem' }}>{t('learn.pipeline.nondestructive')}</p>
          <InfoBox title={t('learn.pipeline.internals.title')} color="#8b5cf6">{t('learn.pipeline.internals.desc')}</InfoBox>
        </section>

        {/* TRANSFORMS */}
        <section id="transforms" style={{ marginBottom: '5rem', scrollMarginTop: '110px' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('learn.transforms.title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' }}>
            {transforms.map(tr => (
              <div key={tr.key} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #8b5cf6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' as const }}>
                  <h4 style={{ fontWeight: 700, margin: 0, fontSize: '1rem' }}>{t(`learn.transform.${tr.key}.name`)}</h4>
                  <Code>{t(`learn.transform.${tr.key}.param`)}</Code>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 0.6rem', lineHeight: 1.6 }}>{t(`learn.transform.${tr.key}.desc`)}</p>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  <strong style={{ color: '#94a3b8' }}>{t('learn.when')}:</strong> {t(`learn.transform.${tr.key}.use`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MERGE */}
        <section id="merge" style={{ marginBottom: '5rem', scrollMarginTop: '110px' }}>
          <Heading2 icon={<GitMerge size={22} />} color="#ec4899">{t('learn.merge.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.merge.intro')}</p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>{t('learn.merge.config.title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const }}>
            <ParamRow name={t('learn.param.primary')} type={t('learn.param.required')} desc={t('learn.merge.primary')} />
            <ParamRow name={t('learn.param.secondary')} type={t('learn.param.required')} desc={t('learn.merge.secondary')} />
            <ParamRow name={t('learn.param.key')} type="string" desc={t('learn.merge.key')} />
            <ParamRow name={t('learn.param.jointype')} type='"left" | "inner"' desc={t('learn.merge.type')} />
          </div>
          <InfoBox title={t('learn.merge.tip.title')} color="#ec4899">{t('learn.merge.tip.desc')}</InfoBox>
        </section>

        {/* HISTORY */}
        <section id="history" style={{ marginBottom: '5rem', scrollMarginTop: '110px' }}>
          <Heading2 icon={<Save size={22} />} color="var(--warning)">{t('learn.history.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.history.intro')}</p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>{t('learn.history.recipes.title')}</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.25rem' }}>{t('learn.history.recipes.desc')}</p>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.history.recipes.use')}</p>
          <InfoBox title={t('learn.history.recipes.json.title')} color="var(--warning)">{t('learn.history.recipes.json.desc')}</InfoBox>
        </section>

        {/* EXPORT */}
        <section id="export" style={{ scrollMarginTop: '110px' }}>
          <Heading2 icon={<Download size={22} />}>{t('learn.export.title')}</Heading2>
          <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.export.intro')}</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const }}>
            <ParamRow name={t('learn.param.csv')} type={t('learn.param.default')} desc={t('learn.export.csv')} />
            <ParamRow name={t('learn.param.xlsx')} type={t('learn.param.available')} desc={t('learn.export.xlsx')} />
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' as const }}>
            <a href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}>
              {t('learn.cta')} <ChevronRight size={18} />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
