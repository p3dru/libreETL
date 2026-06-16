import Papa from 'papaparse';
import { Dataset } from '@/types/dataset';

export function exportToCsv(dataset: Dataset) {
  const csv = Papa.unparse(dataset.rows, {
    columns: dataset.columns
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataset.name.replace(/\\.[^/.]+$/, "")}_cleaned.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
