'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { db } from '@/core/db';
import { customConfirm, customAlert } from '@/core/ui/customDialogs';

export default function Header() {
  const pathname = usePathname();
  
  const navStyle = (path: string) => ({
    color: pathname === path ? 'var(--foreground)' : '#94a3b8',
    fontWeight: pathname === path ? 600 : 400,
    textDecoration: 'none',
    borderBottom: pathname === path ? '2px solid var(--primary)' : 'none',
    paddingBottom: '4px'
  });

  const router = useRouter();
  const handleSecureWipe = async () => {
    const isConfirmed = await customConfirm('🔐 ATENÇÃO: Isso irá DESTRUIR fisicamente do seu navegador todos os datasets, configurações e dados cacheados. É irrecuperável. Deseja prosseguir para proteger os dados?', true);
    if (isConfirmed) {
      await db.delete(); // Deletes the entire IndexedDB database
      await customAlert('Dados expurgados com segurança. Recarregando a aplicação.');
      window.location.href = '/';
    }
  };

  return (
    <header className="app-header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            Q
          </div>
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>DataQ</h1>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/" style={navStyle('/')}>Dashboard</Link>
          <Link href="/learn" style={navStyle('/learn')}>Learn</Link>
          <Link href="/upload" style={navStyle('/upload')}>Upload</Link>
          <Link href="/history" style={navStyle('/history')}>History</Link>
          <Link
            href="/merge"
            style={{
              ...navStyle('/merge'),
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(99,102,241,0.12)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)',
              fontWeight: 600,
              borderBottom: 'none',
            }}
          >
            ⋈ Merge
          </Link>
          <button 
            onClick={handleSecureWipe}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--error)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <ShieldAlert size={14} /> Wipe Cache
          </button>
        </nav>
      </div>
    </header>
  );
}
