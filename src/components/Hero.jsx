import React from 'react';
import { ArrowRight, Sun, Shield, Award } from 'lucide-react';

export default function Hero() {
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
    <section id="home" className="section" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: 'calc(var(--header-height) + var(--space-8))',
      paddingBottom: 'var(--space-12)',
      background: 'radial-gradient(circle at 85% 15%, var(--amber-50) 0%, var(--white) 60%)',
      overflow: 'hidden'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--space-12)',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Left Content */}
        <div className="animate-fade-in-up" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left'
        }}>
          {/* Accent Label */}
          <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>
            Solar Energy Solutions Since 2016
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            color: 'var(--navy-900)',
            marginBottom: 'var(--space-6)',
            lineHeight: 1.1,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em'
          }}>
            Empowering Ethiopia <br/>
            With <span style={{
              background: 'linear-gradient(135deg, var(--amber-500), var(--amber-700))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>Sustainable Solar</span> Energy
          </h1>

          {/* Paragraph */}
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--slate-600)',
            lineHeight: 1.7,
            marginBottom: 'var(--space-8)',
            maxWidth: '580px'
          }}>
            We import and distribute high-quality, Lighting Global certified solar products to transform lives, boost agricultural yields, and power rural Ethiopian communities.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-12)',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => handleScrollTo('products')}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              Explore Products
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => handleScrollTo('services')}
              className="btn btn-secondary btn-lg"
            >
              Our Services
            </button>
          </div>

          {/* Badges / Trust Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-6)',
            alignItems: 'center',
            borderTop: '1px solid var(--border-light)',
            paddingTop: 'var(--space-6)',
            width: '100%',
            maxWidth: '580px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ color: 'var(--amber-600)', display: 'flex' }}><Shield size={18} /></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--navy-800)' }}>GOGLA Member</span>
            </div>
            <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-medium)' }} className="badge-sep"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ color: 'var(--amber-600)', display: 'flex' }}><Award size={18} /></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--navy-800)' }}>8+ Years Experience</span>
            </div>
            <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-medium)' }} className="badge-sep"></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ color: 'var(--amber-600)', display: 'flex' }}><Sun size={18} /></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--navy-800)' }}>10,000+ Families Powered</span>
            </div>
          </div>
        </div>

        {/* Right Graphic */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }} className="hero-graphic-container">
          {/* Background Ambient Glow */}
          <div style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
            zIndex: 1,
            filter: 'blur(30px)'
          }}></div>

          {/* Premium Vector Artwork */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '480px',
            animation: 'float 6s ease-in-out infinite',
            filter: 'drop-shadow(0 20px 40px rgba(16, 42, 67, 0.08))'
          }}>
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
              {/* Solar Sun Glow Rings */}
              <circle cx="250" cy="250" r="210" stroke="var(--amber-100)" strokeWidth="1" strokeDasharray="8 8" />
              <circle cx="250" cy="250" r="170" stroke="var(--amber-200)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="130" stroke="var(--amber-300)" strokeWidth="2" opacity="0.5" />

              {/* Sun Core */}
              <circle cx="250" cy="250" r="70" fill="url(#heroSunGrad)" />
              
              {/* Sun Rays */}
              <g stroke="url(#heroRayGrad)" strokeWidth="4" strokeLinecap="round">
                <line x1="250" y1="140" x2="250" y2="160" />
                <line x1="250" y1="340" x2="250" y2="360" />
                <line x1="140" y1="250" x2="160" y2="250" />
                <line x1="340" y1="250" x2="360" y2="250" />
                
                <line x1="172" y1="172" x2="186" y2="186" />
                <line x1="314" y1="314" x2="328" y2="328" />
                <line x1="172" y1="314" x2="186" y2="300" />
                <line x1="314" y1="172" x2="328" y2="186" />
              </g>

              {/* Solar Panel Shapes */}
              <g transform="translate(140, 290)">
                {/* Panel Backing */}
                <rect x="0" y="0" width="220" height="120" rx="12" fill="var(--navy-900)" />
                <rect x="2" y="2" width="216" height="116" rx="10" fill="var(--navy-800)" stroke="var(--navy-700)" strokeWidth="2" />
                
                {/* Silicon Cells Grid */}
                <line x1="0" y1="30" x2="220" y2="30" stroke="var(--navy-600)" strokeWidth="1.5" />
                <line x1="0" y1="60" x2="220" y2="60" stroke="var(--navy-600)" strokeWidth="1.5" />
                <line x1="0" y1="90" x2="220" y2="90" stroke="var(--navy-600)" strokeWidth="1.5" />
                
                <line x1="44" y1="0" x2="44" y2="120" stroke="var(--navy-600)" strokeWidth="1.5" />
                <line x1="88" y1="0" x2="88" y2="120" stroke="var(--navy-600)" strokeWidth="1.5" />
                <line x1="132" y1="0" x2="132" y2="120" stroke="var(--navy-600)" strokeWidth="1.5" />
                <line x1="176" y1="0" x2="176" y2="120" stroke="var(--navy-600)" strokeWidth="1.5" />

                {/* Highlight Overlay on Panel */}
                <path d="M10 10 L210 10 L180 110 L10 110 Z" fill="white" opacity="0.03" />
              </g>

              {/* Green Energy Leaves (Representing Sustainability) */}
              <path d="M100 240 C110 200, 160 210, 150 250 C140 290, 90 280, 100 240 Z" fill="var(--amber-400)" opacity="0.25" />
              <path d="M400 240 C390 200, 340 210, 350 250 C360 290, 410 280, 400 240 Z" fill="var(--amber-500)" opacity="0.2" />

              {/* Gradients */}
              <defs>
                <linearGradient id="heroSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--amber-300)" />
                  <stop offset="50%" stopColor="var(--amber-500)" />
                  <stop offset="100%" stopColor="var(--amber-600)" />
                </linearGradient>
                <linearGradient id="heroRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--amber-300)" />
                  <stop offset="100%" stopColor="var(--amber-500)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .hero-graphic-container {
          grid-row: 1;
        }
        @media (min-width: 1025px) {
          .container {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
          .hero-graphic-container {
            grid-row: auto !important;
          }
        }
        @media (max-width: 640px) {
          .badge-sep { display: none !important; }
          .container { gap: var(--space-8) !important; }
        }
      `}</style>
    </section>
  );
}
