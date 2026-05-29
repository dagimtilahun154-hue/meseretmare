import React from 'react';
import { Sun, Heart } from 'lucide-react';

export default function Footer() {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer style={{
      background: 'var(--navy-900)',
      color: 'var(--text-inverse)',
      paddingTop: 'var(--space-16)',
      paddingBottom: 'var(--space-8)',
      textAlign: 'left',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        {/* Top footer row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-10)',
          marginBottom: 'var(--space-12)'
        }}>
          {/* Logo column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)'
              }}>
                <Sun size={18} />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 800,
                color: 'var(--white)',
                letterSpacing: '-0.02em'
              }}>MESERET MARE</span>
            </div>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--slate-400)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-4)',
              maxWidth: '240px'
            }}>
              Empowering Ethiopian communities with high-quality, certified solar energy solutions since 2016.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Home', 'About', 'Services', 'Products', 'Partners', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleScrollTo(item.toLowerCase())}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--slate-400)',
                      transition: 'color var(--transition-fast)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--slate-400)'}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Offerings */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Solar Offerings</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { name: 'Submersible Pumps', id: 'products' },
                { name: 'Surface Water Pumps', id: 'products' },
                { name: 'Solar Home Kits', id: 'products' },
                { name: 'LED Lanterns', id: 'products' },
                { name: 'DC Appliances / TVs', id: 'products' }
              ].map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleScrollTo(item.id)}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--slate-400)',
                      transition: 'color var(--transition-fast)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--slate-400)'}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry info */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Industry Trust</h4>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--slate-400)',
              lineHeight: 1.6,
              maxWidth: '240px'
            }}>
              We are a verified member of GOGLA, the global association for the off-grid solar energy industry, adhering to quality standards and customer protection principles.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          marginBottom: 'var(--space-6)'
        }}></div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          fontSize: 'var(--text-xs)',
          color: 'var(--slate-500)',
          '@media (min-width: 641px)': { flexDirection: 'row' }
        }} className="footer-bottom">
          <p>© {new Date().getFullYear()} Meseret Mare Gebre Solar Importer. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Illuminating Homes, Powering Farms, Transforming Lives.
          </p>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 641px) {
          .footer-bottom {
            flex-direction: row !important;
          }
        }
      `}</style>
    </footer>
  );
}
