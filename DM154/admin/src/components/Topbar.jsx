import React from 'react';
import { Search, Bell, ExternalLink } from 'lucide-react';

export default function Topbar({ user, unreadCount = 0, onNavigate, searchTerm, setSearchTerm }) {
  return (
    <header className="admin-topbar">
      <div className="topbar-search">
        <Search className="topbar-search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search contents, products, news..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <a 
          href="/" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }}
        >
          <ExternalLink size={14} /> Live Site
        </a>

        <button 
          className="notification-btn" 
          title="Contact Messages Inbox"
          onClick={() => onNavigate('messages')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        <div className="topbar-user">
          <div className="topbar-user-avatar">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MA'}
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{user?.name || 'Meseret Admin'}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
