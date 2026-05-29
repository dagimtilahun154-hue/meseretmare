import React from 'react';
import { useInView } from '../hooks/useInView';
import { Target, Eye, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export default function About() {
  const [ref, isVisible] = useInView({ threshold: 0.15 });

  const coreValues = [
    { name: 'Customer-Centered', desc: 'Putting the energy needs of our community first.' },
    { name: 'Trustworthiness', desc: 'Building long-term relationships through honesty and transparency.' },
    { name: 'Quality & Excellence', desc: 'Distributing only Lighting Global certified solar products.' },
    { name: 'Strong Partnerships', desc: 'Collaborating with government and NGOs for maximum impact.' }
  ];

  return (
    <section id="about" className="section section-light" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div 
          ref={ref}
          className={`will-animate ${isVisible ? 'animate-fade-in-up' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-12)',
            alignItems: 'start',
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease-out'
          }}
        >
          {/* Column 1: History & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div className="section-label">Who We Are</div>
            <h2 className="section-title" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--text-3xl)',
              color: 'var(--navy-900)',
              marginBottom: 'var(--space-6)'
            }}>
              Dedicated to Solving Ethiopia's Rural Energy Challenges
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--slate-600)',
              lineHeight: 1.75,
              marginBottom: 'var(--space-6)'
            }}>
              Established in 2016, <strong>Meseret Mare Gebre Solar Products Importer</strong> has been a pioneer in addressing the critical energy shortage in Ethiopia. Our primary objective is to enhance the lifestyle of citizens, particularly in rural and off-grid areas, by importing and distributing high-quality solar products at affordable rates.
            </p>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--slate-600)',
              lineHeight: 1.75,
              marginBottom: 'var(--space-8)'
            }}>
              We believe that access to clean, renewable electricity is a fundamental driver of social and economic progress. By replacing kerosene lamps and powering agricultural pumps, we create safer homes and more productive farms.
            </p>

            {/* Quick Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)'
            }}>
              {[
                { label: 'Founded', val: '2016' },
                { label: 'Off-grid Systems', val: '10k+' },
                { label: 'Districts Served', val: '40+' },
                { label: 'GOGLA Certified', val: '100%' }
              ].map((stat, i) => (
                <div key={i} className="card" style={{
                  padding: 'var(--space-5) var(--space-4)',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    color: 'var(--amber-600)'
                  }}>{stat.val}</div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--navy-700)',
                    textTransform: 'uppercase',
                    marginTop: 'var(--space-1)',
                    letterSpacing: '0.05em'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Mission, Vision & Values */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Mission Card */}
            <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'start' }}>
              <div className="card-icon" style={{ flexShrink: 0, marginBottom: 0 }}>
                <Target size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 className="card-title" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Our Mission</h3>
                <p className="card-description">
                  To strive daily to fulfill the power needs of the Ethiopian people, render the highest quality of service, and provide innovative solar solutions that benefit our customers and partners.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'start' }}>
              <div className="card-icon" style={{ flexShrink: 0, marginBottom: 0 }}>
                <Eye size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 className="card-title" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Our Vision</h3>
                <p className="card-description">
                  To completely alleviate the power challenges of rural Ethiopians through sustainable, green, and affordable solar technologies.
                </p>
              </div>
            </div>

            {/* Core Values Card */}
            <div className="card" style={{ textAlign: 'left' }}>
              <h3 className="card-title" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <HeartHandshake size={22} style={{ color: 'var(--amber-600)' }} />
                Our Core Values
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--space-4)'
              }}>
                {coreValues.map((val, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'start' }}>
                    <div style={{ color: 'var(--amber-500)', marginTop: '2px', display: 'flex' }}>
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--navy-900)' }}>{val.name}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: '2px' }}>{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 1025px) {
          #about .container > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
