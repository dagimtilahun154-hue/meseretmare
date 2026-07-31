import { getApiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Trash2, Eye, RefreshCw, X, Phone, User, Calendar } from 'lucide-react';

export default function MessagesPage({ onRefreshUnread, notify }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('messages.php'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (onRefreshUnread) onRefreshUnread();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg, isRead) => {
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('messages.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'toggle_read', id: msg.id, is_read: isRead ? 1 : 0 })
      });
      const data = await res.json();
      if (data.success) {
        if (notify) {
          notify('Message Updated', isRead ? 'Marked as read.' : 'Marked as unread.', 'info');
        }
        fetchMessages();
        if (selectedMsg && selectedMsg.id === msg.id) {
          setSelectedMsg({ ...selectedMsg, is_read: isRead ? 1 : 0 });
        }
      }
    } catch (err) {
      if (notify) {
        notify('Update Error', err.message, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl(`messages.php?id=${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (notify) {
          notify('Message Deleted', 'Inquiry removed permanently.', 'info');
        }
        if (selectedMsg && selectedMsg.id === id) setSelectedMsg(null);
        fetchMessages();
      }
    } catch (err) {
      if (notify) {
        notify('Delete Error', err.message, 'error');
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('messages.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'mark_all_read' })
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages Inbox</h1>
          <p className="page-subtitle">View and manage customer inquiries submitted from the website Contact Us page.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleMarkAllRead}>
            <CheckCircle2 size={16} /> Mark All Read
          </button>
          <button className="btn-secondary" onClick={fetchMessages}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button className={`btn-secondary ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All Messages ({messages.length})
        </button>
        <button className={`btn-secondary ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
          Unread ({messages.filter(m => !m.is_read).length})
        </button>
        <button className={`btn-secondary ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
          Read ({messages.filter(m => m.is_read).length})
        </button>
      </div>

      <div className="panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender Name & Email</th>
                <th>Subject</th>
                <th>Phone Number</th>
                <th>Date Received</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} style={{ background: !msg.is_read ? '#f0fdf4' : 'transparent', fontWeight: !msg.is_read ? '700' : '400' }}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{msg.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>{msg.email}</div>
                  </td>
                  <td>{msg.subject || 'Website Inquiry'}</td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{msg.phone || 'N/A'}</td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{new Date(msg.created_at).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${msg.is_read ? 'read' : 'unread'}`}>
                      {msg.is_read ? 'Read' : 'New Unread'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', marginRight: '8px' }} 
                      onClick={() => {
                        setSelectedMsg(msg);
                        if (!msg.is_read) handleToggleRead(msg, true);
                      }}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(msg.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMessages.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No messages found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Message Detail Modal */}
      {selectedMsg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '640px', background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{selectedMsg.subject || 'Website Inquiry'}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Received {new Date(selectedMsg.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafb', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Sender Name</span>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{selectedMsg.name}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                  <a href={`mailto:${selectedMsg.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{selectedMsg.email}</a>
                </p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Phone Number</span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{selectedMsg.phone || 'Not provided'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Message Body</label>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.7', color: '#0f172a', whiteSpace: 'pre-wrap' }}>
                {selectedMsg.message}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => handleToggleRead(selectedMsg, !selectedMsg.is_read)}
              >
                Mark as {selectedMsg.is_read ? 'Unread' : 'Read'}
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a className="btn-primary" href={`mailto:${selectedMsg.email}?subject=RE: ${encodeURIComponent(selectedMsg.subject || 'Meseret Solar Inquiry')}`} style={{ textDecoration: 'none' }}>
                  <Mail size={16} /> Reply via Email
                </a>
                <button className="btn-danger" onClick={() => handleDelete(selectedMsg.id)}>
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
