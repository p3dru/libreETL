'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { db } from '@/core/db';
import { Dataset, DataRow } from '@/types/dataset';
import { MergeConfig, JoinType, ConflictStrategy } from '@/types/merge';
import { mergeDatasets } from '@/core/merge/mergeDatasets';
import { exportToCsv } from '@/core/exporters/exportCsv';
import { exportToXlsx } from '@/core/exporters/exportXlsx';
import { ChevronRight, ChevronLeft, Database, GitMerge, AlertCircle, CheckCircle2, Loader, Download, FileSpreadsheet } from 'lucide-react';
import { useI18n } from '@/core/i18n/I18nContext';

/* ─── Join type SVGs (visual only, labels come from i18n) ─────────────────── */
const JOIN_SVG: Record<JoinType, React.ReactElement> = {
  inner: (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5" />
      <path d="M40,6 A20,20 0 0,1 40,44 A20,20 0 0,1 40,6" fill="rgba(99,102,241,0.9)" />
    </svg>
  ),
  left: (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.85)" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  ),
  right: (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.85)" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  ),
  full_outer: (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.75)" stroke="#6366f1" strokeWidth="1.5" />
      <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.75)" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  ),
  union: (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <rect x="10" y="5" width="60" height="16" rx="3" fill="rgba(99,102,241,0.8)" stroke="#6366f1" strokeWidth="1.5" />
      <rect x="10" y="28" width="60" height="16" rx="3" fill="rgba(99,102,241,0.5)" stroke="#6366f1" strokeWidth="1.5" />
      <line x1="40" y1="21" x2="40" y2="28" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3" />
    </svg>
  ),
};

/* ─── Small helper styles ──────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--surface-border)',
  background: 'var(--surface)',
  color: 'inherit',
  fontSize: '0.875rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  fontWeight: 500,
};

/* ─── Props ─────────────────────────────────────────────────────────────── */
interface Props {
  onMergeComplete: (result: Dataset) => void;
  initialLeftId?: string;
}

