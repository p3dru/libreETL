import { DataRow } from '@/types/dataset';

export function countNulls(rows: DataRow[], column: string): number {
  return rows.reduce((count, row) => {
    const val = row[column];
    if (val === null || val === undefined || val === '') {
      return count + 1;
    }
    return count;
  }, 0);
}
