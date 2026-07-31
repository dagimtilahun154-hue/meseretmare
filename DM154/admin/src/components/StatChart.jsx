import React from 'react';

export function ViewsBarChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div style={{ width: '100%', height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>No page views logged yet.</p>
        <span style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Real visitor views will display here as traffic occurs.</span>
      </div>
    );
  }

  const maxVal = Math.max(...chartData.map(d => parseInt(d.count || d.views || 0, 10)), 1);

  return (
    <div style={{ width: '100%', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
        {chartData.map((item, idx) => {
          const val = parseInt(item.count || item.views || 0, 10);
          const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));
          const dateLabel = item.view_date ? item.view_date.slice(5) : (item.label || `#${idx + 1}`);

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', marginBottom: '6px' }}>{val}</span>
              <div 
                style={{ 
                  width: '70%', 
                  maxWidth: '36px',
                  height: `${heightPercent}%`, 
                  background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                }}
              />
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: '600' }}>{dateLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrafficDonutChart({ channels = [] }) {
  const sources = Array.isArray(channels) && channels.length > 0 ? channels : [];

  if (sources.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', color: '#94a3b8' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>No traffic sources recorded yet.</p>
        <span style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Channels will populate based on live visitor referrers.</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>
        {sources.map((src, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: src.color || '#16a34a' }}></span>
            {src.label}: {src.count || 0}
          </div>
        ))}
      </div>
    </div>
  );
}
