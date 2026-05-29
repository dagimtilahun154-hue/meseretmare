import React, { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { Droplet, FileSearch, Wrench, HeartPulse, GraduationCap, Users, ArrowRight } from 'lucide-react';

export default function Services() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState('all');

  const services = [
    {
      id: 'pumps',
      icon: <Droplet size={24} />,
      title: 'Solar Water Pump Services',
      category: 'agriculture',
      description: 'End-to-end solutions for agricultural irrigation and community drinking water. Includes site need assessment, system design, high-quality submersible/surface pump provision, professional installation, and ongoing maintenance.'
    },
    {
      id: 'assessment',
      icon: <FileSearch size={24} />,
      title: 'Site Assessment & Design',
      category: 'engineering',
      description: 'Comprehensive analysis of solar potential, load requirements, and geographic conditions. We design custom solar configurations tailored to residential, institutional, or commercial requirements.'
    },
    {
      id: 'install',
      icon: <Wrench size={24} />,
      title: 'Installation & Commissioning',
      category: 'engineering',
      description: 'Turnkey setup by certified technical teams. We handle structure mounting, wiring, battery configuration, and testing to ensure system reliability and safety compliance.'
    },
    {
      id: 'maintenance',
      icon: <HeartPulse size={24} />,
      title: 'Monitoring & Maintenance',
      category: 'maintenance',
      description: 'Preventative check-ups and diagnostic support to maximize solar lifecycle. We offer rapid troubleshooting, replacement parts, and optimization services to keep your power running.'
    },
    {
      id: 'education',
      icon: <GraduationCap size={24} />,
      title: 'Educational Services',
      category: 'outreach',
      description: 'Empowering local communities with solar literacy. We conduct training sessions on basic maintenance, energy management, and sustainable practices for farmers and technicians.'
    },
    {
      id: 'outreach',
      icon: <Users size={24} />,
      title: 'Outreach & Distribution',
      category: 'outreach',
      description: 'Last-mile product promotion and distribution in remote, off-grid regions. Working with local microfinance institutions to make solar products financially accessible to everyone.'
    }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'engineering', name: 'Engineering & Setup' },
    { id: 'agriculture', name: 'Water & Agriculture' },
    { id: 'maintenance', name: 'Support & Care' },
    { id: 'outreach', name: 'Outreach & Training' }
  ];

  return (
    <section id="services" className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div className="section-label" style={{ margin: '0 auto var(--space-4)' }}>Our Services</div>
          <h2 className="section-title">Comprehensive Solar Capabilities</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We provide full lifecycle support for solar installations — from initial design and import to professional setup, maintenance, and community education.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-10)',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: activeTab === cat.id ? 'var(--amber-500)' : 'var(--border-light)',
                backgroundColor: activeTab === cat.id ? 'var(--amber-50)' : 'var(--white)',
                color: activeTab === cat.id ? 'var(--amber-700)' : 'var(--slate-600)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div 
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          {filteredServices.map((service, index) => (
            <div 
              key={service.id} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                height: '100%'
              }}
            >
              <div className="card-icon">
                {service.icon}
              </div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description" style={{ flexGrow: 1, marginBottom: 'var(--space-6)' }}>
                {service.description}
              </p>
              
              <button 
                onClick={() => {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--amber-700)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  padding: 0
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--amber-500)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--amber-700)'}
              >
                Inquire about this
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
