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

/* ─── Join type metadata (diagrams + descriptions) ──────────────────────── */
const JOIN_META: Record<JoinType, { label: string; description: string; svg: React.ReactElement }> = {
  inner: {
    label: 'Inner Join',
    description: 'Only rows with a matching key in BOTH datasets.',
    svg: (
      <svg width="80" height="50" viewBox="0 0 80 50">
        <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5" />
        <path d="M40,6 A20,20 0 0,1 40,44 A20,20 0 0,1 40,6" fill="rgba(99,102,241,0.9)" />
      </svg>
    ),
  },
  left: {
    label: 'Left Join',
    description: 'All rows from the LEFT dataset; nulls where no right match.',
    svg: (
      <svg width="80" height="50" viewBox="0 0 80 50">
        <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.85)" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
      </svg>
    ),
  },
  right: {
    label: 'Right Join',
    description: 'All rows from the RIGHT dataset; nulls where no left match.',
    svg: (
      <svg width="80" height="50" viewBox="0 0 80 50">
        <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.85)" stroke="#6366f1" strokeWidth="1.5" />
      </svg>
    ),
  },
  full_outer: {
    label: 'Full Outer Join',
    description: 'All rows from BOTH datasets; nulls fill in the gaps.',
    svg: (
      <svg width="80" height="50" viewBox="0 0 80 50">
        <circle cx="28" cy="25" r="20" fill="rgba(99,102,241,0.75)" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="52" cy="25" r="20" fill="rgba(99,102,241,0.75)" stroke="#6366f1" strokeWidth="1.5" />
      </svg>
    ),
  },
  union: {
    label: 'Union (Stack)',
    description: 'Vertical concatenation of both datasets. No key required.',
    svg: (
      <svg width="80" height="50" viewBox="0 0 80 50">
        <rect x="10" y="5" width="60" height="16" rx="3" fill="rgba(99,102,241,0.8)" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="10" y="28" width="60" height="16" rx="3" fill="rgba(99,102,241,0.5)" stroke="#6366f1" strokeWidth="1.5" />
        <line x1="40" y1="21" x2="40" y2="28" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3" />
      </svg>
    ),
  },
};

/* ─── Small helper ─────────────────────────────────────────────────────── */
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
  color: '#94a3b8',
  fontWeight: 500,
};

/* ─── Props ─────────────────────────────────────────────────────────────── */
interface Props {
  /** Called with the merged dataset when the user confirms the operation. */
  onMergeComplete: (result: Dataset) => void;
  /** Optional: pre-select left dataset ID (e.g. when coming from History). */
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
      color: currentStep >= n ? 'white' : '#94a3b8',
      transition: 'all 0.3s',
    }}>
      {currentStep > n ? <CheckCircle2 size={14} /> : n}
    </div>
    <span style={{ fontSize: '0.85rem', color: currentStep === n ? 'var(--foreground)' : '#94a3b8', fontWeight: currentStep === n ? 600 : 400 }}>
      {label}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
 * MergeConfigurator — 3-step wizard
 * ═══════════════════════════════════════════════════════════════════════════ */
