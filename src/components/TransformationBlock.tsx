import React from 'react';
import { TransformationStep, TransformationStepSchema } from '@/types/pipeline';
import { Trash2, Settings, AlertCircle, GripVertical } from 'lucide-react';

interface Props {
  step: TransformationStep;
  columns: string[];
  onUpdate: (updates: Partial<TransformationStep>) => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export default function TransformationBlock({ step, columns, onUpdate, onRemove, dragHandleProps }: Props) {
  const validationResult = TransformationStepSchema.safeParse(step);
  const errors = !validationResult.success ? validationResult.error.format() : null;

  const getErrorFor = (field: string) => {
    if (!errors) return null;
    const fieldError = (errors as any)[field];
    if (fieldError && fieldError._errors && fieldError._errors.length > 0) {
      return fieldError._errors[0];
    }
    return null;
  };

  const renderError = (field: string) => {
    const err = getErrorFor(field);
    if (!err) return null;
    return <span style={{ color: 'var(--error)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><AlertCircle size={12} /> {err}</span>;
  }
  const renderControls = () => {
    switch (step.type) {
      case 'REMOVE_DUPLICATES':
        return <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Removes all rows with identical values.</p>;
      
      case 'REMOVE_NULLS':
      case 'REMOVE_COLUMN':
        return (
          <select 
            value={(step as any).column} 
            onChange={e => onUpdate({ column: e.target.value } as any)}
            style={selectStyle}
          >
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        );

      case 'RENAME_COLUMN':
        return (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select value={(step as any).oldName} onChange={e => onUpdate({ oldName: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ color: 'var(--text-secondary)' }}>&rarr;</span>
            <input 
              type="text" 
              value={(step as any).newName} 
              onChange={e => onUpdate({ newName: e.target.value } as any)} 
              style={inputStyle}
            />
          </div>
        );

      case 'FILL_NULLS':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).method} onChange={e => onUpdate({ method: e.target.value } as any)} style={selectStyle}>
              <option value="mean">Mean (Average)</option>
              <option value="median">Median</option>
              <option value="mode">Mode</option>
              <option value="fixed">Fixed Value</option>
            </select>
            {(step as any).method === 'fixed' && (
              <>
                <input type="text" placeholder="Fixed value..." value={(step as any).fixedValue || ''} onChange={e => onUpdate({ fixedValue: e.target.value } as any)} style={{...inputStyle, borderColor: getErrorFor('fixedValue') ? 'var(--error)' : 'var(--surface-border)'}} />
                {renderError('fixedValue')}
              </>
            )}
          </div>
        );

      case 'CONVERT_TYPE':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).targetType} onChange={e => onUpdate({ targetType: e.target.value } as any)} style={selectStyle}>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
            </select>
          </div>
        );

      case 'NORMALIZE_TEXT':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).action} onChange={e => onUpdate({ action: e.target.value } as any)} style={selectStyle}>
              <option value="lowercase">lowercase</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="trim">Trim Spaces</option>
            </select>
          </div>
        );

      case 'FILTER_ROWS':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).operator} onChange={e => onUpdate({ operator: e.target.value } as any)} style={selectStyle}>
              <option value="equals">=</option>
              <option value="not_equals">!=</option>
              <option value="greater_than">&gt;</option>
              <option value="less_than">&lt;</option>
              <option value="contains">Contains</option>
            </select>
            <input type="text" placeholder="Value..." value={(step as any).value || ''} onChange={e => onUpdate({ value: e.target.value } as any)} style={{...inputStyle, borderColor: getErrorFor('value') ? 'var(--error)' : 'var(--surface-border)'}} />
            {renderError('value')}
          </div>
        );

      case 'SORT_DATA':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).direction} onChange={e => onUpdate({ direction: e.target.value } as any)} style={selectStyle}>
              <option value="asc">Ascending (A-Z, 0-9)</option>
              <option value="desc">Descending (Z-A, 9-0)</option>
            </select>
          </div>
        );

      case 'CALCULATED_COLUMN':
        const expression = (step as any).expression || '';
        const insertToken = (token: string) => {
          const newExp = expression + (expression.endsWith(' ') || expression === '' ? '' : ' ') + token + ' ';
          onUpdate({ expression: newExp } as any);
        };
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input type="text" placeholder="New column name" value={(step as any).newColumnName || ''} onChange={e => onUpdate({ newColumnName: e.target.value } as any)} style={inputStyle} />
            <input type="text" placeholder="e.g. [Price] * 2" value={expression} onChange={e => onUpdate({ expression: e.target.value } as any)} style={{...inputStyle, background: 'rgba(0,0,0,0.2)', fontFamily: 'monospace'}} />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {columns.map(c => (
                <button 
                  key={c} onClick={() => insertToken(`[${c}]`)} 
                  style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {c}
                </button>
              ))}
              <div style={{ width: '1px', background: 'var(--surface-border)', margin: '0 0.5rem' }} />
              {['+', '-', '*', '/'].map(op => (
                <button 
                  key={op} onClick={() => insertToken(op)} 
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        );

      case 'MASK_DATA':
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={(step as any).maskType} onChange={e => onUpdate({ maskType: e.target.value } as any)} style={selectStyle}>
              <option value="asterisk">Asterisk (***)</option>
              <option value="hash">Hash (SHA-256 Mock)</option>
            </select>
          </div>
        );

      case 'GROUP_BY':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '60px' }}>Group By</span>
              <select value={(step as any).groupByColumn} onChange={e => onUpdate({ groupByColumn: e.target.value } as any)} style={selectStyle}>
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '60px' }}>Calculate</span>
              <select value={(step as any).operation} onChange={e => onUpdate({ operation: e.target.value } as any)} style={{ ...selectStyle, maxWidth: '100px' }}>
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="min">Min</option>
                <option value="max">Max</option>
                <option value="count">Count</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>of</span>
              <select value={(step as any).aggregationColumn} onChange={e => onUpdate({ aggregationColumn: e.target.value } as any)} style={selectStyle}>
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        );

      case 'FUZZY_DEDUPLICATE':
        return (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={(step as any).column} onChange={e => onUpdate({ column: e.target.value } as any)} style={selectStyle}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Similarity</span>
              <input 
                type="number" 
                min="50" max="100" 
                value={Number((step as any).threshold) || 85} 
                onChange={e => onUpdate({ threshold: Number(e.target.value) } as any)} 
                style={{ ...inputStyle, maxWidth: '80px' }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>%</span>
            </div>
          </div>
        );
      
      default:
        return <p style={{ fontSize: '0.875rem' }}>Configuration not available.</p>;
    }
  };

  const getStepTitle = () => {
    return step.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '1rem', position: 'relative', opacity: errors ? 0.9 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {dragHandleProps && (
            <div {...dragHandleProps} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <GripVertical size={16} />
            </div>
          )}
          <Settings size={16} color={errors ? "var(--error)" : "var(--primary)"} />
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: errors ? "var(--error)" : "inherit" }}>{getStepTitle()}</h4>
        </div>
        <button onClick={onRemove} style={{ color: 'var(--error)', padding: '0.25rem', borderRadius: '4px' }}>
          <Trash2 size={16} />
        </button>
      </div>
      <div>
        {renderControls()}
      </div>
    </div>
  );
}

const selectStyle = {
  background: 'var(--surface-hover)',
  border: '1px solid var(--surface-border)',
  color: 'inherit',
  padding: '0.5rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  flex: 1,
  outline: 'none'
};

const inputStyle = {
  ...selectStyle,
  width: '100%'
};
