import { getApiUrl } from '../api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('auth.php?action=login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('dm154_admin_token', data.token);
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Animated Glowing Solar Background Orbs */}
      <motion.div
        className="solar-orb orb-1"
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.45, 0.7, 0.45]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="solar-orb orb-2"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 40, 0],
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="solar-orb orb-3"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 30, 0],
          opacity: [0.25, 0.5, 0.25]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Main Glassmorphic Login Card */}
      <motion.div
        className="stunning-login-card"
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Brand Header */}
        <div className="login-header">
          <motion.div
            className="brand-icon-wrapper"
            whileHover={{ scale: 1.06, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sun size={28} className="sun-icon-animated" />
          </motion.div>
          <div className="brand-text-block">
            <h2>Meseret Solar</h2>
            <div className="admin-badge">
              <ShieldCheck size={13} />
              <span>Admin Management System</span>
            </div>
          </div>
        </div>

        {/* Error Alert with Shake Effect */}
        {error && (
          <motion.div
            className="login-error-alert"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: [-8, 8, -6, 6, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-animated">
            <label>Username / Email</label>
            <div className="input-field-shell">
              <User size={18} className="field-icon" />
              <input
                type="text"
                className="stunning-input"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-group-animated">
            <label>Security Password</label>
            <div className="input-field-shell">
              <Lock size={18} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="stunning-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="stunning-submit-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="btn-loading-state">
                <span className="spinner-dot"></span> Authenticating...
              </span>
            ) : (
              <span className="btn-idle-state">
                Log In to Admin Panel <ArrowRight size={18} />
              </span>
            )}
          </motion.button>
        </form>

        {/* Card Footer */}
        <div className="login-footer-info">
          <p>&copy; {new Date().getFullYear()} Meseret Mare Gebre Solar Products Importer</p>
          <span className="security-tag">Protected Admin Area</span>
        </div>
      </motion.div>
    </div>
  );
}
