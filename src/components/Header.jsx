import React, { useState, useEffect } from 'react';
import { Sun, Menu, X, Phone } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 'var(--header-height)',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
      boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
      backdropFilter: isScrolled ? 'blur(8px)' : 'none',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'all var(--transition-base)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Logo */}
        <div 
          onClick={() => scrollToSection('home')} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--white)',
            boxShadow: 'var(--shadow-amber)'
          }}>
            <Sun size={22} className="animate-spin-slow" style={{ animation: 'spin-slow 20s linear infinite' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 800,
              color: 'var(--navy-900)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>MESERET MARE</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 600,
              color: 'var(--amber-600)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>Solar Importer</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          gap: 'var(--space-8)',
          alignItems: 'center',
          '@media (min-width: 769px)': { display: 'flex' }
        }} className="desktop-nav">
          <ul style={{
            display: 'flex',
            gap: 'var(--space-8)',
            alignItems: 'center'
          }}>
            {['Home', 'About', 'Services', 'Products', 'Partners', 'Contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item.toLowerCase())}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--navy-700)',
                    transition: 'color var(--transition-fast)',
                    padding: 'var(--space-2) 0',
                    borderBottom: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--amber-600)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--navy-700)'}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <button 
            onClick={() => scrollToSection('contact')}
            className="btn btn-primary"
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-xs)',
              display: 'none',
              '@media (min-width: 640px)': { display: 'inline-flex' }
            }}
          >
            Get a Quote
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              color: 'var(--navy-900)'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--header-height)',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          zIndex: 999
        }}>
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            {['Home', 'About', 'Services', 'Products', 'Partners', 'Contact'].map((item) => (
              <li key={item} style={{ width: '100%' }}>
                <button
                  onClick={() => scrollToSection(item.toLowerCase())}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-2) 0',
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: 'var(--navy-900)'
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => scrollToSection('contact')}
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-3)' }}
          >
            Get a Quote
          </button>
        </div>
      )}

      {/* Global CSS Inject to support media queries for inline styles */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 640px) {
          .btn-primary-desktop { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
