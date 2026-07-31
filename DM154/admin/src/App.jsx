import { getApiUrl } from './api';
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import NewsPage from './pages/NewsPage';
import ProductsPage from './pages/ProductsPage';
import MessagesPage from './pages/MessagesPage';
import MediaPage from './pages/MediaPage';
import StatsPage from './pages/StatsPage';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const notify = (title, message = '', type = 'success') => {
    setToast({ title, message, type, id: Date.now() });
  };

  useEffect(() => {
    checkInstallAndAuth();
  }, []);

  useEffect(() => {
    if (user && isInstalled) {
      fetchDashboardStats();
      fetchMessages();
    }
  }, [user, isInstalled]);

  const checkInstallAndAuth = async () => {
    try {
      // 1. Check Installation status
      const installRes = await fetch(getApiUrl('install.php?action=status'));
      const installData = await installRes.json();

      if (!installData.installed) {
        setIsInstalled(false);
        setAuthChecked(true);
        return;
      }

      setIsInstalled(true);

      // 2. Check Auth status
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('auth.php?action=check'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('stats.php?action=dashboard'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data);
        if (data.metrics?.unread_messages !== undefined) {
          setUnreadCount(data.metrics.unread_messages);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('dm154_admin_token') || '';
      const res = await fetch(getApiUrl('messages.php'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl('auth.php?action=logout'));
    } catch (e) {}
    localStorage.removeItem('dm154_admin_token');
    setUser(null);
  };

  const handleResetSystem = async () => {
    if (window.confirm('Are you sure you want to reset system configuration and database? This will clear current tables for a fresh installation.')) {
      try {
        await fetch(getApiUrl('install.php?action=reset'));
      } catch (e) {}
      localStorage.removeItem('dm154_admin_token');
      setUser(null);
      setIsInstalled(false);
      notify('System Reset', 'Configuration reset. Ready for clean installation.');
    }
  };

  if (!authChecked) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05160c', color: '#ffffff' }}>
        <h2>Checking Meseret Solar System Status...</h2>
      </div>
    );
  }

  // Render Installer Setup Wizard if system needs configuration
  if (!isInstalled) {
    return (
      <SetupPage
        onSetupComplete={() => {
          setIsInstalled(true);
          checkInstallAndAuth();
        }}
      />
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'content':
        return <ContentPage notify={notify} />;
      case 'news':
        return <NewsPage notify={notify} />;
      case 'products':
        return <ProductsPage notify={notify} />;
      case 'messages':
        return <MessagesPage onRefreshUnread={fetchMessages} notify={notify} />;
      case 'media':
        return <MediaPage notify={notify} />;
      case 'stats':
        return <StatsPage stats={stats} />;
      case 'dashboard':
      default:
        return (
          <DashboardPage 
            stats={stats} 
            messages={messages} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        );
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <AdminLayout 
        user={user} 
        activeTab={activeTab} 
        onNavigate={(tab) => setActiveTab(tab)} 
        onLogout={handleLogout}
        onResetSystem={handleResetSystem}
        unreadCount={unreadCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        {renderActiveTab()}
      </AdminLayout>
    </>
  );
}
