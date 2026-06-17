import { QualityReport } from '@/types/quality';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function QualityScoreCard({ report }: { report: QualityReport }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  const ScoreIcon = report.score >= 90 ? ShieldCheck : report.score >= 70 ? Shield : ShieldAlert;

  const radarData = report.dimensions ? [
    { subject: 'Completeness', A: report.dimensions.completeness, fullMark: 100 },
    { subject: 'Uniqueness', A: report.dimensions.uniqueness, fullMark: 100 },
    { subject: 'Consistency', A: report.dimensions.consistency, fullMark: 100 },
    { subject: 'Validity', A: report.dimensions.validity, fullMark: 100 },
  ] : [];

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--surface-border)', paddingRight: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Dataset Health Score</h3>
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--surface-border)" strokeWidth="10" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(report.score)} strokeWidth="10" strokeDasharray={`${report.score * 2.827} 282.7`} style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{report.score}</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
        </div>
      </div>

      {radarData.length > 0 && (
        <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--surface-border)', paddingRight: '2rem' }}>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div style={{ flex: '2', minWidth: '300px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="var(--warning)" />
          Problemas Encontrados
        </h3>
        {report.warnings.length === 0 ? (
          <p style={{ color: 'var(--success)' }}>Tudo certo! Nenhum problema grave detectado.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {report.warnings.map((warning, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning)' }}>
                <span style={{ color: '#cbd5e1' }}>{warning}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
