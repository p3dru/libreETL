import React, { useMemo } from 'react';
import { Dataset } from '@/types/dataset';
import { calculateQualityScore } from '@/core/analyzer/calculateQualityScore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  originalDataset: Dataset;
  transformedDataset: Dataset;
}

export default function BeforeAfterDashboard({ originalDataset, transformedDataset }: Props) {
  const originalReport = useMemo(() => calculateQualityScore(originalDataset), [originalDataset]);
  const transformedReport = useMemo(() => calculateQualityScore(transformedDataset), [transformedDataset]);

  const chartData = useMemo(() => {
    const allCols = Array.from(new Set([...originalDataset.columns, ...transformedDataset.columns]));
    
    return allCols.map(col => {
      const origCol = originalReport.columns.find(c => c.column === col);
      const transCol = transformedReport.columns.find(c => c.column === col);
      
      return {
        name: col,
        'Nulls Before': origCol ? origCol.nullCount : 0,
        'Nulls After': transCol ? transCol.nullCount : 0,
      };
    }).filter(d => d['Nulls Before'] > 0 || d['Nulls After'] > 0);
  }, [originalReport, transformedReport, originalDataset.columns, transformedDataset.columns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--surface-border)' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Original Score</h4>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: originalReport.score >= 90 ? 'var(--success)' : originalReport.score >= 70 ? 'var(--warning)' : 'var(--error)' }}>
            {originalReport.score}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pipeline Score</h4>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: transformedReport.score >= 90 ? 'var(--success)' : transformedReport.score >= 70 ? 'var(--warning)' : 'var(--error)' }}>
            {transformedReport.score}
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Null Values by Column (Before vs After)</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend />
                <Bar dataKey="Nulls Before" fill="var(--error)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Nulls After" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
