import React, { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { Droplet, Lightbulb, Tv, ShieldCheck, Zap, Factory } from 'lucide-react';

export default function Products() {
  const [ref, isVisible] = useInView({ threshold: 0.05 });
  const [activeFilter, setActiveFilter] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Difful Submersible Solar Pump',
      model: '1500W 110V Motor DC',
      category: 'pumps',
      tag: 'Agriculture & Drinking Water',
      certified: true,
      features: [
        'Brushless DC high-efficiency motor',
        'Automatic dry-run protection',
        'Stainless steel casing & pump body',
        'MPPT controller for maximum solar power usage',
        'Includes water level sensors'
      ],
      specs: { power: '1500 Watts', voltage: '110 Volts DC', depth: 'Up to 120m', flow: '6.5 m³/hour' },
      icon: <Droplet size={32} style={{ color: 'var(--amber-600)' }} />
    },
    {
      id: 2,
      name: 'Sun King Home 120 System',
      model: 'SK-120 Multi-Bulb Home System',
      category: 'home-systems',
      tag: 'Home Power & Lighting',
      certified: true,
      features: [
        '3 ultra-bright LED hanging lamps',
        'USB charging ports for multiple mobile phones',
        'Long-life Lithium Ferro-Phosphate battery',
        '12W high-efficiency crystalline solar panel',
        'Real-time charging & battery status monitor'
      ],
      specs: { runtime: 'Up to 24 hours', brightness: '600 Lumens total', battery: 'LFP 12,000mAh', panel: '12W Crystalline' },
      icon: <Zap size={32} style={{ color: 'var(--amber-600)' }} />
    },
    {
      id: 3,
      name: 'Sun King T200R Portable Lantern',
      model: 'T200R with Remote Control',
      category: 'lighting',
      tag: 'Portable Lighting',
      certified: true,
      features: [
        'Handheld lantern with built-in solar panel & kickstand',
        'Wireless remote control for convenient operation',
        'Durable, drop-proof, water-resistant casing',
        'USB output port for emergency phone charging',
        '3 power modes (Low, Medium, Turbo)'
      ],
      specs: { runtime: 'Up to 30 hours', brightness: '200 Lumens', charging: 'Solar & AC adapter', utility: 'Mobile USB out' },
      icon: <Lightbulb size={32} style={{ color: 'var(--amber-600)' }} />
    },
    {
      id: 4,
      name: '32" Solar Powered LED TV Set',
      model: 'High-Efficiency DC TV',
      category: 'appliances',
      tag: 'Appliances & Education',
      certified: false,
      features: [
        'Ultra-low power consumption (25W energy-draw)',
        'Built-in DVB-T2/S2 satellite receiver',
        'Full HD resolution with energy-saver LED panel',
        'USB media playback (Videos, Music, Photos)',
        'Includes dedicated 50W solar panel and solar control hub'
      ],
      specs: { screen: '32 inch LED', power: '25W DC 12V', tuner: 'Satellite & Terrestrial', inputs: 'HDMI, USB, AV' },
      icon: <Tv size={32} style={{ color: 'var(--amber-600)' }} />
    },
    {
      id: 5,
      name: 'Difful Surface Solar Pump',
      model: '500W DC Surface Pump',
      category: 'pumps',
      tag: 'Shallow Irrigation',
      certified: true,
      features: [
        'Ideal for shallow wells, rivers, and storage ponds',
        'Quiet brushless DC motor with simple setup',
        'Cast iron body with rust-resistant finish',
        'Runs directly on solar panel without batteries',
        'Over-voltage and low-voltage protection'
      ],
      specs: { power: '500 Watts', voltage: '48 Volts DC', lift: 'Up to 35m', flow: '3.0 m³/hour' },
      icon: <Droplet size={32} style={{ color: 'var(--amber-600)' }} />
    }
  ];

  const filteredProducts = activeFilter === 'all'
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
          {[
            { id: 'all', name: 'All Products' },
            { id: 'pumps', name: 'Solar Water Pumps' },
            { id: 'home-systems', name: 'Solar Home Systems' },
            { id: 'lighting', name: 'Portable Lighting' },
            { id: 'appliances', name: 'Solar TV & Appliances' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: activeFilter === filter.id ? 'var(--amber-500)' : 'var(--border-light)',
                backgroundColor: activeFilter === filter.id ? 'var(--amber-50)' : 'var(--white)',
                color: activeFilter === filter.id ? 'var(--amber-700)' : 'var(--slate-600)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
              }}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div 
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--space-8)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                textAlign: 'left',
                padding: 'var(--space-8)',
                height: '100%',
                position: 'relative',
                border: '1px solid var(--border-light)'
              }}
            >
              {/* Product Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-5)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--amber-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {p.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'var(--navy-50)',
                    color: 'var(--navy-700)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>{p.tag}</span>
                  {p.certified && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: '#DEF7EC',
                      color: '#03543F',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={10} />
                      Lighting Global
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Model */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--navy-900)'
                }}>{p.name}</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontWeight: 500 }}>{p.model}</span>
              </div>

              {/* Features List */}
              <div style={{ flexGrow: 1, marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-600)', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Key Features</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {p.features.map((feat, index) => (
                    <li key={index} style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--slate-600)',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'start',
                      gap: 'var(--space-2)'
                    }}>
                      <span style={{ color: 'var(--amber-500)', marginTop: '3px', fontWeight: 'bold' }}>•</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specs Table */}
              <div style={{
                backgroundColor: 'var(--slate-50)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: 'var(--space-4)'
              }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-600)', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Specifications</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                  {Object.entries(p.specs).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 600 }}>{key}</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-900)' }}>{val}</span>
                    </div>
                  ))}
                </div>
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
