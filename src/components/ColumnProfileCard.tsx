'use client';
import { ColumnProfile } from '@/types/quality';
import { Type, Hash, Calendar, ToggleLeft, AlertCircle, ChevronDown, ChevronUp, BarChart2, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export default function ColumnProfileCard({ profile }: { profile: ColumnProfile }) {
  const [showChart, setShowChart] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleAutoFix = (action: any) => {
    const datasetId = searchParams.get('id');
    if (!datasetId) return;
    const payloadStr = encodeURIComponent(JSON.stringify(action.actionPayload));
    router.push(`/pipeline?id=${datasetId}&addStep=${action.actionType}&payload=${payloadStr}`);
  };

  const getTypeIcon = () => {
    switch (profile.inferredType) {
      case 'string': return <Type size={16} />;
      case 'number': return <Hash size={16} />;
      case 'date': return <Calendar size={16} />;
      case 'boolean': return <ToggleLeft size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getBarColor = (percentage: number) => {
    if (percentage === 0) return 'var(--success)';
    if (percentage < 10) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{profile.column}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(profile.distribution || profile.topFrequencies) && (
            <button 
              onClick={() => setShowChart(!showChart)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: showChart ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface)', border: 'none', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: showChart ? 'var(--primary)' : 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <BarChart2 size={14} /> {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
            {getTypeIcon()}
            <span style={{ textTransform: 'capitalize' }}>{profile.inferredType}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Nulos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 500 }}>{profile.nullCount}</span>
            <span style={{ color: '#94a3b8' }}>({profile.nullPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--surface)', borderRadius: '2px', marginTop: '0.25rem' }}>
            <div style={{ width: `${profile.nullPercentage}%`, height: '100%', background: getBarColor(profile.nullPercentage), borderRadius: '2px' }} />
          </div>
        </div>
        
        <div>
          <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Únicos</span>
          <span style={{ fontWeight: 500 }}>{profile.uniqueCount}</span>
        </div>
        
        {profile.inferredType === 'number' && (
          <>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Outliers</span>
              <span style={{ fontWeight: 500, color: profile.outlierCount! > 0 ? 'var(--warning)' : 'inherit' }}>{profile.outlierCount}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Média</span>
              <span style={{ fontWeight: 500 }}>{profile.mean?.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {profile.recommendedActions && profile.recommendedActions.length > 0 && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {profile.recommendedActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleAutoFix(action)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Zap size={14} /> Fix in Pipeline: {action.label}
            </button>
          ))}
        </div>
      )}

      {showChart && profile.topFrequencies && (
        <div style={{ marginTop: '1.5rem', height: '150px' }}>
          <h5 style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Values</h5>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profile.topFrequencies} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="value" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {showChart && profile.distribution && (
        <div style={{ marginTop: '1.5rem', height: '150px' }}>
          <h5 style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distribution</h5>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profile.distribution} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorCount-${profile.column}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" hide />
              <YAxis hide />
              <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.2)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="count" stroke="var(--primary)" fillOpacity={1} fill={`url(#colorCount-${profile.column})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
