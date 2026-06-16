import React, { useState, useEffect } from 'react';
import { TransformationStep, TransformationType, PipelineTemplate } from '@/types/pipeline';
import TransformationBlock from './TransformationBlock';
import { Plus, GitMerge, Save, Download, Upload } from 'lucide-react';
import { db } from '@/core/db';
import { customPrompt, customAlert } from '@/core/ui/customDialogs';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TransformationBlock 
        {...props.blockProps}
        dragHandleProps={{...attributes, ...listeners}}
      />
      {!props.isLast && (
        <div style={{ width: '2px', height: '1rem', background: 'var(--surface-border)', margin: '0 auto' }} />
      )}
    </div>
  );
}

interface PipelineBuilderProps {
  steps: TransformationStep[];
  onChange: (steps: TransformationStep[]) => void;
  columns: string[];
}

export default function PipelineBuilder({ steps, onChange, columns }: PipelineBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<PipelineTemplate[]>([]);

  // Compute available columns so newly created columns can be selected in subsequent steps
  const availableColumns = [...columns];
  steps.forEach(step => {
    if (step.type === 'CALCULATED_COLUMN' && step.newColumnName) {
      if (!availableColumns.includes(step.newColumnName)) {
        availableColumns.push(step.newColumnName);
      }
    }
  });

  useEffect(() => {
    if (showTemplates) {
      db.pipelineTemplates.toArray().then(setTemplates);
    }
  }, [showTemplates]);

  const handleSaveTemplate = async () => {
    const name = await customPrompt("Name this pipeline recipe:");
    if (!name) return;
    const template: PipelineTemplate = {
      id: crypto.randomUUID(),
      name,
      steps,
      createdAt: Date.now()
    };
    await db.pipelineTemplates.add(template);
    await customAlert('Recipe saved locally!');
  };

  const handleLoadTemplate = (template: PipelineTemplate) => {
    onChange(template.steps);
    setShowTemplates(false);
  };

  const handleExportTemplate = async () => {
    if (steps.length === 0) {
      await customAlert("Pipeline is empty.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(steps));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "pipeline_recipe.json");
    dlAnchorElem.click();
  };

  const handleImportTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => { 
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = readerEvent => {
        try {
          const content = readerEvent.target?.result;
          const parsed = JSON.parse(content as string);
          if (Array.isArray(parsed)) {
            onChange(parsed);
          }
        } catch (e) {
          customAlert('Invalid template file.');
        }
      }
      reader.readAsText(file);
    };
    input.click();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex(s => s.id === active.id);
      const newIndex = steps.findIndex(s => s.id === over?.id);
      onChange(arrayMove(steps, oldIndex, newIndex));
    }
  };

  const handleAddStep = (type: TransformationType) => {
    const newStep: any = { id: crypto.randomUUID(), type };
    
    if (type === 'REMOVE_NULLS' || type === 'REMOVE_COLUMN' || type === 'CONVERT_TYPE' || type === 'NORMALIZE_TEXT') {
      newStep.column = columns[0] || '';
    }
    if (type === 'FILL_NULLS') {
      newStep.column = columns[0] || '';
      newStep.method = 'mean';
    }
    if (type === 'RENAME_COLUMN') {
      newStep.oldName = columns[0] || '';
      newStep.newName = `${columns[0] || ''}_renamed`;
    }
    if (type === 'CONVERT_TYPE') {
      newStep.targetType = 'string';
    }
    if (type === 'NORMALIZE_TEXT') {
      newStep.action = 'trim';
    }
    if (type === 'FILTER_ROWS') {
      newStep.column = columns[0] || '';
      newStep.operator = 'equals';
      newStep.value = '';
    }
    if (type === 'SORT_DATA') {
      newStep.column = columns[0] || '';
      newStep.direction = 'asc';
    }
    if (type === 'CALCULATED_COLUMN') {
      newStep.newColumnName = 'new_column';
      newStep.expression = '1 + 1';
    }
    if (type === 'MASK_DATA') {
      newStep.column = columns[0] || '';
      newStep.maskType = 'asterisk';
    }
    if (type === 'GROUP_BY') {
      newStep.groupByColumn = columns[0] || '';
      newStep.aggregationColumn = columns[0] || '';
      newStep.operation = 'sum';
    }
    if (type === 'FUZZY_DEDUPLICATE') {
      newStep.column = columns[0] || '';
      newStep.threshold = 85;
    }

    onChange([...steps, newStep as TransformationStep]);
    setIsAdding(false);
  };

  const updateStep = (id: string, updated: Partial<TransformationStep>) => {
    onChange(steps.map(s => s.id === id ? { ...s, ...updated } as TransformationStep : s));
  };

  const removeStep = (id: string) => {
    onChange(steps.filter(s => s.id !== id));
  };

  const availableTypes: { type: TransformationType, label: string, description: string }[] = [
    { type: 'REMOVE_DUPLICATES', label: 'Remove Duplicates', description: 'Deletes identical rows based on selected columns.' },
    { type: 'REMOVE_NULLS', label: 'Drop Nulls', description: 'Removes any row that contains empty/null values in the chosen column.' },
    { type: 'FILL_NULLS', label: 'Fill Nulls', description: 'Replaces empty/null values with a default text or number.' },
    { type: 'RENAME_COLUMN', label: 'Rename Column', description: 'Changes the title of an existing column.' },
    { type: 'REMOVE_COLUMN', label: 'Drop Column', description: 'Deletes an entire column from the dataset.' },
    { type: 'CONVERT_TYPE', label: 'Convert Type', description: 'Changes the data format (e.g. Text to Number or Date).' },
    { type: 'NORMALIZE_TEXT', label: 'Normalize Text', description: 'Standardizes text (UPPERCASE, lowercase, Trim spaces).' },
    { type: 'FILTER_ROWS', label: 'Filter Rows', description: 'Keeps or removes rows that match a specific condition.' },
    { type: 'SORT_DATA', label: 'Sort Data', description: 'Orders rows alphabetically or numerically (A-Z, Z-A).' },
    { type: 'CALCULATED_COLUMN', label: 'Calculated Column', description: 'Creates a new column using math formulas (e.g. Qtd * Price).' },
    { type: 'MASK_DATA', label: 'Mask Data (LGPD)', description: 'Anonymizes sensitive info like Emails or Documents.' },
    { type: 'GROUP_BY', label: 'Group By / Pivot', description: 'Groups rows and calculates sums, averages, or counts.' },
    { type: 'FUZZY_DEDUPLICATE', label: 'Fuzzy Deduplicate', description: 'Finds and merges similar texts with typos (e.g. "Jonh" and "John").' }
  ];

  return (
    <div className="glass" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <GitMerge className="text-primary" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pipeline Builder</h3>
        </div>
        <button onClick={() => setShowTemplates(!showTemplates)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          {showTemplates ? 'Close Recipes' : 'Recipes'}
        </button>
      </div>

      {showTemplates && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={handleSaveTemplate} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem' }}><Save size={14}/> Save Current</button>
            <button onClick={handleExportTemplate} className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem' }}><Download size={14}/> Export</button>
            <button onClick={handleImportTemplate} className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem' }}><Upload size={14}/> Import</button>
          </div>
          {templates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Saved Local Recipes:</span>
              {templates.map(t => (
                <button key={t.id} onClick={() => handleLoadTemplate(t)} style={{ textAlign: 'left', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.steps.length} steps</div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>No saved recipes found.</p>
          )}
        </div>
      )}
      
      <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <p>Your pipeline is empty.</p>
            <p style={{ fontSize: '0.875rem' }}>Add a step below to start transforming data.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {steps.map((step, idx) => (
                <SortableItem
                  key={step.id}
                  id={step.id}
                  isLast={idx === steps.length - 1}
                  blockProps={{
                    step,
                    columns: availableColumns,
                    onUpdate: (updates: Partial<TransformationStep>) => updateStep(step.id, updates),
                    onRemove: () => removeStep(step.id)
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <div style={{ marginTop: '1rem', position: 'relative' }}>
          {isAdding ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Select Transformation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {availableTypes.map(t => (
                  <button 
                    key={t.type} 
                    onClick={() => handleAddStep(t.type)}
                    title={t.description}
                    style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', fontSize: '0.875rem', transition: 'background 0.2s', border: 'none', color: 'inherit', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsAdding(false)} 
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              style={{ width: '100%', padding: '1rem', border: '2px dashed var(--surface-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8', transition: 'all 0.2s', background: 'transparent', cursor: 'pointer' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <Plus size={18} /> Add Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
