import * as XLSX from 'xlsx';
import { Dataset } from '@/types/dataset';

export function exportToXlsx(dataset: Dataset) {
  const worksheet = XLSX.utils.json_to_sheet(dataset.rows, { header: dataset.columns });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaned Data");
  
  XLSX.writeFile(workbook, `${dataset.name.replace(/\.[^/.]+$/, "")}_cleaned.xlsx`);
}
