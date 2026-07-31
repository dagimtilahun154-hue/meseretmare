import { getApiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, X, Save, Newspaper } from 'lucide-react';
import ProImageUploader, { formatImageUrl } from '../components/ProImageUploader';

export default function NewsPage({ notify }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    title_en: '',
    title_am: '',
    category: 'Events',
    category_am: 'ሁነቶች',
    excerpt_en: '',
    excerpt_am: '',
    content_en: '',
    content_am: '',
    image_url: '',
    published_date: new Date().toISOString().split('T')[0],
    is_published: 1
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(getApiUrl('news.php?all=1'));
      const data = await res.json();
      if (data.success) {
        setNews(data.news || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      title_en: '',
      title_am: '',
      category: 'Events',
      category_am: 'ሁነቶች',
      excerpt_en: '',
      excerpt_am: '',
      content_en: '',
      content_am: '',
      image_url: '',
      published_date: new Date().toISOString().split('T')[0],
      is_published: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const payload = editingItem ? { ...form, id: editingItem.id } : form;
      const res = await fetch(getApiUrl('news.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        if (notify) {
          notify(editingItem ? 'Article Updated' : 'Article Created', `"${form.title_en}" saved successfully!`, 'success');
        }
        fetchNews();
      } else {
        if (notify) {
          notify('Save Failed', data.error || 'Failed to save news article.', 'error');
        }
      }
    } catch (err) {
      if (notify) {
        notify('Save Error', err.message, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const item = news.find(n => n.id === id);
    const title = item ? item.title_en : 'Article';
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl(`news.php?id=${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (notify) {
          notify('Article Deleted', `"${title}" removed successfully.`, 'info');
        }
        fetchNews();
      }
    } catch (err) {
      if (notify) {
        notify('Delete Error', err.message, 'error');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">News & Updates Manager</h1>
          <p className="page-subtitle">Post, edit, track view counts, and manage news articles shown on the website frontend.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Post New Article
        </button>
      </div>

      <div className="panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Views</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={formatImageUrl(item.image_url)} 
                        alt="Thumbnail" 
                        style={{ width: '48px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100/16a34a/ffffff?text=News'; }}
                      />
                      <div>
                        {item.title_en}
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>{item.title_am}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '999px' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{item.published_date}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#13713a' }}>
                      <Eye size={14} /> {item.view_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.is_published ? 'published' : 'draft'}`}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', marginRight: '8px' }} onClick={() => handleOpenEdit(item)}>
                      <Edit3 size={14} /> Edit
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {news.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No news articles created yet. Click "Post New Article" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit News */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                {editingItem ? 'Edit News Article' : 'Post New News Article'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Title (English)</label>
                  <input type="text" className="form-control" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Title (Amharic)</label>
                  <input type="text" className="form-control" value={form.title_am} onChange={(e) => setForm({ ...form, title_am: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category (English)</label>
                  <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="Events">Events</option>
                    <option value="Government">Government</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Community">Community</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Field Work">Field Work</option>
                    <option value="Gallery">Gallery</option>
                    <option value="News">General News</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Publication Date</label>
                  <input type="date" className="form-control" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Excerpt / Short Summary (English)</label>
                <textarea className="form-control" style={{ minHeight: '60px' }} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Full Article Content (English)</label>
                <textarea className="form-control" style={{ minHeight: '120px' }} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} required />
              </div>

              {/* Pro Image Uploader */}
              <ProImageUploader 
                label="Article Image" 
                value={form.image_url} 
                onChange={(url) => setForm({ ...form, image_url: url })} 
              />

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input type="checkbox" id="pubCheck" checked={form.is_published === 1} onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })} />
                <label htmlFor="pubCheck" style={{ margin: 0, cursor: 'pointer' }}>Publish article live on frontend</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Save size={16} /> Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
