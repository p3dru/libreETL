import { DataRow } from '@/types/dataset';

export function inferColumnType(rows: DataRow[], column: string): "string" | "number" | "date" | "boolean" | "mixed" {
  let hasNumber = false;
  let hasString = false;
  let hasBoolean = false;
  let hasDate = false;

  for (const row of rows) {
    const val = row[column];
    if (val === null || val === undefined || val === '') continue;

    if (typeof val === 'boolean') {
      hasBoolean = true;
      continue;
    }

    if (typeof val === 'number') {
      hasNumber = true;
      continue;
    }

    const strVal = String(val).trim();
    
    // Check boolean string
    if (/^(true|false|yes|no)$/i.test(strVal)) {
      hasBoolean = true;
      continue;
    }

    // Check number string
    if (!isNaN(Number(strVal))) {
      hasNumber = true;
      continue;
    }

    // Check date string (very basic ISO or YYYY-MM-DD check to avoid matching normal strings as dates)
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    if (dateRegex.test(strVal) && !isNaN(Date.parse(strVal))) {
      hasDate = true;
      continue;
    }

    // Fallback to string
    hasString = true;
  }

  const typesCount = [hasNumber, hasString, hasBoolean, hasDate].filter(Boolean).length;
  
  if (typesCount === 0) return "string"; // empty column
  if (typesCount > 1) {
    // If it's number and string, it might just be a string column with some numerical identifiers
    return "mixed";
  }

  if (hasNumber) return "number";
  if (hasBoolean) return "boolean";
  if (hasDate) return "date";
  
  return "string";
}
