import { z } from 'zod';

export type TransformationType = 
  | 'REMOVE_DUPLICATES'
  | 'REMOVE_NULLS'
  | 'FILL_NULLS'
  | 'RENAME_COLUMN'
  | 'REMOVE_COLUMN'
  | 'CONVERT_TYPE'
  | 'NORMALIZE_TEXT'
  | 'FILTER_ROWS'
  | 'SORT_DATA'
  | 'CALCULATED_COLUMN'
  | 'MASK_DATA'
  | 'GROUP_BY'
  | 'FUZZY_DEDUPLICATE';

export interface BaseTransformation {
  id: string;
  type: TransformationType;
}

export interface RemoveDuplicatesParams extends BaseTransformation {
  type: 'REMOVE_DUPLICATES';
  // If no columns specified, check entire row. Otherwise, check based on specific columns
  columns?: string[]; 
}

export interface RemoveNullsParams extends BaseTransformation {
  type: 'REMOVE_NULLS';
  column: string;
}

export interface FillNullsParams extends BaseTransformation {
  type: 'FILL_NULLS';
  column: string;
  method: 'mean' | 'median' | 'mode' | 'fixed';
  fixedValue?: string | number;
}

export interface RenameColumnParams extends BaseTransformation {
  type: 'RENAME_COLUMN';
  oldName: string;
  newName: string;
}

export interface RemoveColumnParams extends BaseTransformation {
  type: 'REMOVE_COLUMN';
  column: string;
}

export interface ConvertTypeParams extends BaseTransformation {
  type: 'CONVERT_TYPE';
  column: string;
  targetType: 'string' | 'number' | 'date' | 'boolean';
}

export interface NormalizeTextParams extends BaseTransformation {
  type: 'NORMALIZE_TEXT';
  column: string;
  action: 'lowercase' | 'uppercase' | 'trim';
}

export interface FilterRowsParams extends BaseTransformation {
  type: 'FILTER_ROWS';
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface SortDataParams extends BaseTransformation {
  type: 'SORT_DATA';
  column: string;
  direction: 'asc' | 'desc';
}

export interface CalculatedColumnParams extends BaseTransformation {
  type: 'CALCULATED_COLUMN';
  newColumnName: string;
  // very basic formula, e.g. "colA * 2" or "colA + colB"
  expression: string; 
}

export interface MaskDataParams extends BaseTransformation {
  type: 'MASK_DATA';
  column: string;
  maskType: 'asterisk' | 'hash';
}

export interface GroupByParams extends BaseTransformation {
  type: 'GROUP_BY';
  groupByColumn: string;
  aggregationColumn: string;
  operation: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export interface FuzzyDeduplicateParams extends BaseTransformation {
  type: 'FUZZY_DEDUPLICATE';
  column: string;
  threshold: number; // percentage 0 to 100
}

export type TransformationStep = 
  | RemoveDuplicatesParams
  | RemoveNullsParams
  | FillNullsParams
  | RenameColumnParams
  | RemoveColumnParams
  | ConvertTypeParams
  | NormalizeTextParams
  | FilterRowsParams
  | SortDataParams
  | CalculatedColumnParams
  | MaskDataParams
  | GroupByParams
  | FuzzyDeduplicateParams;

export interface Pipeline {
  id: string;
  datasetId: string;
  steps: TransformationStep[];
}

export interface PipelineTemplate {
  id: string;
  name: string;
  description?: string;
  steps: TransformationStep[];
  createdAt: number;
}

export const RemoveDuplicatesSchema = z.object({
  id: z.string(),
  type: z.literal('REMOVE_DUPLICATES'),
  columns: z.array(z.string()).optional()
});

export const RemoveNullsSchema = z.object({
  id: z.string(),
  type: z.literal('REMOVE_NULLS'),
  column: z.string().min(1, "Selecione uma coluna")
});

export const FillNullsSchema = z.object({
  id: z.string(),
  type: z.literal('FILL_NULLS'),
  column: z.string().min(1, "Selecione uma coluna"),
  method: z.enum(['mean', 'median', 'mode', 'fixed']),
  fixedValue: z.union([z.string(), z.number()]).optional()
}).refine(data => {
  if (data.method === 'fixed' && (data.fixedValue === undefined || data.fixedValue === '')) {
    return false;
  }
  return true;
}, {
  message: "Valor fixo é obrigatório",
  path: ['fixedValue']
});

export const RenameColumnSchema = z.object({
  id: z.string(),
  type: z.literal('RENAME_COLUMN'),
  oldName: z.string().min(1, "Selecione uma coluna"),
  newName: z.string().min(1, "Novo nome é obrigatório")
});

export const RemoveColumnSchema = z.object({
  id: z.string(),
  type: z.literal('REMOVE_COLUMN'),
  column: z.string().min(1, "Selecione uma coluna")
});

export const ConvertTypeSchema = z.object({
  id: z.string(),
  type: z.literal('CONVERT_TYPE'),
  column: z.string().min(1, "Selecione uma coluna"),
  targetType: z.enum(['string', 'number', 'date', 'boolean'])
});

export const NormalizeTextSchema = z.object({
  id: z.string(),
  type: z.literal('NORMALIZE_TEXT'),
  column: z.string().min(1, "Selecione uma coluna"),
  action: z.enum(['lowercase', 'uppercase', 'trim'])
});

export const FilterRowsSchema = z.object({
  id: z.string(),
  type: z.literal('FILTER_ROWS'),
  column: z.string().min(1, "Selecione uma coluna"),
  operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains']),
  value: z.union([z.string().min(1, "Valor é obrigatório"), z.number()]).optional()
}).refine(data => {
  if (data.value === undefined || data.value === '') {
    return false;
  }
  return true;
}, {
  message: "Valor é obrigatório",
  path: ['value']
});

export const SortDataSchema = z.object({
  id: z.string(),
  type: z.literal('SORT_DATA'),
  column: z.string().min(1, "Selecione uma coluna"),
  direction: z.enum(['asc', 'desc'])
});

export const CalculatedColumnSchema = z.object({
  id: z.string(),
  type: z.literal('CALCULATED_COLUMN'),
  newColumnName: z.string().min(1, "Nome da coluna é obrigatório"),
  expression: z.string().min(1, "Expressão é obrigatória")
});

export const MaskDataSchema = z.object({
  id: z.string(),
  type: z.literal('MASK_DATA'),
  column: z.string().min(1, "Selecione uma coluna"),
  maskType: z.enum(['asterisk', 'hash'])
});

export const GroupBySchema = z.object({
  id: z.string(),
  type: z.literal('GROUP_BY'),
  groupByColumn: z.string().min(1, "Coluna de agrupamento obrigatória"),
  aggregationColumn: z.string().min(1, "Coluna de agregação obrigatória"),
  operation: z.enum(['sum', 'avg', 'min', 'max', 'count'])
});

export const FuzzyDeduplicateSchema = z.object({
  id: z.string(),
  type: z.literal('FUZZY_DEDUPLICATE'),
  column: z.string().min(1, "Selecione uma coluna"),
  threshold: z.number().min(50).max(100)
});

export const TransformationStepSchema = z.discriminatedUnion("type", [
  RemoveDuplicatesSchema,
  RemoveNullsSchema,
  FillNullsSchema,
  RenameColumnSchema,
  RemoveColumnSchema,
  ConvertTypeSchema,
  NormalizeTextSchema,
  FilterRowsSchema,
  SortDataSchema,
  CalculatedColumnSchema,
  MaskDataSchema,
  GroupBySchema,
  FuzzyDeduplicateSchema
]);

