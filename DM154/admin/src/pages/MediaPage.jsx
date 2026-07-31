import React, { useState } from 'react';
import ProImageUploader from '../components/ProImageUploader';

export default function MediaPage({ notify }) {
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUploadChange = (url) => {
    setUploadedUrl(url);
    if (url && notify) {
      notify('File Uploaded Successfully', 'Asset saved to /DM154/uploads/', 'success');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Gallery & Uploader</h1>
          <p className="page-subtitle">Upload new assets, replace website images, and manage media files.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">Professional Asset Upload Panel</h3>
        </div>

        <ProImageUploader 
          label="Select or Drag & Drop Image to Upload" 
          value={uploadedUrl} 
          onChange={handleUploadChange}
          hint="Uploaded images are automatically saved to /DM154/uploads/"
        />

        {uploadedUrl && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <h4 style={{ color: '#15803d', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Image Uploaded & Ready for Use!</h4>
            <p style={{ fontSize: '13px', color: '#16a34a' }}>Direct URL: <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>{uploadedUrl}</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
