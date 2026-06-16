export type DataRow = Record<string, string | number | boolean | null>;

export type Dataset = {
  id: string;
  name: string;
  columns: string[];
  rows: DataRow[];
  createdAt?: number;
};
