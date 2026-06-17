'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Dataset } from '@/types/dataset';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPreviewTableProps {
  dataset: Dataset;
}

export default function DataPreviewTable({ dataset }: DataPreviewTableProps) {
  const columns = useMemo(() => {
    return dataset.columns.map(col => ({
      header: col,
      accessorKey: col,
      cell: (info: any) => {
        const value = info.getValue();
        if (value === null || value === undefined) {
          return <span style={{ color: '#ef4444', fontStyle: 'italic', fontSize: '0.875rem' }}>null</span>;
        }
        if (typeof value === 'boolean') {
          return <span style={{ color: '#3b82f6', fontWeight: 500 }}>{value.toString()}</span>;
        }
        return <span style={{ color: 'inherit' }}>{String(value)}</span>;
      }
    }));
  }, [dataset.columns]);

  const table = useReactTable({
    data: dataset.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Dataset Preview</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{dataset.name} • {dataset.rows.length.toLocaleString()} rows • {dataset.columns.length} columns</p>
        </div>
      </div>
      
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ padding: '0.5rem', opacity: table.getCanPreviousPage() ? 1 : 0.5, cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ padding: '0.5rem', opacity: table.getCanNextPage() ? 1 : 0.5, cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
