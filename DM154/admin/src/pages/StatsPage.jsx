import React from 'react';
import { ViewsBarChart, TrafficDonutChart } from '../components/StatChart';
import { Eye, TrendingUp, BarChart2, Calendar } from 'lucide-react';

export default function StatsPage({ stats }) {
  const topPages = stats?.top_pages || [
    { page_slug: 'home', count: 0 },
    { page_slug: 'products', count: 0 },
    { page_slug: 'news', count: 0 },
    { page_slug: 'services', count: 0 },
    { page_slug: 'about', count: 0 }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Page Views & Traffic Analytics</h1>
          <p className="page-subtitle">Detailed graphical analysis of website traffic, page view performance, and visitor engagement.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Card 1: Total Views */}
        <div className="stat-card stat-card-gradient-1">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Visitor Views</span>
            <div className="stat-card-icon"><Eye size={22} /></div>
          </div>
          <div className="stat-card-value">{stats?.metrics?.total_views || 0}</div>
          <div className="stat-card-footer"><TrendingUp size={16} /> Cumulative visitor traffic</div>
        </div>

        {/* Card 2: Daily View Rate */}
        <div className="stat-card stat-card-gradient-2">
          <div className="stat-card-header">
            <span className="stat-card-title">Daily View Rate</span>
            <div className="stat-card-icon"><BarChart2 size={22} /></div>
          </div>
          <div className="stat-card-value">{stats?.metrics?.daily_view_rate || 0}</div>
          <div className="stat-card-footer"><TrendingUp size={16} /> Views per day average (last 30d)</div>
        </div>

        {/* Card 3: Monthly Page Views */}
        <div className="stat-card stat-card-gradient-3">
          <div className="stat-card-header">
            <span className="stat-card-title">Monthly Page Views</span>
            <div className="stat-card-icon"><Calendar size={22} /></div>
          </div>
          <div className="stat-card-value">{stats?.metrics?.monthly_views || 0}</div>
          <div className="stat-card-footer"><TrendingUp size={16} /> Traffic views this month</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">Page Views (Daily Breakdown)</h3>
          </div>
          <ViewsBarChart data={stats?.daily_views} />
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">Traffic Channels</h3>
          </div>
          <TrafficDonutChart />
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">Top Viewed Pages</h3>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Route</th>
                <th>Total Views</th>
                <th>Share %</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((item, idx) => {
                const total = topPages.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0) || 1;
                const percent = Math.round(((parseInt(item.count) || 0) / total) * 100);
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: '#16a34a' }}>/{item.page_slug}</td>
                    <td style={{ fontWeight: '700' }}>{(parseInt(item.count) || 0).toLocaleString()} views</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: '#16a34a' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
