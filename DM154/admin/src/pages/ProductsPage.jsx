import { getApiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Package, X, Save, Star } from 'lucide-react';
import ProImageUploader, { formatImageUrl } from '../components/ProImageUploader';

export default function ProductsPage({ notify }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name_en: '',
    name_am: '',
    sku: '',
    category: 'Solar Pumps',
    category_am: 'የፀሐይ ፓምፖች',
    short_desc_en: '',
    short_desc_am: '',
    full_desc_en: '',
    full_desc_am: '',
    image_url: '',
    is_published: 1,
    is_featured: 0,
    specs: [
      { key: 'Voltage', value: '24V - 48V DC' },
      { key: 'Max Head', value: '80m' }
    ]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(getApiUrl('products.php?all=1'));
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
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
      name_en: '',
      name_am: '',
      sku: '',
      category: 'Solar Pumps',
      category_am: 'የፀሐይ ፓምፖች',
      short_desc_en: '',
      short_desc_am: '',
      full_desc_en: '',
      full_desc_am: '',
      image_url: '',
      is_published: 1,
      is_featured: 0,
      specs: [{ key: 'Voltage', value: '' }]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    let parsedSpecs = [];
    if (item.specs_json) {
      try {
        const obj = typeof item.specs_json === 'string' ? JSON.parse(item.specs_json) : item.specs_json;
        if (Array.isArray(obj)) {
          parsedSpecs = obj.map((str, i) => ({ key: `Feature ${i+1}`, value: str }));
        } else {
          parsedSpecs = Object.entries(obj).map(([k, v]) => ({ key: k, value: v }));
        }
      } catch (e) {}
    }
    setForm({ ...item, specs: parsedSpecs.length > 0 ? parsedSpecs : [{ key: '', value: '' }] });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const specsObj = {};
      form.specs.forEach(s => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const payload = {
        ...(editingItem ? { id: editingItem.id } : {}),
        ...form,
        specs: specsObj
      };

      const res = await fetch(getApiUrl('products.php'), {
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
          notify(editingItem ? 'Product Updated' : 'Product Created', `"${form.name_en}" saved successfully!`, 'success');
        }
        fetchProducts();
      } else {
        if (notify) {
          notify('Save Failed', data.error || 'Failed to save product.', 'error');
        }
      }
    } catch (err) {
      if (notify) {
        notify('Save Error', err.message, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const prod = products.find(p => p.id === id);
    const name = prod ? prod.name_en : 'Product';
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl(`products.php?id=${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (notify) {
          notify('Product Deleted', `"${name}" removed successfully.`, 'info');
        }
        fetchProducts();
      }
    } catch (err) {
      if (notify) {
        notify('Delete Error', err.message, 'error');
      }
    }
  };

  const addSpecRow = () => {
    setForm({ ...form, specs: [...form.specs, { key: '', value: '' }] });
  };

  const removeSpecRow = (idx) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Catalog Manager</h1>
          <p className="page-subtitle">Upload, edit, delete, and feature products displayed on your website catalog.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={formatImageUrl(item.image_url)} 
                        alt="Thumbnail" 
                        style={{ width: '48px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100/16a34a/ffffff?text=Product'; }}
                      />
                      <div>
                        {item.name_en}
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>{item.name_am}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', fontFamily: 'monospace', color: '#64748b' }}>{item.sku || 'N/A'}</td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0d9488', background: '#ccfbf1', padding: '4px 10px', borderRadius: '999px' }}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    {item.is_featured ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: '700', fontSize: '13px' }}>
                        <Star size={14} fill="#eab308" /> Featured
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>Standard</span>
                    )}
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

              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No products created yet. Click "Add New Product" to populate your catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Product */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Product Name (English)</label>
                  <input type="text" className="form-control" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Product Name (Amharic)</label>
                  <input type="text" className="form-control" value={form.name_am} onChange={(e) => setForm({ ...form, name_am: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Model / SKU Code</label>
                  <input type="text" className="form-control" placeholder="e.g. SWP-200" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="Solar Pumps">Solar Pumps (የፀሐይ ፓምፖች)</option>
                    <option value="Solar Home Systems">Solar Home Systems (የቤት ሲስተሞች)</option>
                    <option value="Solar Lanterns">Solar Lanterns (መብራቶች)</option>
                    <option value="Solar Appliances">Solar Appliances (መሳሪያዎች)</option>
                    <option value="Solar Mobility">Solar Mobility (ተንቀሳቃሽ)</option>
                    <option value="Accessories">Accessories & Installation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description (English)</label>
                <textarea className="form-control" style={{ minHeight: '60px' }} value={form.short_desc_en} onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })} />
              </div>

              {/* Technical Specifications Specs Editor */}
              <div className="form-group" style={{ background: '#f8fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ margin: 0, color: '#16a34a' }}>Technical Specifications (Specs)</label>
                  <button type="button" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={addSpecRow}>+ Add Spec</button>
                </div>
                {form.specs.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input type="text" placeholder="Spec Name (e.g. Max Head)" className="form-control" value={s.key} onChange={(e) => {
                      const copy = [...form.specs];
                      copy[idx].key = e.target.value;
                      setForm({ ...form, specs: copy });
                    }} />
                    <input type="text" placeholder="Value (e.g. 100m)" className="form-control" value={s.value} onChange={(e) => {
                      const copy = [...form.specs];
                      copy[idx].value = e.target.value;
                      setForm({ ...form, specs: copy });
                    }} />
                    <button type="button" className="btn-danger" style={{ padding: '8px 12px' }} onClick={() => removeSpecRow(idx)}><X size={14} /></button>
                  </div>
                ))}
              </div>

              {/* Pro Image Uploader */}
              <ProImageUploader 
                label="Product Image" 
                value={form.image_url} 
                onChange={(url) => setForm({ ...form, image_url: url })} 
              />

              <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="prodPub" checked={form.is_published === 1} onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })} />
                  <label htmlFor="prodPub" style={{ margin: 0, cursor: 'pointer' }}>Publish in catalog</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="prodFeat" checked={form.is_featured === 1} onChange={(e) => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })} />
                  <label htmlFor="prodFeat" style={{ margin: 0, cursor: 'pointer' }}>Set as featured on homepage</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Save size={16} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