export default function MergeConfigurator({ onMergeComplete, initialLeftId }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  /* datasets from IndexedDB */
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  /* Step 1 — selection */
  const [leftId, setLeftId] = useState(initialLeftId ?? '');
  const [rightId, setRightId] = useState('');

  /* Step 2 — join configuration */
  const [joinType, setJoinType] = useState<JoinType>('inner');
  const [leftKey, setLeftKey] = useState('');
  const [rightKey, setRightKey] = useState('');

  /* Step 3 — conflict resolution */
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: '#94a3b8' }}>
        <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin{100%{transform:rotate(360deg)}}`}} />
        Loading datasets…
      </div>
    );
  }

  if (allDatasets.length < 2) {
    return (
      <div className="glass" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <AlertCircle size={40} style={{ color: 'var(--warning)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>At least 2 datasets required</h3>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Upload two or more datasets before merging.</p>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          + Upload New Dataset
        </Link>
      </div>
    );
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <StepDot n={1} label="Select Datasets" currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={2} label="Configure Join" currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={3} label="Resolve Conflicts" currentStep={step} />
        <div style={{ flex: 1, height: '2px', background: 'var(--surface-border)', minWidth: '10px' }} />
        <StepDot n={4} label="Download" currentStep={step} />
      </div>

      {/* ── STEP 1: Select datasets ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--primary)' }} /> Select the two datasets to merge
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left */}
            <div>
              <label style={labelStyle}>Left dataset (A)</label>
              <select value={leftId} onChange={e => setLeftId(e.target.value)} style={inputStyle}>
                {allDatasets.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.rows.length} rows)</option>
                ))}
              </select>
              {leftDataset && (
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                  {leftDataset.columns.length} columns · {leftDataset.rows.length} rows
                </p>
              )}
            </div>

            {/* Right */}
            <div>
              <label style={labelStyle}>Right dataset (B)</label>
              <select value={rightId} onChange={e => setRightId(e.target.value)} style={inputStyle}>
                {allDatasets.map(d => (
                  <option key={d.id} value={d.id} disabled={d.id === leftId}>{d.name} ({d.rows.length} rows)</option>
                ))}
              </select>
              {rightDataset && (
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                  {rightDataset.columns.length} columns · {rightDataset.rows.length} rows
                </p>
              )}
            </div>
          </div>

          {leftId === rightId && (
            <p style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> Please select two different datasets.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step1Valid ? 1 : 0.5 }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Configure join ──────────────────────────────────────────── */}
      {step === 2 && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitMerge size={18} style={{ color: 'var(--primary)' }} /> Choose join type & key columns
          </h3>

          {/* Join type selector */}
          <div>
            <label style={labelStyle}>Join Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {(Object.keys(JOIN_META) as JoinType[]).map(jt => (
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
                  {JOIN_META[jt].svg}
                  <span style={{ fontSize: '0.8rem', fontWeight: joinType === jt ? 600 : 400 }}>{JOIN_META[jt].label}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              {JOIN_META[joinType].description}
            </p>
          </div>

          {/* Key columns (hidden for union) */}
          {joinType !== 'union' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Left key column ({leftDataset?.name})</label>
                <select value={leftKey} onChange={e => setLeftKey(e.target.value)} style={inputStyle}>
                  {leftDataset?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Right key column ({rightDataset?.name})</label>
                <select value={rightKey} onChange={e => setRightKey(e.target.value)} style={inputStyle}>
                  {rightDataset?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Back
            </button>
            <button
              className="btn btn-primary"
              disabled={!step2Valid}
              onClick={() => setStep(3)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step2Valid ? 1 : 0.5 }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Conflicts + Preview ─────────────────────────────────────── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Resolve Column Conflicts</h3>

            {conflictingCols.length === 0 ? (
              <p style={{ color: '#10b981', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> No conflicting column names detected.
              </p>
            ) : (
              <>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  The following columns exist in both datasets: <strong>{conflictingCols.join(', ')}</strong>
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
                      {s === 'suffix' ? 'Add suffix' : s === 'keep_left' ? 'Keep left' : 'Keep right'}
                    </button>
                  ))}
                </div>

                {/* Suffix inputs */}
                {conflictStrategy === 'suffix' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Left suffix</label>
                      <input value={suffixLeft} onChange={e => setSuffixLeft(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Right suffix</label>
                      <input value={suffixRight} onChange={e => setSuffixRight(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={18} /> Back
              </button>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  disabled={!preview}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: preview ? 1 : 0.5 }}
                >
                  <GitMerge size={18} /> Confirm Merge ({preview?.rows.length ?? 0} rows)
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Table */}
          {preview && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#94a3b8' }}>
                Preview — first 5 rows of <strong style={{ color: 'var(--foreground)' }}>{preview.name}</strong> ({preview.rows.length} total rows · {preview.columns.length} columns)
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      {preview.columns.map(col => (
                        <th key={col} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--surface-border)', color: '#94a3b8', whiteSpace: 'nowrap' }}>
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
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Merge Successful!</h3>
            <p style={{ color: '#94a3b8' }}>Your datasets have been combined into <strong>{preview.rows.length} rows</strong> and saved to History.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => exportToCsv(preview)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> Download CSV
            </button>
            <button className="btn btn-secondary" onClick={() => exportToXlsx(preview)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', borderColor: '#10b981' }}>
              <FileSpreadsheet size={18} /> Download Excel
            </button>
            <Link href={`/analyzer?id=${preview.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Go to Analyzer <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
