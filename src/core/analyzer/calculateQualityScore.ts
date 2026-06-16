import { Dataset } from '@/types/dataset';
import { QualityReport, ColumnProfile } from '@/types/quality';
import { inferColumnType } from './inferColumnTypes';
import { countNulls } from './detectNulls';
import { countUniqueValues, countDuplicateRows } from './detectDuplicates';
import { calculateStatsAndOutliers } from './detectOutliers';

export function calculateQualityScore(dataset: Dataset): QualityReport {
  const { columns, rows } = dataset;
  const rowCount = rows.length;
  const columnCount = columns.length;
  
  const duplicateRows = countDuplicateRows(rows);
  const warnings: string[] = [];

  const columnProfiles: ColumnProfile[] = columns.map(col => {
    const inferredType = inferColumnType(rows, col);
    const nullCount = countNulls(rows, col);
    const nullPercentage = rowCount > 0 ? (nullCount / rowCount) * 100 : 0;
    const uniqueCount = countUniqueValues(rows, col);
    
    const nonNullCount = rowCount - nullCount;
    const duplicateCount = Math.max(0, nonNullCount - uniqueCount);

    let stats = { outlierCount: 0, min: undefined as number | undefined, max: undefined as number | undefined, mean: undefined as number | undefined };
    if (inferredType === 'number') {
      const raw = calculateStatsAndOutliers(rows, col);
      stats = { outlierCount: raw.outlierCount, min: raw.min, max: raw.max, mean: raw.mean };
    }

    if (nullPercentage > 10) {
      warnings.push(`${nullPercentage.toFixed(1)}% de valores ausentes na coluna "${col}"`);
    }
    if (stats.outlierCount > 0) {
      warnings.push(`${stats.outlierCount} outliers na coluna "${col}"`);
    }
    if (inferredType === 'mixed') {
      warnings.push(`Coluna "${col}" possui inconsistência de tipo (tipos mistos)`);
    }

    let topFrequencies: {value: string, count: number}[] | undefined;
    if (inferredType === 'string' || inferredType === 'mixed' || inferredType === 'boolean') {
      const counts: Record<string, number> = {};
      for (const row of rows) {
        const val = row[col];
        if (val !== null && val !== undefined && val !== '') {
          const strVal = String(val);
          counts[strVal] = (counts[strVal] || 0) + 1;
        }
      }
      topFrequencies = Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    let distribution: {range: string, count: number}[] | undefined;
    if (inferredType === 'number' && stats.min !== undefined && stats.max !== undefined && stats.min !== stats.max) {
      const buckets = 10;
      const step = (stats.max - stats.min) / buckets;
      const bucketCounts = new Array(buckets).fill(0);
      
      for (const row of rows) {
        const val = row[col];
        if (typeof val === 'number') {
          let bucketIndex = Math.floor((val - stats.min) / step);
          if (bucketIndex === buckets) bucketIndex--; // handle exactly max value
          bucketCounts[bucketIndex]++;
        }
      }
      
      distribution = bucketCounts.map((count, i) => {
        const rangeStart = stats.min! + (i * step);
        const rangeEnd = rangeStart + step;
        return {
          range: `${rangeStart.toFixed(1)} - ${rangeEnd.toFixed(1)}`,
          count
        };
      });
    }

    const recommendedActions: { label: string, actionType: string, actionPayload: any }[] = [];
    
    if (nullCount > 0) {
      recommendedActions.push({
        label: "Fill Nulls (Mean/Mode)",
        actionType: "FILL_NULLS",
        actionPayload: { column: col, method: inferredType === 'number' ? 'mean' : 'mode' }
      });
      recommendedActions.push({
        label: "Drop Null Rows",
        actionType: "REMOVE_NULLS",
        actionPayload: { column: col }
      });
    }

    if (inferredType === 'mixed') {
      recommendedActions.push({
        label: "Convert to String",
        actionType: "CONVERT_TYPE",
        actionPayload: { column: col, targetType: 'string' }
      });
    }

    return {
      column: col,
      inferredType,
      nullCount,
      nullPercentage,
      uniqueCount,
      duplicateCount,
      outlierCount: stats.outlierCount,
      min: stats.min,
      max: stats.max,
      mean: stats.mean,
      topFrequencies,
      distribution,
      recommendedActions
    };
  });

  if (duplicateRows > 0) {
    warnings.unshift(`${duplicateRows} linhas duplicadas no dataset`);
  }

  let score = 100;
  
  const totalNulls = columnProfiles.reduce((acc, col) => acc + col.nullCount, 0);
  const totalCells = rowCount * columnCount;
  const overallNullPercentage = totalCells > 0 ? totalNulls / totalCells : 0;
  score -= Math.min(30, overallNullPercentage * 100);

  const duplicatePercentage = rowCount > 0 ? duplicateRows / rowCount : 0;
  score -= Math.min(20, duplicatePercentage * 100);

  const totalOutliers = columnProfiles.reduce((acc, col) => acc + (col.outlierCount || 0), 0);
  const outlierPercentage = totalCells > 0 ? totalOutliers / totalCells : 0;
  score -= Math.min(10, outlierPercentage * 100);

  const mixedCols = columnProfiles.filter(c => c.inferredType === 'mixed').length;
  score -= Math.min(10, (mixedCols / columnCount) * 100);

  const completeness = 100 - Math.min(100, overallNullPercentage * 100);
  const uniqueness = 100 - Math.min(100, duplicatePercentage * 100);
  const validity = 100 - Math.min(100, outlierPercentage * 100);
  const consistency = 100 - Math.min(100, (mixedCols / columnCount) * 100);

  score = Math.max(0, Math.round(score));

  const dimensions = {
    completeness: Math.round(completeness),
    uniqueness: Math.round(uniqueness),
    consistency: Math.round(consistency),
    validity: Math.round(validity)
  };

  return {
    score,
    rowCount,
    columnCount,
    duplicateRows,
    columns: columnProfiles,
    warnings,
    dimensions
  };
}
