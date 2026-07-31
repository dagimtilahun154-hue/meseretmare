import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Package, 
  Mail, 
  Image as ImageIcon, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import Topbar from './Topbar';

export default function AdminLayout({ user, activeTab, onNavigate, onLogout, unreadCount, children, searchTerm, setSearchTerm }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'messages', label: 'Contact Messages', icon: Mail, badge: unreadCount },
    { id: 'media', label: 'Media Gallery', icon: ImageIcon },
    { id: 'stats', label: 'Page Views Analytics', icon: BarChart3 }
  ];

  return (
    <div className="admin-container">
      {/* Left Sidebar inspired by Purple Reference Layout */}
      <aside className="admin-sidebar">
        <div className="sidebar-profile">
          <div className="avatar-badge">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MA'}
            <span className="online-dot"></span>
          </div>
          <div className="profile-info">
            <h4>{user?.name || 'Meseret Admin'}</h4>
            <p>{user?.role || 'System Administrator'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Right Content Panel */}
      <div className="admin-main">
        <Topbar 
          user={user} 
          unreadCount={unreadCount} 
          onNavigate={onNavigate} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}
