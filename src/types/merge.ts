/**
 * Supported join types for merging two datasets.
 *
 * - `inner`:      Only rows with a matching key in BOTH datasets.
 * - `left`:       ALL rows from the left dataset; nulls where no match on the right.
 * - `right`:      ALL rows from the right dataset; nulls where no match on the left.
 * - `full_outer`: ALL rows from BOTH datasets; nulls in gaps.
 * - `union`:      Vertical concatenation (no key required). Columns must be compatible.
 */
export type JoinType = 'inner' | 'left' | 'right' | 'full_outer' | 'union';

/**
 * Strategy for resolving columns that exist in BOTH datasets under the same name
 * (excluding the join key columns themselves).
 *
 * - `keep_left`:  Use only the left dataset's value, discard the right column.
 * - `keep_right`: Use only the right dataset's value, discard the left column.
 * - `suffix`:     Keep both, renaming them with `suffixLeft` / `suffixRight`.
 */
export type ConflictStrategy = 'keep_left' | 'keep_right' | 'suffix';

/** Full configuration for a merge operation between two saved datasets. */
export interface MergeConfig {
  /** ID of the "left" dataset (from IndexedDB). */
  leftDatasetId: string;

  /** ID of the "right" dataset (from IndexedDB). */
  rightDatasetId: string;

  /** How to join the two datasets. */
  joinType: JoinType;

  /**
   * Column in the left dataset used as the join key.
   * Ignored when `joinType === 'union'`.
   */
  leftKey: string;

  /**
   * Column in the right dataset used as the join key.
   * Ignored when `joinType === 'union'`.
   */
  rightKey: string;

  /** How to handle columns with the same name in both datasets. */
  conflictStrategy: ConflictStrategy;

  /** Suffix appended to left-side columns when `conflictStrategy === 'suffix'`. Default: `"_left"` */
  suffixLeft?: string;

  /** Suffix appended to right-side columns when `conflictStrategy === 'suffix'`. Default: `"_right"` */
  suffixRight?: string;
}
