import React, { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { Factory } from 'lucide-react';
import fallbackProductsData from '../data/products.json';

export default function Products() {
  const [ref, isVisible] = useInView({ threshold: 0.05 });
  const [products, setProducts] = useState(fallbackProductsData.products);
  const [activeFilter, setActiveFilter] = useState('All Products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // 1. Try to get repo name from config.yml
        const configRes = await fetch('/DM154/config.yml');
        if (configRes.ok) {
          const configText = await configRes.text();
          const repoMatch = configText.match(/repo:\s*["']?([^"'\s]+)/);
          
          if (repoMatch && repoMatch[1] && repoMatch[1] !== 'owner/repo') {
            const repo = repoMatch[1].trim();
            // 2. Fetch directly from GitHub raw URL so updates are instant!
            const githubUrl = `https://raw.githubusercontent.com/${repo}/main/public/data/products.json`;
            const ghRes = await fetch(githubUrl);
            if (ghRes.ok) {
              const ghData = await ghRes.json();
              if (ghData && Array.isArray(ghData.products)) {
                setProducts(ghData.products);
                setLoading(false);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load products from GitHub, falling back to local storage:', err);
      }

      // 3. Fallback: load local products.json from server
      try {
        const localRes = await fetch('/data/products.json');
        if (localRes.ok) {
          const localData = await localRes.json();
          if (localData && Array.isArray(localData.products)) {
            setProducts(localData.products);
          }
        }
      } catch (err) {
        console.error('Failed to load local products:', err);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  // Extract unique categories from the products data
  const categories = ['All Products', ...new Set(products.map(p => p.category))];

  const filteredProducts = activeFilter === 'All Products'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <section id="products" className="section section-light" style={{ overflow: 'hidden' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>Our Products</div>
          <h2 className="section-title">Imported High-Quality Solar Hardware</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We import certified solar products from leading global manufacturers to guarantee maximum performance and longevity in Ethiopian environments.
          </p>
        </div>

        {/* Product Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-10)',
          flexWrap: 'wrap'
        }}>
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: activeFilter === filter ? 'var(--amber-500)' : 'var(--border-light)',
                backgroundColor: activeFilter === filter ? 'var(--amber-50)' : 'var(--white)',
                color: activeFilter === filter ? 'var(--amber-700)' : 'var(--slate-600)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div 
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {filteredProducts.map((p, index) => (
            <div 
              key={index} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Product Image — dominant */}
              <div style={{
                width: '100%',
                height: '140px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={p.image} 
                  alt={p.name} 
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '8px'
                  }}
                  onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:12px;">No image</div>'; }}
                />
              </div>

              {/* Compact text area */}
              <div style={{ padding: '10px 12px 12px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  backgroundColor: 'var(--amber-50, #fffbeb)',
                  color: 'var(--amber-700, #b45309)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '4px'
                }}>{p.category}</span>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--navy-900, #0f172a)',
                  lineHeight: '1.25',
                  margin: '0 0 2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{p.name}</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{p.model}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Future Assembly Panel */}
        <div style={{
          marginTop: 'var(--space-12)',
          background: 'linear-gradient(135deg, var(--navy-900), var(--navy-800))',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-10)',
          color: 'var(--text-inverse)',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Subtle Ambient Graphic in BG */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.05,
            color: 'var(--white)',
            zIndex: 1
          }}>
            <Factory size={260} />
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: 'var(--amber-500)',
              color: 'var(--white)',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-4)'
            }}>Coming Soon</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              marginBottom: 'var(--space-3)'
            }}>Local Assembly Initiative</h3>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--slate-300)',
              lineHeight: 1.7,
              marginBottom: 'var(--space-4)'
            }}>
              To create local jobs, transfer technical skills, and reduce costs, Meseret Mare is preparing to initiate **local assembly of solar home systems (1, 3, and 4 bulbs)** and **agricultural solar water pumps** directly within Ethiopia.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--amber-400)', fontWeight: 'bold', fontSize: 'var(--text-lg)' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Local Skill Transfer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--amber-400)', fontWeight: 'bold', fontSize: 'var(--text-lg)' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Job Creation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ color: 'var(--amber-400)', fontWeight: 'bold', fontSize: 'var(--text-lg)' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Lower Hardware Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
