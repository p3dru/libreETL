import { Dataset } from '@/types/dataset';
import { TransformationStep } from '@/types/pipeline';

export function exportToJsonReport(dataset: Dataset, originalDataset: Dataset, steps: TransformationStep[]) {
  const report = {
    original_dataset: {
      name: originalDataset.name,
      rows: originalDataset.rows.length,
      columns: originalDataset.columns.length
    },
    cleaned_dataset: {
      name: `${dataset.name.replace(/\\.[^/.]+$/, "")}_cleaned.csv`,
      rows: dataset.rows.length,
      columns: dataset.columns.length
    },
    pipeline_steps: steps,
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataset.name.replace(/\\.[^/.]+$/, "")}_report.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
