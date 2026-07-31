import { getApiUrl } from '../api';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, User, Lock, Mail, CheckCircle, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Sparkles, HelpCircle, HardDrive } from 'lucide-react';

export default function SetupPage({ onSetupComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State tailored for cPanel hosting
  const [formData, setFormData] = useState({
    db_host: 'localhost',
    db_port: '3306',
    db_name: '',
    db_user: '',
    db_pass: '',
    admin_user: 'admin',
    admin_email: 'admin@meseretmare.com',
    admin_pass: 'admin123'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRunSetup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('install.php?action=setup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg(data.message || 'cPanel Installation completed successfully!');
        setStep(3);
      } else {
        setError(data.error || 'cPanel Setup failed. Please check database credentials.');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Background Orbs */}
      <motion.div
        className="solar-orb orb-1"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="solar-orb orb-2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="stunning-login-card"
        style={{ maxWidth: '540px' }}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="login-header">
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
            <HardDrive size={28} className="sun-icon-animated" />
          </div>
          <div className="brand-text-block">
            <h2>cPanel Web Installer</h2>
            <div className="admin-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
              <Database size={13} />
              <span>cPanel MySQL & Admin Setup</span>
            </div>
          </div>
        </div>

        {/* cPanel Notice Box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', fontSize: '12px', color: '#cbd5e1', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <HelpCircle size={18} style={{ color: '#38bdf8', shrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '2px' }}>cPanel Hosting Instructions:</strong>
            Create a MySQL Database and Database User via your <strong>cPanel &rarr; MySQL® Databases Wizard</strong> first, then enter the created database details below.
          </div>
        </div>

        {/* Progress Step Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: s <= step ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="login-error-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={(e) => { e.preventDefault(); setStep(2); }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="login-form"
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={18} style={{ color: '#38bdf8' }} /> 1. cPanel MySQL Connection
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="input-group-animated">
                  <label>cPanel Host</label>
                  <div className="input-field-shell">
                    <Server size={18} className="field-icon" />
                    <input
                      type="text"
                      name="db_host"
                      className="stunning-input"
                      value={formData.db_host}
                      onChange={handleChange}
                      placeholder="localhost"
                      required
                    />
                  </div>
                </div>
                <div className="input-group-animated">
                  <label>Port</label>
                  <input
                    type="text"
                    name="db_port"
                    className="stunning-input"
                    style={{ paddingLeft: '16px' }}
                    value={formData.db_port}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group-animated">
                <label>cPanel Database Name</label>
                <div className="input-field-shell">
                  <Database size={18} className="field-icon" />
                  <input
                    type="text"
                    name="db_name"
                    className="stunning-input"
                    value={formData.db_name}
                    onChange={handleChange}
                    placeholder="e.g. cpanelusername_meseretdb"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group-animated">
                  <label>cPanel DB User</label>
                  <input
                    type="text"
                    name="db_user"
                    className="stunning-input"
                    style={{ paddingLeft: '16px' }}
                    value={formData.db_user}
                    onChange={handleChange}
                    placeholder="e.g. cpaneluser_dbuser"
                    required
                  />
                </div>
                <div className="input-group-animated">
                  <label>cPanel DB Password</label>
                  <input
                    type="password"
                    name="db_pass"
                    className="stunning-input"
                    style={{ paddingLeft: '16px' }}
                    value={formData.db_pass}
                    onChange={handleChange}
                    placeholder="Database Password"
                  />
                </div>
              </div>

              <button type="submit" className="stunning-submit-btn" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                Next: Admin Account <ArrowRight size={18} />
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              onSubmit={handleRunSetup}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="login-form"
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: '#38bdf8' }} /> 2. Administrator Account
              </h3>

              <div className="input-group-animated">
                <label>Admin Username</label>
                <div className="input-field-shell">
                  <User size={18} className="field-icon" />
                  <input
                    type="text"
                    name="admin_user"
                    className="stunning-input"
                    value={formData.admin_user}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group-animated">
                <label>Admin Email</label>
                <div className="input-field-shell">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="admin_email"
                    className="stunning-input"
                    value={formData.admin_email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group-animated">
                <label>Admin Security Password</label>
                <div className="input-field-shell">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    name="admin_pass"
                    className="stunning-input"
                    value={formData.admin_pass}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="stunning-submit-btn"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: '35%' }}
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="stunning-submit-btn"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', width: '65%' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-loading-state">
                      <RefreshCw size={18} className="spinner-dot" /> Configuring cPanel DB...
                    </span>
                  ) : (
                    'Run cPanel Setup'
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '10px 0' }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', border: '2px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                cPanel Installation Complete!
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '24px' }}>
                {successMsg} Your cPanel database is bootstrapped with all tables and administrator credentials.
              </p>
              <button
                type="button"
                className="stunning-submit-btn"
                onClick={onSetupComplete}
                style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              >
                Proceed to Admin Login <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="login-footer-info">
          <p>Meseret Solar System &copy; {new Date().getFullYear()} &bull; Tailored for cPanel Web Hosting</p>
        </div>
      </motion.div>
    </div>
  );
}
