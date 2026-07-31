import React from 'react';
import { Eye, Package, Newspaper, Mail, TrendingUp, ArrowUpRight, BarChart2 } from 'lucide-react';
import { ViewsBarChart, TrafficDonutChart } from '../components/StatChart';

export default function DashboardPage({ stats, messages = [], onNavigate }) {
  const metrics = stats?.metrics || {
    total_views: 0,
    daily_views: 0,
    monthly_views: 0,
    daily_view_rate: 0,
    total_products: 0,
    total_news: 0,
    unread_messages: 0,
    growth_rate: '+0%'
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here is your website traffic, products, news, and messages summary.</p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate('content')}>
          Edit Page Content
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="stats-grid">
        {/* Card 1: Total Views */}
        <div className="stat-card stat-card-gradient-1">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Page Views</span>
            <div className="stat-card-icon"><Eye size={22} /></div>
          </div>
          <div className="stat-card-value">{(metrics.total_views || 0).toLocaleString()}</div>
          <div className="stat-card-footer">
            <TrendingUp size={16} /> Cumulative visitor traffic
          </div>
        </div>

        {/* Card 2: Total Products */}
        <div className="stat-card stat-card-gradient-2">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Products</span>
            <div className="stat-card-icon"><Package size={22} /></div>
          </div>
          <div className="stat-card-value">{metrics.total_products || 0}</div>
          <div className="stat-card-footer" style={{ cursor: 'pointer' }} onClick={() => onNavigate('products')}>
            Active solar catalog <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Card 3: News & Updates */}
        <div className="stat-card stat-card-gradient-3">
          <div className="stat-card-header">
            <span className="stat-card-title">News & Updates</span>
            <div className="stat-card-icon"><Newspaper size={22} /></div>
          </div>
          <div className="stat-card-value">{metrics.total_news || 0}</div>
          <div className="stat-card-footer" style={{ cursor: 'pointer' }} onClick={() => onNavigate('news')}>
            Published articles <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Card 4: Unread Messages */}
        <div className="stat-card stat-card-gradient-4">
          <div className="stat-card-header">
            <span className="stat-card-title">New Messages</span>
            <div className="stat-card-icon"><Mail size={22} /></div>
          </div>
          <div className="stat-card-value">{metrics.unread_messages || 0}</div>
          <div className="stat-card-footer" style={{ cursor: 'pointer' }} onClick={() => onNavigate('messages')}>
            View inbox <ArrowUpRight size={14} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">Website Views & Traffic Trends</h3>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '999px' }}>
              Daily Visitor Views
            </span>
          </div>
          <ViewsBarChart data={stats?.daily_views} />
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">Traffic Sources</h3>
          </div>
          <TrafficDonutChart />
        </div>
      </div>

      {/* Recent Contact Messages */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">Recent Contact Inquiries</h3>
          <button className="btn-secondary" style={{ fontSize: '13px' }} onClick={() => onNavigate('messages')}>
            View All Messages
          </button>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Phone / Contact</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 4).map((msg) => (
                <tr key={msg.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('messages')}>
                  <td style={{ fontWeight: '700' }}>
                    {msg.name}
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>{msg.email}</div>
                  </td>
                  <td>{msg.subject}</td>
                  <td>{msg.phone || 'N/A'}</td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge ${msg.is_read ? 'read' : 'unread'}`}>
                      {msg.is_read ? 'Read' : 'New Unread'}
                    </span>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
                    No contact messages received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
