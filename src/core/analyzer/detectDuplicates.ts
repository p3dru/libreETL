import { DataRow } from '@/types/dataset';

export function countUniqueValues(rows: DataRow[], column: string): number {
  const uniqueSet = new Set();
  for (const row of rows) {
    const val = row[column];
    if (val !== null && val !== undefined && val !== '') {
      uniqueSet.add(val);
    }
  }
  return uniqueSet.size;
}

export function countDuplicateRows(rows: DataRow[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  for (const row of rows) {
    const str = JSON.stringify(row);
    if (seen.has(str)) {
      duplicates++;
    } else {
      seen.add(str);
    }
  }
  return duplicates;
}
