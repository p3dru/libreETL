import { DataRow } from '@/types/dataset';

// Supported operators: +, -, *, /, > , <, ==, !=
function tokenize(expr: string): string[] {
  // Add spaces around operators and parentheses to easily split them
  const spaced = expr
    .replace(/\[([^\]]+)\]/g, ' __COL__$1__COL__ ') // wrap columns
    .replace(/([+\-*/()><!]|==|!=)/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const rawTokens = spaced.split(' ');
  const tokens: string[] = [];
  
  // Reconstruct column names that might have spaces
  let inCol = false;
  let colName = '';
  
  for (const t of rawTokens) {
    if (t.startsWith('__COL__') && t.endsWith('__COL__')) {
      tokens.push(t);
    } else if (t.startsWith('__COL__')) {
      inCol = true;
      colName = t;
    } else if (inCol && t.endsWith('__COL__')) {
      colName += ' ' + t;
      tokens.push(colName);
      inCol = false;
    } else if (inCol) {
      colName += ' ' + t;
    } else {
      tokens.push(t);
    }
  }
  
  return tokens;
}

function resolveValue(token: string, row: DataRow): any {
  if (token.startsWith('__COL__') && token.endsWith('__COL__')) {
    const colName = token.slice(7, -7);
    const val = row[colName];
    // if it's numeric string, parse it
    if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
      return Number(val);
    }
    return val;
  }
  if (!isNaN(Number(token))) return Number(token);
  if (token.toLowerCase() === 'true') return true;
  if (token.toLowerCase() === 'false') return false;
  if (token.toLowerCase() === 'null') return null;
  // It's a string literal (rudimentary)
  return token.replace(/^["'](.*)["']$/, '$1');
}

export function evaluateFormula(expression: string, row: DataRow): any {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return null;

    // Very simple evaluator: left-to-right evaluation (no strict operator precedence for MVP)
    // To keep it simple without a full AST tree:
    
    // Pass 1: resolve values
    const resolved = tokens.map(t => {
      if (['+', '-', '*', '/', '>', '<', '==', '!=', '(', ')'].includes(t)) return t;
      return resolveValue(t, row);
    });

    // We do a naive approach: process multiplication/division first
    for (let i = 1; i < resolved.length - 1; i++) {
      if (resolved[i] === '*' || resolved[i] === '/') {
        const left = Number(resolved[i-1]);
        const right = Number(resolved[i+1]);
        const res = resolved[i] === '*' ? left * right : left / right;
        resolved.splice(i-1, 3, res);
        i -= 1; // adjust index
      }
    }

    // Process addition/subtraction
    for (let i = 1; i < resolved.length - 1; i++) {
      if (resolved[i] === '+' || resolved[i] === '-') {
        const left = resolved[i-1];
        const right = resolved[i+1];
        
        let res;
        if (typeof left === 'string' || typeof right === 'string') {
           // String concatenation
           res = resolved[i] === '+' ? String(left) + String(right) : NaN;
        } else {
           res = resolved[i] === '+' ? Number(left) + Number(right) : Number(left) - Number(right);
        }
        
        resolved.splice(i-1, 3, res);
        i -= 1;
      }
    }
    
    // Process comparators
    for (let i = 1; i < resolved.length - 1; i++) {
      if (['>', '<', '==', '!='].includes(resolved[i] as string)) {
        const left = resolved[i-1];
        const right = resolved[i+1];
        let res = false;
        if (resolved[i] === '>') res = left > right;
        if (resolved[i] === '<') res = left < right;
        if (resolved[i] === '==') res = left == right;
        if (resolved[i] === '!=') res = left != right;
        
        resolved.splice(i-1, 3, res);
        i -= 1;
      }
    }

    return resolved[0];
  } catch (e) {
    return null; // Safe fallback on parse error
  }
}
