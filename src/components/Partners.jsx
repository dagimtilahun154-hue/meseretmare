import React from 'react';
import { useInView } from '../hooks/useInView';
import { Landmark, Award, Shield, CheckCircle } from 'lucide-react';

export default function Partners() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  const partners = [
    {
      name: 'Ministry of Water and Energy',
      role: 'Regulatory & Policy Alignment',
      desc: 'Collaborating on rural electrification targets and standard compliance for solar imports across Ethiopia.',
      icon: <Landmark size={24} style={{ color: 'var(--amber-600)' }} />
    },
    {
      name: 'GIZ Ethiopia',
      role: 'Development Partner',
      desc: 'Partnering on technical capacity building, field training for solar technicians, and rural distribution networks.',
      icon: <Award size={24} style={{ color: 'var(--amber-600)' }} />
    },
    {
      name: 'SNV Netherlands',
      role: 'Agricultural Solar Sponsor',
      desc: 'Joint projects deploying high-efficiency solar water pumps for smallholder farmers to boost irrigation output.',
      icon: <CheckCircle size={24} style={{ color: 'var(--amber-600)' }} />
    },
    {
      name: 'Development Bank of Ethiopia',
      role: 'Financing & Credit Line Partner',
      desc: 'Working under the DBE credit facility to facilitate forex allocation and rural customer financing models.',
      icon: <Landmark size={24} style={{ color: 'var(--amber-600)' }} />
    },
    {
      name: 'GOGLA',
      role: 'Global Association Member',
      desc: 'Active member of the global association for the off-grid solar energy industry, ensuring high service quality.',
      icon: <Shield size={24} style={{ color: 'var(--amber-600)' }} />
    },
    {
      name: 'CARE Ethiopia & MFIs',
      role: 'Micro-Credit & Community Support',
      desc: 'Partnering with local Microfinance Institutions to provide credit options for low-income farmers buying solar kits.',
      icon: <Landmark size={24} style={{ color: 'var(--amber-600)' }} />
    }
  ];

  return (
    <section id="partners" className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>Partnerships</div>
          <h2 className="section-title">Trusted Stakeholders & Partners</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We work hand-in-hand with governmental ministries, international development agencies, and financial institutions to build a sustainable solar ecosystem.
          </p>
        </div>

        {/* Partners Grid */}
        <div 
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: 'var(--space-6)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--amber-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {partner.icon}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    lineHeight: 1.2
                  }}>{partner.name}</h3>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--amber-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>{partner.role}</span>
                </div>
              </div>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--slate-500)',
                lineHeight: 1.6
              }}>
                {partner.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
