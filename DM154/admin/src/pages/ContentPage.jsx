import { getApiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Layers, Home, Info, Wrench, PhoneCall, BarChart3, Layout, Plus, Trash2, Milestone, Link2, Share2, HelpCircle, ShieldAlert } from 'lucide-react';
import ProImageUploader from '../components/ProImageUploader';

export default function ContentPage({ notify }) {
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('homepage');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const tabs = [
    { id: 'header_brand', label: 'Header & Brand', icon: Layout },
    { id: 'metrics', label: 'Metrics & Stats', icon: BarChart3 },
    { id: 'homepage', label: 'Homepage Sections', icon: Home },
    { id: 'partners', label: '🤝 Partners Showcase', icon: Layers },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'services', label: 'Services Page', icon: Wrench },
    { id: 'footer', label: 'Contact, Footer & Socials', icon: PhoneCall }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(getApiUrl('content.php'));
      const data = await res.json();
      if (data.success) {
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key, field, value) => {
    setSections(prev => {
      const exists = prev.some(s => s.section_key === key);
      if (!exists) {
        return [...prev, { section_key: key, [field]: value }];
      }
      return prev.map(sec => sec.section_key === key ? { ...sec, [field]: value } : sec);
    });
  };

  const handleSaveSection = async (key) => {
    const sec = getSection(key);
    setSavingKey(key);
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('content.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sec)
      });
      const data = await res.json();
      if (data.success) {
        const titleText = sec.title_en || sec.section_key;
        if (notify) {
          notify('Section Updated', `Successfully saved "${titleText}"`, 'success');
        }
        setSuccessMsg(`Saved section "${titleText}"!`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        if (notify) {
          notify('Save Failed', data.message || 'Error saving section', 'error');
        }
      }
    } catch (err) {
      if (notify) {
        notify('Save Error', err.message, 'error');
      }
    } finally {
      setSavingKey('');
    }
  };

  const getSection = (key, defaultGroup = 'general', defaultTitle = '') => {
    let found = sections.find(s => s.section_key === key);
    if (!found) {
      found = {
        section_key: key,
        section_group: defaultGroup,
        title_en: defaultTitle,
        title_am: defaultTitle,
        content_en: '',
        content_am: '',
        image_url: '',
        meta_json: null
      };
    }
    return found;
  };

  const renderEditorBlock = (key, label, defaultGroup, description, hasImage = false) => {
    const sec = getSection(key, defaultGroup, label);
    const isSaving = savingKey === key;

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">{label}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{description || `Key: ${key}`}</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Section'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', marginBottom: '8px', textTransform: 'uppercase' }}>English Copy</h4>
            <div className="form-group">
              <label>Title / Heading / Label</label>
              <input 
                type="text" 
                className="form-control" 
                value={sec.title_en || ''} 
                onChange={(e) => handleFieldChange(key, 'title_en', e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Description / Subtext / Content</label>
              <textarea 
                className="form-control" 
                style={{ minHeight: '70px' }}
                value={sec.content_en || ''} 
                onChange={(e) => handleFieldChange(key, 'content_en', e.target.value)} 
              />
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', marginBottom: '8px', textTransform: 'uppercase' }}>Amharic Copy (አማርኛ)</h4>
            <div className="form-group">
              <label>Title / Heading / Label (Amharic)</label>
              <input 
                type="text" 
                className="form-control" 
                value={sec.title_am || ''} 
                onChange={(e) => handleFieldChange(key, 'title_am', e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Description / Subtext (Amharic)</label>
              <textarea 
                className="form-control" 
                style={{ minHeight: '70px' }}
                value={sec.content_am || ''} 
                onChange={(e) => handleFieldChange(key, 'content_am', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {hasImage && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <ProImageUploader 
              label={`Image Asset for ${label}`} 
              value={sec.image_url} 
              onChange={(url) => handleFieldChange(key, 'image_url', url)}
            />
          </div>
        )}
      </div>
    );
  };

  // Structured list editor for Journey Timeline or Operating steps
  const renderListEditor = (key, label, defaultGroup, isTimeline = false) => {
    const sec = getSection(key, defaultGroup, label);
    const isSaving = savingKey === key;

    let listItems = [];
    try {
      listItems = sec.meta_json ? (typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json) : [];
      if (!Array.isArray(listItems)) listItems = [];
    } catch (e) {
      listItems = [];
    }

    const handleUpdateItem = (index, field, value) => {
      const updated = [...listItems];
      updated[index] = { ...updated[index], [field]: value };
      handleFieldChange(key, 'meta_json', updated);
    };

    const handleAddItem = () => {
      const newItem = isTimeline 
        ? { year: '', text_en: '', text_am: '' }
        : { number: String(listItems.length + 1).padStart(2, '0'), label_en: '', label_am: '' };
      handleFieldChange(key, 'meta_json', [...listItems, newItem]);
    };

    const handleRemoveItem = (index) => {
      const updated = listItems.filter((_, i) => i !== index);
      handleFieldChange(key, 'meta_json', updated);
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Milestone size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">{label}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Add, edit, or remove list items individually.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Row
            </button>
            <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px dashed #cbd5e1' }}>
          <div>
            <div className="form-group">
              <label>Section Heading (English)</label>
              <input type="text" className="form-control" value={sec.title_en || ''} onChange={(e) => handleFieldChange(key, 'title_en', e.target.value)} />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>Section Heading (Amharic)</label>
              <input type="text" className="form-control" value={sec.title_am || ''} onChange={(e) => handleFieldChange(key, 'title_am', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {listItems.map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 48px', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  {isTimeline ? 'Year' : 'Number'}
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ textAlign: 'center', fontWeight: '700' }}
                  value={isTimeline ? (item.year || '') : (item.number || '')} 
                  onChange={(e) => handleUpdateItem(idx, isTimeline ? 'year' : 'number', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Detail Description (English)
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={isTimeline ? (item.text_en || '') : (item.label_en || '')} 
                  onChange={(e) => handleUpdateItem(idx, isTimeline ? 'text_en' : 'label_en', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  የዝርዝር መግለጫ (አማርኛ)
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={isTimeline ? (item.text_am || '') : (item.label_am || '')} 
                  onChange={(e) => handleUpdateItem(idx, isTimeline ? 'text_am' : 'label_am', e.target.value)}
                />
              </div>

              <div style={{ justifySelf: 'center', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn-danger" 
                  style={{ padding: '10px' }} 
                  onClick={() => handleRemoveItem(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {listItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              No list items found. Click "+ Add Row" to add.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Structured Contact Address Editor (Unclustered Phone, Secondary Phone, Email, Office Address)
  const renderContactAddressEditor = () => {
    const key = 'contact_address';
    const sec = getSection(key, 'contact', 'Office Address & Support Phones');
    const isSaving = savingKey === key;

    let meta = { phone_primary: '', phone_secondary: '', email: '', address_en: '', address_am: '' };
    try {
      if (sec.meta_json) {
        meta = typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json;
      }
    } catch(e) {}

    const handleMetaChange = (field, value) => {
      const updated = { ...meta, [field]: value };
      handleFieldChange(key, 'meta_json', updated);
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">Office Contact & Support Lines</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Configure phone numbers, support emails, and office coordinates separately.</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Details'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div className="form-group">
              <label>Primary Phone Number</label>
              <input type="text" className="form-control" value={meta.phone_primary || ''} onChange={(e) => handleMetaChange('phone_primary', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Secondary Phone Number</label>
              <input type="text" className="form-control" value={meta.phone_secondary || ''} onChange={(e) => handleMetaChange('phone_secondary', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Support Email Address</label>
              <input type="email" className="form-control" value={meta.email || ''} onChange={(e) => handleMetaChange('email', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="form-group">
              <label>Office Address (English)</label>
              <input type="text" className="form-control" value={meta.address_en || ''} onChange={(e) => handleMetaChange('address_en', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Office Address (Amharic / አማርኛ)</label>
              <input type="text" className="form-control" value={meta.address_am || ''} onChange={(e) => handleMetaChange('address_am', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Structured Social Media Links Editor (Unclustered Facebook, Telegram, LinkedIn, YouTube)
  const renderSocialsEditor = () => {
    const key = 'footer_socials';
    const sec = getSection(key, 'footer', 'Social Media Links');
    const isSaving = savingKey === key;

    let meta = { facebook: '', telegram: '', linkedin: '', youtube: '' };
    try {
      if (sec.meta_json) {
        meta = typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json;
      }
    } catch(e) {}

    const handleMetaChange = (field, value) => {
      const updated = { ...meta, [field]: value };
      handleFieldChange(key, 'meta_json', updated);
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">Social Media Links</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Configure direct URLs to your social channels separately.</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Socials'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div className="form-group">
              <label>Facebook Page URL</label>
              <input type="text" className="form-control" value={meta.facebook || ''} onChange={(e) => handleMetaChange('facebook', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Telegram Channel URL</label>
              <input type="text" className="form-control" value={meta.telegram || ''} onChange={(e) => handleMetaChange('telegram', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="form-group">
              <label>LinkedIn Company URL</label>
              <input type="text" className="form-control" value={meta.linkedin || ''} onChange={(e) => handleMetaChange('linkedin', e.target.value)} />
            </div>

            <div className="form-group">
              <label>YouTube Channel URL</label>
              <input type="text" className="form-control" value={meta.youtube || ''} onChange={(e) => handleMetaChange('youtube', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Structured Core Values Editor (Unclustered 4 cards with separate title/description rows)
  const renderCoreValuesEditor = () => {
    const key = 'about_values';
    const sec = getSection(key, 'about', 'Our Core Values');
    const isSaving = savingKey === key;

    let valuesList = [];
    try {
      valuesList = sec.meta_json ? (typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json) : [];
      if (!Array.isArray(valuesList)) valuesList = [];
    } catch(e) {}

    const handleUpdateValue = (index, field, val) => {
      const updated = [...valuesList];
      updated[index] = { ...updated[index], [field]: val };
      handleFieldChange(key, 'meta_json', updated);
    };

    const handleAddValue = () => {
      handleFieldChange(key, 'meta_json', [...valuesList, { title_en: '', title_am: '', desc_en: '', desc_am: '' }]);
    };

    const handleRemoveValue = (index) => {
      handleFieldChange(key, 'meta_json', valuesList.filter((_, i) => i !== index));
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">Core Values Row Editor</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Add, edit, or remove company core values card by card.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={handleAddValue}>
              <Plus size={14} /> Add Value
            </button>
            <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Core Values'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {valuesList.map((val, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#16a34a' }}>Core Value Card #{idx + 1}</span>
                <button type="button" className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleRemoveValue(idx)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div className="form-group">
                    <label>Value Name (English)</label>
                    <input type="text" className="form-control" value={val.title_en || ''} onChange={(e) => handleUpdateValue(idx, 'title_en', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Description (English)</label>
                    <textarea className="form-control" style={{ minHeight: '60px' }} value={val.desc_en || ''} onChange={(e) => handleUpdateValue(idx, 'desc_en', e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label>Value Name (Amharic)</label>
                    <input type="text" className="form-control" value={val.title_am || ''} onChange={(e) => handleUpdateValue(idx, 'title_am', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Description (Amharic)</label>
                    <textarea className="form-control" style={{ minHeight: '60px' }} value={val.desc_am || ''} onChange={(e) => handleUpdateValue(idx, 'desc_am', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Partner Logos Editor (Dynamic grid with uploader for each logo)
  const renderPartnerLogosEditor = () => {
    const key = 'partner_logos';
    const sec = getSection(key, 'homepage', 'Key Partners & Stakeholders');
    const isSaving = savingKey === key;

    let partnerList = [];
    try {
      partnerList = sec.meta_json ? (typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json) : [];
      if (!Array.isArray(partnerList)) partnerList = [];
    } catch(e) {}

    const handleUpdatePartner = (index, field, val) => {
      const updated = [...partnerList];
      updated[index] = { ...updated[index], [field]: val };
      handleFieldChange(key, 'meta_json', updated);
    };

    const handleAddPartner = () => {
      handleFieldChange(key, 'meta_json', [...partnerList, { name: '', logo: '', description: '' }]);
    };

    const handleRemovePartner = (index) => {
      handleFieldChange(key, 'meta_json', partnerList.filter((_, i) => i !== index));
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">Key Partners & Stakeholders Showcase</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Manage partner names, partnership descriptions, and logo images for both the Carousel & Partners Page.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={handleAddPartner}>
              <Plus size={14} /> Add Partner
            </button>
            <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Partners'}
            </button>
          </div>
        </div>

        {/* Section Heading & Subtext Editor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px dashed #cbd5e1' }}>
          <div>
            <div className="form-group">
              <label>Partners Page Title (English)</label>
              <input type="text" className="form-control" value={sec.title_en || ''} onChange={(e) => handleFieldChange(key, 'title_en', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Partners Page Subtitle / Intro (English)</label>
              <input type="text" className="form-control" value={sec.content_en || ''} onChange={(e) => handleFieldChange(key, 'content_en', e.target.value)} />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>Partners Page Title (Amharic / አማርኛ)</label>
              <input type="text" className="form-control" value={sec.title_am || ''} onChange={(e) => handleFieldChange(key, 'title_am', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Partners Page Subtitle / Intro (Amharic)</label>
              <input type="text" className="form-control" value={sec.content_am || ''} onChange={(e) => handleFieldChange(key, 'content_am', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {partnerList.map((partner, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', color: '#16a34a' }}>Partner #{idx + 1}</span>
                <button type="button" className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleRemovePartner(idx)}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>

              <div className="form-group">
                <label>Partner / Agency Name</label>
                <input type="text" className="form-control" value={partner.name || ''} onChange={(e) => handleUpdatePartner(idx, 'name', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Partnership Detail / Highlight</label>
                <input type="text" className="form-control" placeholder="e.g. Community water & solar pumping partner" value={partner.description || ''} onChange={(e) => handleUpdatePartner(idx, 'description', e.target.value)} />
              </div>

              <ProImageUploader 
                label="Partner Logo Asset" 
                value={partner.logo} 
                onChange={(url) => handleUpdatePartner(idx, 'logo', url)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Services Flow Steps Editor
  const renderServicesFlowEditor = () => {
    const key = 'services_flow';
    const sec = getSection(key, 'services', 'Service Execution Steps');
    const isSaving = savingKey === key;

    let steps = [];
    try {
      steps = sec.meta_json ? (typeof sec.meta_json === 'string' ? JSON.parse(sec.meta_json) : sec.meta_json) : [];
      if (!Array.isArray(steps)) steps = [];
    } catch(e) {}

    const handleUpdateStep = (index, field, val) => {
      const updated = [...steps];
      updated[index] = { ...updated[index], [field]: val };
      handleFieldChange(key, 'meta_json', updated);
    };

    const handleAddStep = () => {
      handleFieldChange(key, 'meta_json', [...steps, { step_en: '', step_am: '' }]);
    };

    const handleRemoveStep = (index) => {
      handleFieldChange(key, 'meta_json', steps.filter((_, i) => i !== index));
    };

    return (
      <div key={key} className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 className="panel-card-title">Services Workflow steps</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Configure service roadmap workflow milestones (e.g. Design, Sizing, Sourcing) separately.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={handleAddStep}>
              <Plus size={14} /> Add Step
            </button>
            <button className="btn-primary" onClick={() => handleSaveSection(key)} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: '60px 1fr 1fr 48px', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontWeight: '800', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                #{idx + 1}
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <input type="text" className="form-control" placeholder="Step label (English)" value={step.step_en || ''} onChange={(e) => handleUpdateStep(idx, 'step_en', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <input type="text" className="form-control" placeholder="የደረጃ መግለጫ (አማርኛ)" value={step.step_am || ''} onChange={(e) => handleUpdateStep(idx, 'step_am', e.target.value)} />
              </div>
              <div>
                <button type="button" className="btn-danger" style={{ padding: '10px' }} onClick={() => handleRemoveStep(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Full Website Content & Image Manager</h1>
          <p className="page-subtitle">Control every title, paragraph, card image, badge, metric, and detail on your live website.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#15803d', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: '600' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: isActive ? '#16a34a' : '#e2e8f0',
                backgroundColor: isActive ? '#16a34a' : '#ffffff',
                color: isActive ? '#ffffff' : '#0f172a',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 14px rgba(22, 163, 74, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Header & Brand Tab */}
      {activeTab === 'header_brand' && (
        <div>
          {renderEditorBlock('header_brand', 'Site Header Logo & Brand Title', 'header', 'Edit site header brand name, subtitle tagline, and main site logo image.', true)}
        </div>
      )}

      {/* 2. Metrics & Stats Tab */}
      {activeTab === 'metrics' && (
        <div>
          {renderEditorBlock('metric_1', 'Metric Card 1 (Founded Year)', 'homepage', 'Edit value (e.g. 2016) and label (e.g. Founded).', false)}
          {renderEditorBlock('metric_2', 'Metric Card 2 (Systems Reach)', 'homepage', 'Edit value (e.g. 10k+) and label (e.g. Systems reach).', false)}
          {renderEditorBlock('metric_3', 'Metric Card 3 (Districts Covered)', 'homepage', 'Edit value (e.g. 40+) and label (e.g. Districts).', false)}
          {renderEditorBlock('metric_4', 'Metric Card 4 (Member Association)', 'homepage', 'Edit value (e.g. GOGLA) and label (e.g. Member).', false)}
        </div>
      )}

      {/* 3. Homepage Sections Tab */}
      {activeTab === 'homepage' && (
        <div>
          {renderEditorBlock('hero', 'Hero Section (Main Banner)', 'homepage', 'Edit main headline, subtext, CTA button text, and hero background image.', true)}
          
          {renderEditorBlock('cert_supply_heading', 'Certified Solar Supply Heading', 'homepage', 'Main section heading and intro for Certified Solar Supply.', false)}
          {renderEditorBlock('cert_card_1', 'Certified Supply Card 1 (Certified Imports)', 'homepage', 'Badge label (CERTIFIED IMPORTS) and card text.', false)}
          {renderEditorBlock('cert_card_2', 'Certified Supply Card 2 (Water Security)', 'homepage', 'Badge label (WATER SECURITY) and card text.', false)}
          {renderEditorBlock('cert_card_3', 'Certified Supply Card 3 (Field Care)', 'homepage', 'Badge label (FIELD CARE) and card text.', false)}

          {renderEditorBlock('prod_line_heading', 'Product Lines Section Heading', 'homepage', 'Section title ("Product lines.") and subtitle.', false)}
          {renderEditorBlock('prod_line_1', 'Product Line Card 1 (Solar Pump Systems)', 'homepage', 'Card title, subtitle, and card image.', true)}
          {renderEditorBlock('prod_line_2', 'Product Line Card 2 (Solar Home Kits)', 'homepage', 'Card title, subtitle, and card image.', true)}
          {renderEditorBlock('prod_line_3', 'Product Line Card 3 (DC Solar Appliances)', 'homepage', 'Card title, subtitle, and card image.', true)}

          {renderEditorBlock('field_proof_heading', 'Field Proof Section Heading', 'homepage', 'Section title ("Field proof.") and subtext.', false)}
          {renderEditorBlock('field_proof_1', 'Field Proof Card 1 (Ethiopia Access)', 'homepage', 'Card title, description, and proof image.', true)}
          {renderEditorBlock('field_proof_2', 'Field Proof Card 2 (Productive Use)', 'homepage', 'Card title, description, and proof image.', true)}
          {renderEditorBlock('field_proof_3', 'Field Proof Card 3 (Home Power)', 'homepage', 'Card title, description, and proof image.', true)}

          {renderEditorBlock('achievements_heading', 'Achievements Section Heading', 'homepage', 'Achievements section title and intro description.', false)}
          {renderEditorBlock('achievement_1', 'Achievement Card 1 (Imported Successfully)', 'homepage', 'Achievement 1 title and detail description.', false)}
          {renderEditorBlock('achievement_2', 'Achievement Card 2 (Strong Partnerships)', 'homepage', 'Achievement 2 title and detail description.', false)}
          {renderEditorBlock('achievement_3', 'Achievement Card 3 (Increased Operation Area)', 'homepage', 'Achievement 3 title and detail description.', false)}

          {/* Operating Steps Dynamic List Editor */}
          {renderListEditor('operating_model', 'Field Operating Model (4 Steps)', 'homepage', false)}
          
          {renderEditorBlock('assembly_initiative', 'Local Assembly Initiative Banner', 'homepage', 'Local assembly heading and project description.', false)}

          {/* Dynamic Partner Logos Editor (New) */}
          {renderPartnerLogosEditor()}
        </div>
      )}

      {/* 4. Partners Showcase Tab */}
      {activeTab === 'partners' && (
        <div>
          {renderPartnerLogosEditor()}
        </div>
      )}

      {/* 5. About Page Tab */}
      {activeTab === 'about' && (
        <div>
          {renderEditorBlock('about_intro', 'About Page Header Banner', 'about', 'Main about page title, summary intro, and header image.', true)}
          {renderEditorBlock('about_clean_power', 'Dedicated to Clean Power Access', 'about', 'Full story paragraphs about rural energy access in Ethiopia.', false)}
          {renderEditorBlock('about_mission', 'Our Mission Card', 'about', 'Mission title and mission statement.', false)}
          {renderEditorBlock('about_vision', 'Our Vision Card', 'about', 'Vision title and vision statement.', false)}
          
          {/* Core Values Row Editor (New) */}
          {renderCoreValuesEditor()}
          
          {/* Journey Timeline Dynamic List Editor */}
          {renderListEditor('about_journey', 'Our Journey / Timeline Milestones', 'about', true)}
        </div>
      )}

      {/* 5. Services Page Tab */}
      {activeTab === 'services' && (
        <div>
          {renderEditorBlock('services_intro', 'Services Intro Section', 'services', 'Main services page title, intro paragraph, and banner image.', true)}
          {renderEditorBlock('services_card_1', 'Service Card 1 (Solar Site Assessment)', 'services', 'Site assessment title, description, and service image.', true)}
          {renderEditorBlock('services_card_2', 'Service Card 2 (System Design & Sizing)', 'services', 'System design title, description, and service image.', true)}
          {renderEditorBlock('services_card_3', 'Service Card 3 (Import & Certified Supply)', 'services', 'Hardware supply title, description, and service image.', true)}
          {renderEditorBlock('services_card_4', 'Service Card 4 (Installation & Maintenance)', 'services', 'Installation & care title, description, and service image.', true)}

          {/* Services Workflow steps (New) */}
          {renderServicesFlowEditor()}
        </div>
      )}

      {/* 6. Contact, Footer & Socials Tab */}
      {activeTab === 'footer' && (
        <div>
          {renderEditorBlock('contact_info', 'Contact Page Headline & Subtitle', 'contact', 'Main contact title and consultation intro.', false)}
          
          {/* Structured Contact Details Form (New) */}
          {renderContactAddressEditor()}
          
          {renderEditorBlock('footer_about', 'Footer Brand & Copyright Notice', 'footer', 'Footer company title, copyright text, and footer logo.', true)}
          
          {/* Structured Social Link Editors (New) */}
          {renderSocialsEditor()}
        </div>
      )}
    </div>
  );
}
