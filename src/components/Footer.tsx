import React from 'react';

export default function Footer() {
  return (
    <footer className="app-header" style={{ padding: '1rem 0', textAlign: 'center', marginTop: 'auto', borderTop: '1px solid var(--surface-border)', borderBottom: 'none' }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--foreground)' }}>
        <a 
          href="https://www.linkedin.com/in/dev-pedro/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', transition: 'opacity 0.2s', opacity: 0.75 }}
          className="footer-link"
        >
          © p3dru | 2026
        </a>
      </p>
    </footer>
  );
}