/* ── Step indicator component ─────────────────────────────────────────────── */
const StepDot = ({ n, label, currentStep }: { n: number; label: string; currentStep: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{
      width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700,
      background: currentStep >= n ? 'var(--primary)' : 'var(--surface)',
      border: `2px solid ${currentStep >= n ? 'var(--primary)' : 'var(--surface-border)'}`,
      color: currentStep >= n ? 'white' : 'var(--text-secondary)',
      transition: 'all 0.3s',
    }}>
      {currentStep > n ? <CheckCircle2 size={14} /> : n}
    </div>
    <span style={{ fontSize: '0.85rem', color: currentStep === n ? 'var(--foreground)' : 'var(--text-secondary)', fontWeight: currentStep === n ? 600 : 400 }}>
      {label}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
 * MergeConfigurator — 4-step wizard
 * ═══════════════════════════════════════════════════════════════════════════ */
export default function MergeConfigurator({ onMergeComplete, initialLeftId }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { t } = useI18n();

  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  const [leftId, setLeftId] = useState(initialLeftId ?? '');
  const [rightId, setRightId] = useState('');

  const [joinType, setJoinType] = useState<JoinType>('inner');
  const [leftKey, setLeftKey] = useState('');
  const [rightKey, setRightKey] = useState('');

  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>('suffix');
  const [suffixLeft, setSuffixLeft] = useState('_left');
  const [suffixRight, setSuffixRight] = useState('_right');

  /* ── Load datasets ─────────────────────────────────────────────────────── */
  useEffect(() => {
    db.datasets.toArray().then(data => {
      data.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setAllDatasets(data);
      if (data.length >= 1 && !initialLeftId) setLeftId(data[0].id);
      if (data.length >= 2) setRightId(data[1].id);
    }).finally(() => setLoadingDb(false));
  }, [initialLeftId]);

  const leftDataset = useMemo(() => allDatasets.find(d => d.id === leftId) ?? null, [allDatasets, leftId]);
  const rightDataset = useMemo(() => allDatasets.find(d => d.id === rightId) ?? null, [allDatasets, rightId]);

  /* ── Conflict detection ─────────────────────────────────────────────────── */
  const conflictingCols = useMemo(() => {
    if (!leftDataset || !rightDataset) return [];
    const rightNonKey = rightDataset.columns.filter(c => c !== rightKey);
    const leftNonKey = leftDataset.columns.filter(c => c !== leftKey);
    return rightNonKey.filter(c => leftNonKey.includes(c));
  }, [leftDataset, rightDataset, leftKey, rightKey]);

  /* ── Preview computation ────────────────────────────────────────────────── */
  const preview = useMemo<Dataset | null>(() => {
    if (!leftDataset || !rightDataset) return null;
    if (joinType !== 'union' && (!leftKey || !rightKey)) return null;
    try {
      const config: MergeConfig = {
        leftDatasetId: leftId,
        rightDatasetId: rightId,
        joinType,
        leftKey,
        rightKey,
        conflictStrategy,
        suffixLeft,
        suffixRight,
      };
      return mergeDatasets(leftDataset, rightDataset, config);
    } catch {
      return null;
    }
  }, [leftDataset, rightDataset, joinType, leftKey, rightKey, conflictStrategy, suffixLeft, suffixRight, leftId, rightId]);

  /* ── Confirm ────────────────────────────────────────────────────────────── */
  const handleConfirm = () => {
    if (preview) {
      onMergeComplete(preview);
      setStep(4);
    }
  };

  /* ── Step validation ─────────────────────────────────────────────────────── */
  const step1Valid = leftId && rightId && leftId !== rightId;
  const step2Valid = joinType === 'union' || (leftKey && rightKey);

  /* ── Init keys when datasets change ─────────────────────────────────────── */
  useEffect(() => {
    if (leftDataset) setLeftKey(leftDataset.columns[0] ?? '');
  }, [leftDataset]);
  useEffect(() => {
    if (rightDataset) setRightKey(rightDataset.columns[0] ?? '');
  }, [rightDataset]);

  /* ─────────────────────────────────────────────────────────────────────────
   * RENDER
   * ───────────────────────────────────────────────────────────────────────── */
  if (loadingDb) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: 'var(--text-secondary)' }}>
        <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin{100%{transform:rotate(360deg)}}`}} />
        {t('merge.loading')}
      </div>
    );
  }

  if (allDatasets.length < 2) {
    return (
      <div className="glass" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <AlertCircle size={40} style={{ color: 'var(--warning)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{t('merge.need2.title')}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('merge.need2.desc')}</p>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {t('merge.need2.cta')}
        </Link>
      </div>
    );
  }

  const joinTypes = (Object.keys(JOIN_SVG) as JoinType[]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <StepDot n={1} label={t('merge.step1.label')} currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={2} label={t('merge.step2.label')} currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={3} label={t('merge.step3.label')} currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={4} label={t('merge.step4.label')} currentStep={step} />
      </div>

      {/* ── STEP 1: Select datasets ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--primary)' }} /> {t('merge.step1.title')}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left */}
            <div>
              <label style={labelStyle}>{t('merge.step1.leftLabel')}</label>
              <select value={leftId} onChange={e => setLeftId(e.target.value)} style={inputStyle}>
                {allDatasets.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.rows.length} {t('merge.step1.rows')})</option>
                ))}
              </select>
              {leftDataset && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  {leftDataset.columns.length} {t('merge.step1.columns')} · {leftDataset.rows.length} {t('merge.step1.rows')}
                </p>
              )}
            </div>

            {/* Right */}
            <div>
              <label style={labelStyle}>{t('merge.step1.rightLabel')}</label>
              <select value={rightId} onChange={e => setRightId(e.target.value)} style={inputStyle}>
                {allDatasets.map(d => (
                  <option key={d.id} value={d.id} disabled={d.id === leftId}>{d.name} ({d.rows.length} {t('merge.step1.rows')})</option>
                ))}
              </select>
              {rightDataset && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  {rightDataset.columns.length} {t('merge.step1.columns')} · {rightDataset.rows.length} {t('merge.step1.rows')}
                </p>
              )}
            </div>
          </div>

          {leftId === rightId && (
            <p style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {t('merge.step1.sameError')}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step1Valid ? 1 : 0.5 }}
            >
              {t('merge.btn.next')} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Configure join ──────────────────────────────────────────── */}
      {step === 2 && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitMerge size={18} style={{ color: 'var(--primary)' }} /> {t('merge.step2.title')}
          </h3>

          {/* Join type selector */}
          <div>
            <label style={labelStyle}>{t('merge.step2.joinType')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {joinTypes.map(jt => (
                <button
                  key={jt}
                  onClick={() => setJoinType(jt)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${joinType === jt ? 'var(--primary)' : 'var(--surface-border)'}`,
                    background: joinType === jt ? 'rgba(99,102,241,0.12)' : 'var(--surface)',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {JOIN_SVG[jt]}
                  <span style={{ fontSize: '0.8rem', fontWeight: joinType === jt ? 600 : 400 }}>{t(`join.${jt}.label`)}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {t(`join.${joinType}.desc`)}
            </p>
          </div>

          {/* Key columns (hidden for union) */}
          {joinType !== 'union' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>{t('merge.step2.leftKey')} ({leftDataset?.name})</label>
                <select value={leftKey} onChange={e => setLeftKey(e.target.value)} style={inputStyle}>
                  {leftDataset?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('merge.step2.rightKey')} ({rightDataset?.name})</label>
                <select value={rightKey} onChange={e => setRightKey(e.target.value)} style={inputStyle}>
                  {rightDataset?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> {t('merge.btn.back')}
            </button>
            <button
              className="btn btn-primary"
              disabled={!step2Valid}
              onClick={() => setStep(3)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step2Valid ? 1 : 0.5 }}
            >
              {t('merge.btn.next')} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Conflicts + Preview ─────────────────────────────────────── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('merge.step3.title')}</h3>

            {conflictingCols.length === 0 ? (
              <p style={{ color: '#10b981', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> {t('merge.step3.noConflicts')}
              </p>
            ) : (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {t('merge.step3.conflicts')} <strong>{conflictingCols.join(', ')}</strong>
                </p>

                {/* Strategy selector */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {(['suffix', 'keep_left', 'keep_right'] as ConflictStrategy[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setConflictStrategy(s)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${conflictStrategy === s ? 'var(--primary)' : 'var(--surface-border)'}`,
                        background: conflictStrategy === s ? 'rgba(99,102,241,0.12)' : 'var(--surface)',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: conflictStrategy === s ? 600 : 400,
                        transition: 'all 0.2s',
                      }}
                    >
                      {s === 'suffix' ? t('merge.step3.suffix') : s === 'keep_left' ? t('merge.step3.keepLeft') : t('merge.step3.keepRight')}
                    </button>
                  ))}
                </div>

                {/* Suffix inputs */}
                {conflictStrategy === 'suffix' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>{t('merge.step3.leftSuffix')}</label>
                      <input value={suffixLeft} onChange={e => setSuffixLeft(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('merge.step3.rightSuffix')}</label>
                      <input value={suffixRight} onChange={e => setSuffixRight(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={18} /> {t('merge.btn.back')}
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  disabled={!preview}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: preview ? 1 : 0.5 }}
                >
                  <GitMerge size={18} /> {t('merge.step3.confirm')} ({preview?.rows.length ?? 0} {t('merge.step1.rows')})
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Table */}
          {preview && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {t('merge.preview.title')} <strong style={{ color: 'var(--foreground)' }}>{preview.name}</strong> ({preview.rows.length} {t('merge.preview.total')} · {preview.columns.length} {t('merge.step1.columns')})
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      {preview.columns.map(col => (
                        <th key={col} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 5).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {preview.columns.map(col => (
                          <td key={col} style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap', color: row[col] == null ? '#475569' : 'inherit' }}>
                            {row[col] == null ? '∅' : String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: Download ──────────────────────────────────────────────── */}
      {step === 4 && preview && (
        <div className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <CheckCircle2 size={56} style={{ color: '#10b981' }} />
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t('merge.step4.success')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('merge.step4.desc', { rows: preview.rows.length })}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => exportToCsv(preview)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> {t('merge.step4.downloadCsv')}
            </button>
            <button className="btn btn-secondary" onClick={() => exportToXlsx(preview)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', borderColor: '#10b981' }}>
              <FileSpreadsheet size={18} /> {t('merge.step4.downloadExcel')}
            </button>
            <Link href={`/analyzer?id=${preview.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t('merge.step4.goAnalyzer')} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
