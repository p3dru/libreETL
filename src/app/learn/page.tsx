'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Activity, GitMerge, Layout, BookOpen, ChevronRight, ShieldAlert, Zap, Save, CheckCircle2 } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <BookOpen size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          DataQ Platform Guide
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          A local-first, zero-backend ETL platform for cleaning, transforming, and merging datasets directly in your browser.
        </p>
      </div>

      {/* Security Note */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', marginBottom: '3rem', borderLeft: '4px solid #10b981' }}>
        <ShieldAlert size={24} style={{ color: '#10b981', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#10b981' }}>100% Local & Private</h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            DataQ runs entirely inside your browser using Web Workers and IndexedDB. <strong>Your data never leaves your computer.</strong> No servers, no tracking, pure performance.
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Step 1 */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
              <UploadCloud size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>1. Upload Your Data</h2>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            Start by navigating to the <strong>Upload</strong> page. You can drag and drop your CSV or Excel files. We use multi-threaded web workers to parse massive datasets instantly without freezing your browser.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', marginLeft: '1.5rem', listStyleType: 'disc' }}>
            <li>Accepts CSV and XLSX formats.</li>
            <li>File size is only limited by your computer's RAM.</li>
            <li>Automatic delimiter detection for CSVs.</li>
          </ul>
        </section>

        {/* Step 2 */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
              <Activity size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>2. Analyze & Auto-Fix</h2>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            After uploading, you arrive at the <strong>Analyzer</strong>. The system automatically scans every column for issues like null values, duplicates, outliers, and incorrect data types.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Zap size={18} style={{ color: '#fbbf24', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              <strong>Pro Tip:</strong> Look for the green "Fix in Pipeline" buttons on the column cards. Clicking these will automatically generate a transformation step to fix the detected issue!
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
              <Layout size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>3. Build the ETL Pipeline</h2>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            Click "Build Pipeline" to enter the drag-and-drop workflow editor. Here you can stack transformations sequentially to clean your data.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dynamic Previews</h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>See the exact impact of your transformations in real-time on the "Before vs After" dashboard at the top.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Reorder Steps</h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Drag and drop blocks to change the execution order. The preview updates instantly.</p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
            Hover over any action in the "Add Step" menu to see exactly what it does (like LGPD Masking, Fuzzy Deduplication, or Calculated Columns).
          </p>
        </section>

        {/* Step 4 */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
              <Save size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>4. Save to History & Recipes</h2>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            When your data is clean, you have options:
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.875rem', marginLeft: '1.5rem', listStyleType: 'disc' }}>
            <li><strong>Save to History:</strong> Saves the fully cleaned dataset into your browser database so you can merge it with other tables later.</li>
            <li><strong>Recipes:</strong> Save your sequence of blocks as a "Recipe" (Template). Next week, you can upload a new raw file and load the recipe to clean it with one click!</li>
            <li><strong>Export:</strong> Download the results immediately as CSV or Excel.</li>
          </ul>
        </section>

        {/* Step 5 */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
              <GitMerge size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>5. Merge Datasets (VLOOKUP on Steroids)</h2>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            The <strong>Merge</strong> page lets you combine two datasets from your History. Forget complex Excel formulas.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', marginLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
            <li>Supports Inner, Left, Right, Full Outer, and Stack (Union) operations.</li>
            <li>Visual Conflict Resolution: Decide what happens if both tables have a "Name" column.</li>
            <li>Live Preview: See the results before committing.</li>
          </ul>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0 }}>
              After merging, you can instantly download the combined file or send it back to the Analyzer!
            </p>
          </div>
        </section>

      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Link href="/upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem' }}>
          Get Started <ChevronRight size={20} />
        </Link>
      </div>
      
    </div>
  );
}
