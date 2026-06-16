export type ValueFrequency = { value: string; count: number };
export type DistributionBucket = { range: string; count: number };

export type RecommendedAction = {
  label: string;
  actionType: string;
  actionPayload: any;
};

export type ColumnProfile = {
  column: string;
  inferredType: "string" | "number" | "date" | "boolean" | "mixed";
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  duplicateCount: number;
  outlierCount?: number;
  min?: number;
  max?: number;
  mean?: number;
  topFrequencies?: ValueFrequency[];
  distribution?: DistributionBucket[];
  recommendedActions?: RecommendedAction[];
};

export type QualityDimensions = {
  completeness: number;
  uniqueness: number;
  consistency: number;
  validity: number;
};

export type QualityReport = {
  score: number;
  rowCount: number;
  columnCount: number;
  duplicateRows: number;
  columns: ColumnProfile[];
  warnings: string[];
  dimensions: QualityDimensions;
};
