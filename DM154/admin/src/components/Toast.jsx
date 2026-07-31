import React, { useEffect } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const bgColor = isError ? '#fef2f2' : isInfo ? '#eff6ff' : '#f0fdf4';
  const borderColor = isError ? '#fca5a5' : isInfo ? '#93c5fd' : '#86efac';
  const iconColor = isError ? '#ef4444' : isInfo ? '#3b82f6' : '#16a34a';

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        minWidth: '320px',
        maxWidth: '420px',
        padding: '16px 18px',
        background: bgColor,
        borderLeft: `5px solid ${iconColor}`,
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <div style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }}>
        {isError ? <AlertCircle size={22} /> : isInfo ? <Info size={22} /> : <CheckCircle2 size={22} />}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
          {toast.title}
        </h4>
        {toast.message && (
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
