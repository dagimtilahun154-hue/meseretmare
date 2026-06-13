import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BatteryCharging,
  Check,
  ChevronRight,
  Clock,
  Droplet,
  Eye,
  Factory,
  FileSearch,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Target,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import siteData from './data/site.json';
import homepageData from './data/homepage.json';
import copyData from './data/copy.json';
import newsData from './data/news.json';
import productsData from './data/products.json';
import servicesData from './data/services.json';
import metricsData from './data/metrics.json';
import partnersData from './data/partners.json';
import valuesData from './data/values.json';
import timelineData from './data/timeline.json';
import featuredData from './data/featured.json';

const IconsMap = {
  ArrowRight,
  Award,
  BatteryCharging,
  Check,
  ChevronRight,
  Clock,
  Droplet,
  Eye,
  Factory,
  FileSearch,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Target,
  Users,
  Wrench,
  X,
  Zap,
};

const getIcon = (name) => IconsMap[name] || Zap;

const siteSettings = siteData;
const homepage = homepageData;
const navItems = siteSettings.navigation || [];
const siteMedia = siteSettings.media || {};
const contactInfo = siteSettings.contact || {};
const footerContent = siteSettings.footer || {};
const socialLinks = siteSettings.social_links || [];

const routeIds = new Set([...navItems.map((item) => item.id), 'contact']);
const normalizeRoute = (target, fallback = 'home') => (routeIds.has(target) ? target : fallback);
const phoneHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
const splitLines = (value) => String(value || '').split('\n');

const metrics = metricsData.metrics.map((m) => [m.value, m.label]);

const highlights = (homepage.capabilities?.items || []).map((item) => ({
  ...item,
  icon: getIcon(item.icon),
}));

const services = servicesData.services.map((s) => ({
  ...s,
  icon: getIcon(s.icon),
}));

const products = productsData.products;

const featuredProducts = featuredData.featured.map((f) => ({
  ...f,
  icon: getIcon(f.icon),
}));

const partnerLogos = siteSettings.partner_logos || [];
const previousWorks = homepage.field_proof?.items || [];
const operatingModel = homepage.operating_model?.steps || [];

const coreValues = valuesData.values.map((v) => [v.title, v.description]);

const newsPosts = newsData.posts;

const partnerDetails = partnersData.partners.map((p) => [p.name, p.subtitle, p.description]);

const pageCopy = copyData;

const aboutTimeline = timelineData.timeline;

const pageMotion = {
  initial: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, scale: 0.98, filter: 'blur(12px)' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const revealMotion = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  viewport: { once: true, amount: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 28, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const slideFromLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const slideFromRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

function getInitialPage() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'contact') return 'contact';
  return navItems.some((item) => item.id === hash) ? hash : 'home';
}

