import React, { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';

export default function Contact() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'pumps',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', email: '', interest: 'pumps', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section section-light" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div 
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-12)',
            alignItems: 'start',
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          {/* Column 1: Contact Details & Office info */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div className="section-label">Contact Us</div>
            <h2 className="section-title">Get in Touch with Our Solar Experts</h2>
            <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
              Have questions about solar pricing, specifications, or agricultural pump designs? Send us a message, email us, or visit our Addis Ababa office.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Address */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--amber-50)',
                  color: 'var(--amber-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--navy-900)' }}>Head Office Location</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Gulele Sub City, Addisu Gebeya, Near to NOC Gas Station, Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--amber-50)',
                  color: 'var(--amber-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--navy-900)' }}>Call Us Directly</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: '2px', display: 'flex', gap: 'var(--space-3)' }}>
                    <span>+251 910691261</span>
                    <span style={{ color: 'var(--border-medium)' }}>|</span>
                    <span>+251 913040053</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--amber-50)',
                  color: 'var(--amber-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--navy-900)' }}>Email Inquiries</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: '2px', display: 'flex', gap: 'var(--space-3)' }}>
                    <span>meseretmare79@gmail.com</span>
                    <span style={{ color: 'var(--border-medium)' }}>|</span>
                    <span>info@meseretmare.com</span>
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--amber-50)',
                  color: 'var(--amber-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--navy-900)' }}>Business Hours</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Monday - Saturday: 8:30 AM - 5:30 PM (Local Time)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quote/Contact Form */}
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--navy-900)',
              marginBottom: 'var(--space-2)',
              textAlign: 'left'
            }}>Request a Quote or Consultation</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-6)', textAlign: 'left' }}>
              Fill out the form below and our technical sales team will contact you with options within 24 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-800)', marginBottom: 'var(--space-1)' }}>Your Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Abebe Kebede"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    transition: 'border var(--transition-fast)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--amber-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>

              {/* Grid: Phone & Email */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--space-4)'
              }} className="form-grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-800)', marginBottom: 'var(--space-1)' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +251 911234567"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      border: '1.5px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--amber-500)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-800)', marginBottom: 'var(--space-1)' }}>Email Address</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. abebe@gmail.com"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      border: '1.5px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--amber-500)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>
              </div>

              {/* Product Interest Select */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-800)', marginBottom: 'var(--space-1)' }}>Solar Solution Interest *</label>
                <select 
                  value={formData.interest}
                  onChange={(e) => setFormData({...formData, interest: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    backgroundColor: 'var(--white)'
                  }}
                >
                  <option value="pumps">Solar Water Pumps (Submersible / Surface)</option>
                  <option value="home-systems">Solar Home Systems (SK Home 120, etc.)</option>
                  <option value="lighting">Portable Lighting & Lanterns</option>
                  <option value="tv">Solar TVs & Large Appliances</option>
                  <option value="other">General Service / Partnership Inquiry</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--navy-800)', marginBottom: 'var(--space-1)' }}>Your Requirements *</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your site, depth of well (if pump), number of rooms (if home kit), or specific questions."
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--amber-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting || submitSuccess}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  opacity: (isSubmitting || submitSuccess) ? 0.8 : 1,
                  cursor: (isSubmitting || submitSuccess) ? 'not-allowed' : 'pointer'
                }}
              >
                {submitSuccess ? (
                  <>
                    <Check size={18} />
                    Message Sent Successfully!
                  </>
                ) : isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={16} />
                    Send Inquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          #contact .container > div {
            grid-template-columns: 0.95fr 1.05fr !important;
          }
        }
        @media (min-width: 641px) {
          .form-grid-2 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
