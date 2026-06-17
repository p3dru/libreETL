'use client';

import React, { useCallback, useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { Dataset, DataRow } from '@/types/dataset';
import { useI18n } from '@/core/i18n/I18nContext';

interface FileUploaderProps {
  onDatasetLoaded: (dataset: Dataset) => void;
}

export default function FileUploader({ onDatasetLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          worker: true,
          complete: (results) => {
            if (results.errors.length > 0 && results.data.length === 0) {
              setError(t('uploader.error.csv'));
              setIsLoading(false);
              return;
            }

            const columns = results.meta.fields || [];
            const rows = results.data as DataRow[];

            onDatasetLoaded({
              id: crypto.randomUUID(),
              name: file.name,
              columns,
              rows,
              createdAt: Date.now()
            });
            setIsLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setIsLoading(false);
          }
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataRow[];

            if (jsonData.length === 0) {
              setError(t('uploader.error.empty'));
              return;
            }

            const columns = Object.keys(jsonData[0]);

            onDatasetLoaded({
              id: crypto.randomUUID(),
              name: file.name,
              columns,
              rows: jsonData,
              createdAt: Date.now()
            });
          } catch (err) {
            setError(t('uploader.error.xlsx'));
          } finally {
            setIsLoading(false);
          }
        };
        reader.onerror = () => {
          setError(t('uploader.error.read'));
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError(t('uploader.error.format'));
        setIsLoading(false);
      }
    } catch (err) {
      setError(t('uploader.error.unexpected'));
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="uploader-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--surface-border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'var(--surface)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".csv, .xlsx, .xls"
          onChange={handleFileInput}
        />

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>{t('uploader.processing')}</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: isDragging ? 'var(--primary)' : 'var(--text-secondary)' }}>
              <UploadCloud size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('uploader.drag')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('uploader.browse')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <FileText size={16} /> .CSV
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <FileText size={16} /> .XLSX
              </span>
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