function Header({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const headerCta = siteSettings.header_cta || {};

  useEffect(() => {
    const updateHeaderMode = () => {
      const hero = document.querySelector('.hero, .page-hero');
      const heroHeight = hero?.getBoundingClientRect().height || window.innerHeight;
      const trigger = Math.max(140, heroHeight - 110);
      setOverHero(window.scrollY < trigger);
    };

    updateHeaderMode();
    window.addEventListener('scroll', updateHeaderMode, { passive: true });
    window.addEventListener('resize', updateHeaderMode);
    return () => {
      window.removeEventListener('scroll', updateHeaderMode);
      window.removeEventListener('resize', updateHeaderMode);
    };
  }, [activePage]);

  const handleNavigate = (page) => {
    setOpen(false);
    onNavigate(page);
  };

  return (
    <header className={`site-header ${overHero && !open ? 'is-hero-mode' : 'is-floating'} ${open ? 'menu-open' : ''}`}>
      <div className="container header-inner">
        <button className="brand" type="button" onClick={() => handleNavigate('home')}>
          <span className="brand-mark" aria-hidden="true">
            <img src={siteSettings.brand?.logo} alt="" />
          </span>
          <span>
            <span className="brand-name">{siteSettings.brand?.name}</span>
            <span className="brand-subtitle">{siteSettings.brand?.subtitle}</span>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={activePage === item.id ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="btn btn-primary btn-sm" type="button" onClick={() => handleNavigate(normalizeRoute(headerCta.target, 'contact'))}>
            {headerCta.label}
          </button>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} />
          <div className="mobile-nav">
            {navItems.map((item) => (
              <button
                className={activePage === item.id ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
              >
                {item.label}
                <ChevronRight size={16} />
              </button>
            ))}
            <button
              className={activePage === 'contact' ? 'active' : ''}
              type="button"
              onClick={() => handleNavigate('contact')}
            >
              {footerContent.contact_nav_label || 'Contact'}
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}

function PartnerRibbon() {
  const renderLogoSet = (hidden = false) => (
    <div className="partner-ribbon-set" aria-hidden={hidden}>
      {partnerLogos.map((partner) => (
        <span className="partner-logo-pill" key={`${hidden ? 'repeat-' : ''}${partner.name}`}>
          <img
            src={partner.logo}
            alt={hidden ? '' : partner.name}
            loading="eager"
            decoding="async"
            draggable="false"
          />
          <span>{partner.name}</span>
        </span>
      ))}
    </div>
  );

  return (
    <motion.div
      className="partner-ribbon"
      aria-label="Partner logos"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="partner-ribbon-track">
        {renderLogoSet()}
        {renderLogoSet(true)}
      </div>
    </motion.div>
  );
}

function HomePage({ onNavigate }) {
  const hero = homepage.hero || {};
  const heroPrimary = hero.primary_button || {};
  const latestNews = homepage.latest_news || {};
  const finalCta = homepage.final_cta || {};

  return (
    <div className="page-view home-view">
      <motion.section
        className="hero"
        style={{ '--hero-bg': `url(${siteMedia.home_hero_image})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container hero-shell">
          <motion.div
            className="hero-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >{hero.title}</motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >{hero.subtitle}</motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="btn btn-primary" type="button" onClick={() => onNavigate(normalizeRoute(heroPrimary.target, 'products'))}>
                {heroPrimary.label}
                <ArrowRight size={18} />
              </button>
              <a className="btn btn-secondary btn-call" href={phoneHref(contactInfo.primary_phone)}>
                <Phone size={18} />
                <span>{contactInfo.phone_cta_label}</span>
                <strong>{contactInfo.phone_cta_display}</strong>
              </a>
            </motion.div>
          </motion.div>
        </div>
        <PartnerRibbon />
      </motion.section>

      <motion.section className="container metrics-dock" aria-label="Company metrics" {...staggerContainer}>
        {metrics.map(([value, label], i) => (
          <motion.div className="metric-tile" key={label} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.1 }}>
            <strong>{value}</strong>
            <span>{label}</span>
          </motion.div>
        ))}
      </motion.section>

      <motion.section className="container capability-band" aria-label="Company strengths" {...revealMotion}>
        <motion.div {...slideFromLeft}>
          <h2>{homepage.capabilities?.heading}</h2>
        </motion.div>
        <motion.div className="capability-list" {...staggerContainer}>
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div className="capability-item" key={item.label} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.1 }}>
                <Icon size={20} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section className="container showcase-section" aria-label="Featured solar products" {...revealMotion}>
        <motion.div className="section-kicker" {...slideFromLeft}>
          <h2>{homepage.featured?.heading}</h2>
        </motion.div>
        <motion.div className="product-rail" {...staggerContainer}>
          {featuredProducts.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button className="product-rail-item" key={item.title} type="button" onClick={() => onNavigate('products')} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.12 }}>
                <img src={item.image} alt="" aria-hidden="true" loading="lazy" />
                <Icon size={28} />
                <span>{item.title}</span>
                <strong>{item.meta}</strong>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section className="container works-section" aria-label="Previous works" {...revealMotion}>
        <motion.div className="section-kicker" {...slideFromLeft}>
          <h2>{homepage.field_proof?.heading}</h2>
        </motion.div>
        <motion.div className="work-timeline" {...staggerContainer}>
          {previousWorks.map((item, index) => (
            <motion.article className="work-row" key={item.title} {...staggerItem} transition={{ ...staggerItem.transition, delay: index * 0.12 }}>
              <img src={item.image} alt="" aria-hidden="true" loading="lazy" referrerPolicy="no-referrer" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="achievements-section" aria-label="Our Achievements" {...fadeInScale}>
        <div className="container achievements-inner">
          <motion.div className="achievements-header" {...slideFromLeft}>
            <h2>{homepage.achievements?.heading}</h2>
          </motion.div>
          <motion.div className="achievements-grid" {...staggerContainer}>
            {(homepage.achievements?.items || []).map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div className="achievement-card" key={item.title} {...staggerItem} transition={{ ...staggerItem.transition, delay: index * 0.1 }}>
                  <Icon size={48} className="achievement-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="container operating-section" aria-label="Operating model" {...fadeInScale}>
        <motion.div className="operating-panel" {...revealMotion}>
          <motion.div {...slideFromLeft}>
            <h2>{homepage.operating_model?.heading}</h2>
          </motion.div>
          <motion.div className="operating-steps" {...staggerContainer}>
            {operatingModel.map((step, i) => (
              <motion.div key={step.label} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.1 }}>
                <span>{step.number}</span>
                <strong>{step.label}</strong>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section className="container" aria-label="Latest news" style={{ paddingBottom: 44 }} {...revealMotion}>
        <motion.div className="news-section-kicker" {...slideFromLeft}>
          <h2>{latestNews.heading}</h2>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => onNavigate(normalizeRoute(latestNews.target, 'news'))}>
            {latestNews.button_label} <ArrowRight size={16} />
          </button>
        </motion.div>
        <motion.div className="news-grid" {...staggerContainer}>
          {newsPosts.slice(0, latestNews.count || 3).map((post, i) => (
            <motion.div key={post.id} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.12 }}>
              <NewsCard post={post} onClick={() => onNavigate('news')} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="container prestige-cta" aria-label="Project call to action" {...fadeInScale}>
        <div>
          <h2>{finalCta.heading}</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => onNavigate(normalizeRoute(finalCta.target, 'contact'))}>
          {finalCta.button_label}
          <ArrowRight size={18} />
        </button>
      </motion.section>
    </div>
  );
}

function PageShell({ page, children, side }) {
  const copy = pageCopy[page];

  return (
    <div className="page-view">
      <motion.section
        className="page-hero"
        style={{ '--hero-bg': `url(${siteMedia.page_hero_image})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container page-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {side}
          </motion.div>
        </div>
      </motion.section>
      <motion.section
        className="container page-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >{children}</motion.section>
    </div>
  );
}

function AboutPage() {
  const copy = pageCopy.about;

  return (
    <PageShell
      page="about"
      side={
        <div className="signature-panel">
          <ShieldCheck size={26} />
          <strong>{copy.signature_title}</strong>
          <span>{copy.signature_text}</span>
        </div>
      }
    >
      {/* Intro Section */}
      <motion.div className="about-intro-grid" {...revealMotion}>
        <div className="about-intro-text">
          <h2>{copy.intro_title}</h2>
          {(copy.intro_paragraphs || []).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="about-stats-container">
          {metrics.map(([value, label]) => (
            <div className="about-stat-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div className="about-mission-vision" {...revealMotion}>
        <div className="about-mv-card mission">
          <div className="about-mv-icon">
            <Target size={24} />
          </div>
          <h2>{copy.mission_title}</h2>
          <p>{copy.mission_description}</p>
        </div>
        <div className="about-mv-card vision">
          <div className="about-mv-icon">
            <Eye size={24} />
          </div>
          <h2>{copy.vision_title}</h2>
          <p>{copy.vision_description}</p>
        </div>
      </motion.div>

      {/* Core Values */}
      <motion.div {...revealMotion}>
        <div className="about-section-header">
          <h2>{copy.values_heading}</h2>
          <p>{copy.values_intro}</p>
        </div>
        <div className="statement-grid value-grid">
          {coreValues.map(([name, desc]) => (
            <div className="soft-card compact" key={name}>
              <Check size={20} />
              <strong>{name}</strong>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Growth Timeline */}
      <motion.div className="about-timeline-section" {...revealMotion}>
        <div className="about-section-header">
          <h2>{copy.timeline_heading}</h2>
          <p>{copy.timeline_intro}</p>
        </div>
        <div className="about-timeline">
          {aboutTimeline.map((node) => (
            <div className="about-timeline-node" key={node.year}>
              <div className="about-timeline-dot" />
              <div className="about-timeline-card">
                <h3>{node.year}</h3>
                <p>{node.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}

function NewsCard({ post, onClick }) {
  return (
    <motion.article className="news-card" onClick={onClick} {...revealMotion}>
      <div className="news-card-image-wrapper">
        <img className="news-card-image" src={post.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
      </div>
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-category-badge">{post.category}</span>
          <span className="news-card-date">{post.date}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="news-card-link">
          Read more <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

function NewsModal({ post, onClose }) {
  useEffect(() => {
    document.body.classList.add('modal-open-state');
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.classList.remove('modal-open-state');
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="news-modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="news-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="news-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="news-modal-image-wrapper">
          <img className="news-modal-image" src={post.image} alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="news-modal-content">
          <div className="news-modal-header">
            <div className="news-modal-meta">
              <span className="news-category-badge">{post.category}</span>
              <span className="news-card-date">{post.date}</span>
            </div>
            <h2>{post.title}</h2>
          </div>
          <div className="news-modal-body">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const categories = ['All', ...Array.from(new Set(newsPosts.map((p) => p.category)))];
  const filtered = activeFilter === 'All' ? newsPosts : newsPosts.filter((p) => p.category === activeFilter);
  const copy = pageCopy.news;

  return (
    <PageShell
      page="news"
      side={
        <div className="signature-panel yellow">
          <Newspaper size={26} />
          <strong>{copy.signature_title}</strong>
          <span>{copy.signature_text}</span>
        </div>
      }
    >
      <div className="news-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`news-filter-btn ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="news-grid">
        {filtered.map((post) => (
          <NewsCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
        ))}
      </div>
      <AnimatePresence>
        {selectedPost && <NewsModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </AnimatePresence>
    </PageShell>
  );
}

function ServicesPage() {
  const copy = pageCopy.services;

  return (
    <PageShell
      page="services"
      side={
        <div className="signature-panel yellow">
          <Zap size={26} />
          <strong>{copy.signature_title}</strong>
          <span>{copy.signature_text}</span>
        </div>
      }
    >
      <motion.div className="process-grid" {...staggerContainer}>
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.article className="process-card" key={service.title} {...staggerItem} transition={{ ...staggerItem.transition, delay: index * 0.08 }}>
              <div className="process-card-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="process-card-header">
                <div className="process-card-icon">
                  <Icon size={24} />
                </div>
              </div>
              <div className="process-card-content">
                <span className="process-card-category">{service.category}</span>
                <h2>{service.title}</h2>
                <p>{service.detail}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
      <motion.div className="service-flow" {...fadeInScale}>
        {(copy.flow_steps || []).map((step, i) => (
          <motion.span key={step} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>{step}</motion.span>
        ))}
      </motion.div>
    </PageShell>
  );
}

function ProductsPage() {
  const copy = pageCopy.products;
  const [expandedProduct, setExpandedProduct] = useState(null);

  const toggleProduct = (productName) => {
    setExpandedProduct((current) => (current === productName ? null : productName));
  };

  return (
    <PageShell
      page="products"
      side={
        <div className="signature-panel">
          <Award size={26} />
          <strong>{copy.signature_title}</strong>
          <span>{copy.signature_text}</span>
        </div>
      }
    >
      <motion.div className="product-grid" {...staggerContainer}>
        {products.map((product, i) => {
          const isExpanded = expandedProduct === product.name;
          const hasDetails = Boolean(product.details);

          return (
            <motion.article
              className={`product-card product-card-detailed ${isExpanded ? 'is-expanded' : ''}`}
              key={product.name}
              role={hasDetails ? 'button' : undefined}
              tabIndex={hasDetails ? 0 : undefined}
              aria-expanded={hasDetails ? isExpanded : undefined}
              onClick={() => hasDetails && toggleProduct(product.name)}
              onKeyDown={(event) => {
                if (!hasDetails) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleProduct(product.name);
                }
              }}
              {...staggerItem}
              transition={{ ...staggerItem.transition, delay: i * 0.06 }}
            >
              <img src={product.image} alt="" aria-hidden="true" loading="lazy" />
              <div>
                <span>{product.category}</span>
                <h2>{product.name}</h2>
                <strong>{product.model}</strong>
              </div>
              <p>{product.use}</p>
              {hasDetails && (
                <>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.p
                        className="product-card-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        {product.details}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span className="product-card-toggle">{isExpanded ? 'Show less' : 'See more'}</span>
                </>
              )}
              <ul>
                {product.features.slice(0, 3).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="spec-strip">
                {product.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
      <motion.div className="assembly-band" {...fadeInScale}>
        <Factory size={28} />
        <div>
          <strong>{copy.assembly_title}</strong>
          <span>{copy.assembly_description}</span>
        </div>
      </motion.div>
    </PageShell>
  );
}


function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const formCopy = contactInfo.form || {};
  const needOptions = formCopy.need_options || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <PageShell
      page="contact"
      side={
        <div className="contact-stack">
          <div>
            <MapPin size={20} />
            <span>{contactInfo.address_short}</span>
          </div>
          <div>
            <Phone size={20} />
            <span>{contactInfo.primary_phone}</span>
          </div>
          <div>
            <Mail size={20} />
            <span>{contactInfo.primary_email}</span>
          </div>
        </div>
      }
    >
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            {formCopy.name_label}
            <input required placeholder={formCopy.name_placeholder} />
          </label>
          <label>
            {formCopy.phone_label}
            <input required placeholder={formCopy.phone_placeholder} type="tel" />
          </label>
        </div>
        <label>
          {formCopy.need_label}
          <select defaultValue={needOptions[0]}>
            {needOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          {formCopy.details_label}
          <textarea required rows="4" placeholder={formCopy.details_placeholder} />
        </label>
        <button className="btn btn-primary" type="submit">
          {submitted ? (
            <>
              <Check size={17} />
              {formCopy.sent_label}
            </>
          ) : (
            <>
              <Send size={17} />
              {formCopy.submit_label}
            </>
          )}
        </button>
      </form>
    </PageShell>
  );
}

const socialIconPaths = {
  Telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  Youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  TikTok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
};

function SocialIcon({ label }) {
  const path = socialIconPaths[label];
  if (!path) {
    return <Zap size={18} />;
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function Footer({ onNavigate }) {
  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container footer-inner">
        <div className="footer-columns">
          <motion.div className="footer-col about-col" {...slideFromLeft}>
            <div className="footer-brand">
              <img src={siteSettings.brand?.logo} alt="" aria-hidden="true" />
            </div>
            <h3>{footerContent.about_heading}</h3>
            <p>{footerContent.about_text}</p>
            <div className="social-icons">
              {socialLinks.map((link) => (
                <a href={link.url} target="_blank" rel="noreferrer" aria-label={link.label} key={link.label}>
                  <SocialIcon label={link.label} />
                </a>
              ))}
            </div>
          </motion.div>
          
          <motion.div className="footer-col links-col" {...revealMotion}>
            <h3>{footerContent.links_heading}</h3>
            <nav className="footer-links">
              {navItems.map((item) => (
                <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={() => onNavigate('contact')}>{footerContent.contact_nav_label}</button>
            </nav>
          </motion.div>

          <motion.div className="footer-col contact-col" {...slideFromRight}>
            <h3>{footerContent.contact_heading}</h3>
            <ul className="contact-list">
              <li>
                <Phone size={18} />
                <span>{contactInfo.phone_display}</span>
              </li>
              <li>
                <Mail size={18} />
                <span>
                  {splitLines(contactInfo.email_display).map((line, index) => (
                    <React.Fragment key={line}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </span>
              </li>
              <li>
                <MapPin size={18} />
                <span>
                  {splitLines(contactInfo.address_display).map((line, index) => (
                    <React.Fragment key={line}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>{footerContent.copyright_text}</p>
        </div>
      </div>
    </motion.footer>
  );
}

function renderPage(activePage, onNavigate) {
  switch (activePage) {
    case 'about':
      return <AboutPage />;
    case 'services':
      return <ServicesPage />;
    case 'products':
      return <ProductsPage />;

    case 'news':
      return <NewsPage />;
    case 'contact':
      return <ContactPage />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/DM154' || path === '/DM154/') {
      window.location.replace('/DM154/index.html');
      return;
    }

    const handleHashChange = () => setActivePage(getInitialPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page) => {
    setActivePage(page);
    window.history.pushState(null, '', `#${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header activePage={activePage} onNavigate={navigate} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} {...pageMotion}>
            {renderPage(activePage, navigate)}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
    </>
  );
}
