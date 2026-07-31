import { getApiUrl } from '../api';
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function formatImageUrl(url) {
  let source = String(url || '').trim().replace(/\\/g, '/');
  if (!source) return 'https://placehold.co/400x300/16a34a/ffffff?text=No+Image+Set';

  if (source.startsWith('/react-app/public')) {
    source = source.replace('/react-app/public', '');
  }

  if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('data:')) {
    return source;
  }
  
  if (source.startsWith('DM154/uploads/')) {
    source = '/' + source;
  } else if (source.startsWith('uploads/')) {
    source = '/' + source;
  } else if (source.startsWith('images/')) {
    source = '/' + source;
  }

  if (!source.startsWith('/')) {
    source = '/' + source;
  }

  const normalized = source.replace(/\/{2,}/g, '/');

  if (typeof window !== 'undefined' && window.location.port === '5174' && normalized.startsWith('/images/')) {
    return `http://localhost:5173${normalized}`;
  }

  return normalized;
}

export default function ProImageUploader({ value, onChange, label = 'Upload Image', hint = 'Supports JPG, PNG, WEBP up to 15MB' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const response = await fetch(getApiUrl('upload.php'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const res = await response.json();
      if (res.success) {
        onChange(res.url);
      } else {
        setError(res.error || 'Failed to upload image.');
      }
    } catch (err) {
      setError('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const previewSrc = formatImageUrl(value);

  return (
    <div className="form-group">
      <label>{label}</label>
      
      {value ? (
        <div className="uploader-preview-container">
          <img 
            src={previewSrc} 
            alt="Preview" 
            className="uploader-preview-img" 
            onError={(e) => { 
              e.target.src = 'https://placehold.co/400x300/16a34a/ffffff?text=Preview+Error'; 
            }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: '700', fontSize: '14px' }}>
              <CheckCircle2 size={16} /> Image Set Successfully
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', wordBreak: 'break-all' }}>{value}</p>
          </div>
          <button 
            type="button" 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <RefreshCw size={14} className={isUploading ? 'spin' : ''} /> Replace Image
          </button>
        </div>
      ) : (
        <div 
          className={`pro-uploader-zone ${isDragging ? 'dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', marginBottom: '12px' }}>
            <UploadCloud size={28} />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            {isUploading ? 'Uploading Image...' : 'Click or Drag & Drop Image Here'}
          </h4>
          <p style={{ fontSize: '12px', color: '#64748b' }}>{hint}</p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
