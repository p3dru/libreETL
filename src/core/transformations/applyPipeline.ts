import { Dataset, DataRow } from '@/types/dataset';
import { TransformationStep } from '@/types/pipeline';
import { evaluateFormula } from './formulaParser';
import { syncHash } from './hash';
import { stringSimilarity } from './stringMetrics';

export function applyPipeline(dataset: Dataset, steps: TransformationStep[]): Dataset {
  let currentRows = dataset.rows.map(row => ({ ...row }));
  let currentColumns = [...dataset.columns];

  for (const step of steps) {
    switch (step.type) {
      case 'REMOVE_DUPLICATES': {
        const seen = new Set<string>();
        currentRows = currentRows.filter(row => {
          const str = JSON.stringify(row);
          if (seen.has(str)) return false;
          seen.add(str);
          return true;
        });
        break;
      }
      
      case 'REMOVE_NULLS': {
        currentRows = currentRows.filter(row => {
          const val = row[step.column];
          return val !== null && val !== undefined && val !== '';
        });
        break;
      }
      
      case 'FILL_NULLS': {
        let fillValue: any = step.fixedValue;

        if (step.method !== 'fixed') {
          const nonNulls = currentRows
            .map(row => Number(row[step.column]))
            .filter(val => !isNaN(val));

          if (nonNulls.length > 0) {
            nonNulls.sort((a, b) => a - b);
            if (step.method === 'mean') {
              fillValue = nonNulls.reduce((a, b) => a + b, 0) / nonNulls.length;
            } else if (step.method === 'median') {
              const mid = Math.floor(nonNulls.length / 2);
              fillValue = nonNulls.length % 2 !== 0 ? nonNulls[mid] : (nonNulls[mid - 1] + nonNulls[mid]) / 2;
            } else if (step.method === 'mode') {
              const freq: Record<number, number> = {};
              let maxFreq = 0;
              let mode = nonNulls[0];
              for (const num of nonNulls) {
                freq[num] = (freq[num] || 0) + 1;
                if (freq[num] > maxFreq) {
                  maxFreq = freq[num];
                  mode = num;
                }
              }
              fillValue = mode;
            }
          }
        }

        currentRows = currentRows.map(row => {
          const val = row[step.column];
          if (val === null || val === undefined || val === '') {
            return { ...row, [step.column]: fillValue };
          }
          return row;
        });
        break;
      }
      
      case 'RENAME_COLUMN': {
        currentColumns = currentColumns.map(col => col === step.oldName ? step.newName : col);
        currentRows = currentRows.map(row => {
          const newRow = { ...row };
          newRow[step.newName] = newRow[step.oldName];
          delete newRow[step.oldName];
          return newRow;
        });
        break;
      }
      
      case 'REMOVE_COLUMN': {
        currentColumns = currentColumns.filter(col => col !== step.column);
        currentRows = currentRows.map(row => {
          const newRow = { ...row };
          delete newRow[step.column];
          return newRow;
        });
        break;
      }
      
      case 'CONVERT_TYPE': {
        currentRows = currentRows.map(row => {
          const val = row[step.column];
          if (val === null || val === undefined || val === '') return row;
          
          let newVal: any = val;
          if (step.targetType === 'number') newVal = Number(val);
          else if (step.targetType === 'string') newVal = String(val);
          else if (step.targetType === 'boolean') newVal = Boolean(val);
          else if (step.targetType === 'date') newVal = new Date(String(val)).toISOString();

          return { ...row, [step.column]: newVal };
        });
        break;
      }

      case 'NORMALIZE_TEXT': {
        currentRows = currentRows.map(row => {
          const val = row[step.column];
          if (typeof val === 'string') {
            let newVal = val;
            if (step.action === 'lowercase') newVal = newVal.toLowerCase();
            if (step.action === 'uppercase') newVal = newVal.toUpperCase();
            if (step.action === 'trim') newVal = newVal.trim();
            return { ...row, [step.column]: newVal };
          }
          return row;
        });
        break;
      }

      case 'FILTER_ROWS': {
        currentRows = currentRows.filter(row => {
          const val = row[step.column];
          if (val === null || val === undefined) return false;

          const strVal = String(val).toLowerCase();
          const targetVal = String(step.value).toLowerCase();

          if (step.operator === 'equals') return strVal === targetVal;
          if (step.operator === 'not_equals') return strVal !== targetVal;
          if (step.operator === 'contains') return strVal.includes(targetVal);
          
          const numVal = Number(val);
          const compVal = Number(step.value);
          if (!isNaN(numVal) && !isNaN(compVal)) {
            if (step.operator === 'greater_than') return numVal > compVal;
            if (step.operator === 'less_than') return numVal < compVal;
          }
          
          return true;
        });
        break;
      }

      case 'SORT_DATA': {
        currentRows = [...currentRows].sort((a, b) => {
          const valA = a[step.column];
          const valB = b[step.column];
          
          if (valA === valB) return 0;
          if (valA === null || valA === undefined || valA === '') return 1;
          if (valB === null || valB === undefined || valB === '') return -1;

          let comp = 0;
          const numA = Number(valA);
          const numB = Number(valB);

          if (!isNaN(numA) && !isNaN(numB)) {
            comp = numA - numB;
          } else {
            comp = String(valA).localeCompare(String(valB));
          }

          return step.direction === 'asc' ? comp : -comp;
        });
        break;
      }

      case 'CALCULATED_COLUMN': {
        if (!currentColumns.includes(step.newColumnName)) {
          currentColumns.push(step.newColumnName);
        }
        
        currentRows = currentRows.map(row => {
          const newValue: any = evaluateFormula(step.expression, row);
          return { ...row, [step.newColumnName]: newValue };
        });
        break;
      }

      case 'MASK_DATA': {
        currentRows = currentRows.map(row => {
          const val = row[step.column];
          if (val === null || val === undefined || val === '') return row;
          
          let newVal = String(val);
          if (step.maskType === 'asterisk') {
            if (newVal.length <= 4) {
              newVal = '****';
            } else {
              const start = newVal.slice(0, 2);
              const end = newVal.slice(-2);
              newVal = `${start}${'*'.repeat(newVal.length - 4)}${end}`;
            }
          } else if (step.maskType === 'hash') {
            newVal = syncHash(newVal);
          }
          
          return { ...row, [step.column]: newVal };
        });
        break;
      }

      case 'GROUP_BY': {
        const { groupByColumn, aggregationColumn, operation } = step;
        const newColName = `${aggregationColumn}_${operation}`;
        
        const groups = new Map<string, { sum: number, count: number, min: number, max: number }>();
        
        for (const row of currentRows) {
          const groupVal = String(row[groupByColumn] || 'Unknown');
          const aggVal = Number(row[aggregationColumn]);
          
          if (!groups.has(groupVal)) {
            groups.set(groupVal, { 
              sum: 0, 
              count: 0, 
              min: !isNaN(aggVal) ? aggVal : Infinity, 
              max: !isNaN(aggVal) ? aggVal : -Infinity 
            });
          }
          
          const stats = groups.get(groupVal)!;
          if (!isNaN(aggVal)) {
            stats.sum += aggVal;
            stats.count += 1;
            if (aggVal < stats.min) stats.min = aggVal;
            if (aggVal > stats.max) stats.max = aggVal;
          } else if (operation === 'count') {
            stats.count += 1; // Count all even if not numeric
          }
        }
        
        currentColumns = [groupByColumn, newColName];
        currentRows = Array.from(groups.entries()).map(([key, stats]) => {
          let result = 0;
          if (operation === 'sum') result = stats.sum;
          else if (operation === 'avg') result = stats.count > 0 ? stats.sum / stats.count : 0;
          else if (operation === 'min') result = stats.min === Infinity ? 0 : stats.min;
          else if (operation === 'max') result = stats.max === -Infinity ? 0 : stats.max;
          else if (operation === 'count') result = stats.count;
          
          return {
            [groupByColumn]: key,
            [newColName]: result
          };
        });
        
        break;
      }

      case 'FUZZY_DEDUPLICATE': {
        const { column, threshold } = step;
        const keptRows: DataRow[] = [];
        const keptValues: string[] = [];

        for (const row of currentRows) {
          const val = row[column];
          if (val === null || val === undefined) {
             keptRows.push(row);
             continue;
          }
          
          const strVal = String(val);
          let isDuplicate = false;
          
          for (const kept of keptValues) {
            if (stringSimilarity(strVal, kept) >= threshold) {
              isDuplicate = true;
              break;
            }
          }
          
          if (!isDuplicate) {
            keptValues.push(strVal);
            keptRows.push(row);
          }
        }
        
        currentRows = keptRows;
        break;
      }
    }
  }

  return {
    ...dataset,
    columns: currentColumns,
    rows: currentRows
  };
}
