import { Dataset, DataRow } from '@/types/dataset';
import { MergeConfig } from '@/types/merge';

/**
 * Merges two datasets according to the provided MergeConfig.
 * The operation is non-destructive — it never mutates the original datasets.
 *
 * Supported join types:
 *  - inner      → rows with a key match in both
 *  - left       → all left rows, nulls where no right match
 *  - right      → all right rows, nulls where no left match
 *  - full_outer → all rows from both, nulls in gaps
 *  - union      → vertical concatenation (key columns ignored)
 */
export function mergeDatasets(left: Dataset, right: Dataset, config: MergeConfig): Dataset {
  const {
    joinType,
    leftKey,
    rightKey,
    conflictStrategy,
    suffixLeft = '_left',
    suffixRight = '_right',
  } = config;

  /* ─────────────────────────────────────────
   * UNION — simple vertical concatenation
   * ───────────────────────────────────────── */
  if (joinType === 'union') {
    // Build a super-set of all columns in declaration order
    const allCols = Array.from(new Set([...left.columns, ...right.columns]));

    const rows: DataRow[] = [
      ...left.rows.map(row => {
        const out: DataRow = {};
        for (const col of allCols) out[col] = col in row ? row[col] : null;
        return out;
      }),
      ...right.rows.map(row => {
        const out: DataRow = {};
        for (const col of allCols) out[col] = col in row ? row[col] : null;
        return out;
      }),
    ];

    return buildDataset(left, right, allCols, rows);
  }

  /* ─────────────────────────────────────────
   * KEY-BASED JOINS (inner / left / right / full_outer)
   * ───────────────────────────────────────── */

  // 1. Resolve column names — detect conflicts (excluding the key columns)
  const rightNonKey = right.columns.filter(c => c !== rightKey);
  const leftNonKey = left.columns.filter(c => c !== leftKey);

  // Map: right column name → output column name
  const rightColMap: Record<string, string> = {};
  const conflictingCols = new Set<string>(
    rightNonKey.filter(c => leftNonKey.includes(c))
  );

  for (const col of rightNonKey) {
    if (conflictingCols.has(col)) {
      if (conflictStrategy === 'keep_left') {
        // Don't include this right col at all — map to null sentinel
        rightColMap[col] = '__DROP__';
      } else if (conflictStrategy === 'keep_right') {
        // Overwrite left col — use same name (left col will be dropped below)
        rightColMap[col] = col;
      } else {
        // suffix strategy
        rightColMap[col] = col + suffixRight;
      }
    } else {
      rightColMap[col] = col;
    }
  }

  // Build final output columns
  let outCols: string[] = [...left.columns];

  // Rename conflicting left columns when using suffix
  if (conflictStrategy === 'suffix') {
    outCols = outCols.map(c =>
      c !== leftKey && conflictingCols.has(c) ? c + suffixLeft : c
    );
  }
  // Drop conflicting left cols when keep_right wins
  if (conflictStrategy === 'keep_right') {
    outCols = outCols.filter(c => c === leftKey || !conflictingCols.has(c));
  }

  // Add right columns (mapped names, skipping DROPped ones)
  for (const [orig, mapped] of Object.entries(rightColMap)) {
    if (mapped !== '__DROP__' && !outCols.includes(mapped)) {
      outCols.push(mapped);
    }
    void orig; // suppress unused-var lint
  }

  // 2. Build index: rightKey value → array of right rows
  const rightIndex = new Map<string, DataRow[]>();
  for (const row of right.rows) {
    const key = String(row[rightKey] ?? '');
    if (!rightIndex.has(key)) rightIndex.set(key, []);
    rightIndex.get(key)!.push(row);
  }

  // 3. Helper: merge a left row with a right row (or null)
  const mergeRows = (lRow: DataRow, rRow: DataRow | null): DataRow => {
    const out: DataRow = {};

    // Left side
    for (let i = 0; i < left.columns.length; i++) {
      const origCol = left.columns[i];
      const outCol = outCols[i]; // matches because we built outCols from left.columns above
      if (conflictStrategy === 'suffix' && conflictingCols.has(origCol) && origCol !== leftKey) {
        out[origCol + suffixLeft] = lRow[origCol] ?? null;
      } else if (conflictStrategy === 'keep_right' && conflictingCols.has(origCol) && origCol !== leftKey) {
        // skip — right will overwrite
      } else {
        out[outCol] = lRow[origCol] ?? null;
      }
    }

    // Right side
    for (const [orig, mapped] of Object.entries(rightColMap)) {
      if (mapped === '__DROP__') continue;
      out[mapped] = rRow ? (rRow[orig] ?? null) : null;
    }

    return out;
  };

  const rows: DataRow[] = [];
  const matchedRightKeys = new Set<string>();

  // 4. Scan left rows
  for (const lRow of left.rows) {
    const key = String(lRow[leftKey] ?? '');
    const matches = rightIndex.get(key);

    if (matches && matches.length > 0) {
      matchedRightKeys.add(key);
      for (const rRow of matches) {
        rows.push(mergeRows(lRow, rRow));
      }
    } else {
      // No match on the right
      if (joinType === 'inner') continue; // skip unmatched left rows
      rows.push(mergeRows(lRow, null)); // left / full_outer: keep with nulls
    }
  }

  // 5. For right / full_outer: add unmatched right rows
  if (joinType === 'right' || joinType === 'full_outer') {
    for (const rRow of right.rows) {
      const key = String(rRow[rightKey] ?? '');
      if (!matchedRightKeys.has(key)) {
        // Build a null-filled left row
        const nullLeft: DataRow = {};
        for (const col of left.columns) nullLeft[col] = null;
        rows.push(mergeRows(nullLeft, rRow));
      }
    }
  }

  return buildDataset(left, right, outCols, rows);
}

/** Utility: assemble the output Dataset object */
function buildDataset(left: Dataset, right: Dataset, columns: string[], rows: DataRow[]): Dataset {
  return {
    id: crypto.randomUUID(),
    name: `${left.name} ⋈ ${right.name}`,
    columns,
    rows,
    createdAt: Date.now(),
  };
}
