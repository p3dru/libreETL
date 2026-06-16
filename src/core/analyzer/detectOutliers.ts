import { DataRow } from '@/types/dataset';

export function calculateStatsAndOutliers(rows: DataRow[], column: string): { min?: number, max?: number, mean?: number, outlierCount: number } {
  const numericValues: number[] = [];

  for (const row of rows) {
    const val = row[column];
    if (val !== null && val !== undefined && val !== '') {
      const num = Number(val);
      if (!isNaN(num)) {
        numericValues.push(num);
      }
    }
  }

  if (numericValues.length === 0) return { outlierCount: 0 };

  numericValues.sort((a, b) => a - b);
  
  const min = numericValues[0];
  const max = numericValues[numericValues.length - 1];
  const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;

  const q1 = d3Quantile(numericValues, 0.25);
  const q3 = d3Quantile(numericValues, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  let outlierCount = 0;
  for (const val of numericValues) {
    if (val < lowerBound || val > upperBound) {
      outlierCount++;
    }
  }

  return { min, max, mean, outlierCount };
}

function d3Quantile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];

  const index = (arr.length - 1) * p;
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index % 1;

  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}
