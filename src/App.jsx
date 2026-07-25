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

let siteSettings = siteData;
let homepage = homepageData;
let navItems = siteSettings.navigation || [];
let siteMedia = siteSettings.media || {};
let contactInfo = siteSettings.contact || {};
let footerContent = siteSettings.footer || {};
let socialLinks = siteSettings.social_links || [];

let routeIds = new Set([...navItems.map((item) => item.id), 'contact']);
const normalizeRoute = (target, fallback = 'home') => (routeIds.has(target) ? target : fallback);
const phoneHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
const splitLines = (value) => String(value || '').split('\n');

let metrics = metricsData.metrics.map((m) => [m.value, m.label]);

let highlights = (homepage.capabilities?.items || []).map((item) => ({
  ...item,
  icon: getIcon(item.icon),
}));

let services = servicesData.services.map((s) => ({
  ...s,
  icon: getIcon(s.icon),
}));

let products = productsData.products;

let featuredProducts = featuredData.featured.map((f) => ({
  ...f,
  icon: getIcon(f.icon),
}));

let partnerLogos = siteSettings.partner_logos || [];
let previousWorks = homepage.field_proof?.items || [];
let operatingModel = homepage.operating_model?.steps || [];

let coreValues = valuesData.values.map((v) => [v.title, v.description]);

let newsPosts = newsData.posts;

let partnerDetails = partnersData.partners.map((p) => [p.name, p.subtitle, p.description]);

let pageCopy = copyData;

let aboutTimeline = timelineData.timeline;

const imageLikeKeys = new Set(['image', 'logo', 'home_hero_image', 'page_hero_image']);

const assetFallbacks = {
  logo: '/images/meseret-solar-logo.webp',
  hero: '/images/hero-solar-field.png',
  product: '/images/product-solar-pump.png',
  home: '/images/product-home-kit.png',
  news: '/images/hero-solar-field.png',
  partner: '/images/meseret-solar-logo.webp',
  proof: '/images/proof-community-solar.png',
};

const knownBrokenAssetBasenames = new Set(['news-.png']);

const CANONICAL_ORIGIN = 'https://meseretmare.com';
const DEFAULT_SEO_IMAGE = `${CANONICAL_ORIGIN}/images/hero-solar-field.png`;

const SEO_META = {
  home: {
    title: 'Solar Products Importer in Ethiopia | Meseret Mare Gebre Solar',
    description:
      'Meseret Mare Gebre Solar imports and supports solar water pumps, solar home systems, portable lanterns, and off-grid solar solutions for farms, homes, NGOs, and rural communities in Ethiopia.',
    keywords:
      'solar products importer Ethiopia, solar company Ethiopia, solar solutions Ethiopia, off-grid solar Ethiopia, solar importer Addis Ababa, renewable energy Ethiopia, sustainable energy Ethiopia, rural solar solutions Ethiopia, GOGLA member Ethiopia solar, Lighting Global certified solar products Ethiopia, Meseret Mare, የፀሐይ ኃይል',
    hash: '',
  },
  about: {
    title: 'About Meseret Mare Gebre Solar | Off-Grid Solar Ethiopia',
    description:
      'Learn about Meseret Mare Gebre Solar, an Ethiopia-based solar products importer supporting rural electrification, Lighting Global certified products, GOGLA principles, farms, homes, and institutions.',
    keywords:
      'Meseret Mare Gebre, Meseret Mare Solar Importer, GOGLA member Ethiopia solar, Lighting Global certified solar products Ethiopia, off-grid solar Ethiopia, rural solar solutions Ethiopia, sustainable energy Ethiopia',
    hash: '#about',
  },
  services: {
    title: 'Solar Installation, Site Assessment & Maintenance in Ethiopia',
    description:
      'Solar site assessment, system design, installation, commissioning, monitoring, maintenance, training, and field support for solar pumps and off-grid solar systems in Ethiopia.',
    keywords:
      'solar system installation Ethiopia, solar site assessment Ethiopia, solar system design Ethiopia, solar commissioning Ethiopia, solar monitoring and maintenance Ethiopia, solar water pump installation Ethiopia, solar for agriculture Ethiopia',
    hash: '#services',
  },
  products: {
    title: 'Solar Water Pumps, Home Systems & Lanterns in Ethiopia',
    description:
      'Explore imported solar water pumps, Sun King and d.light solar home systems, portable solar lanterns, Difful and Redbud pump lines, solar phone chargers, and solar powered TV solutions for Ethiopia.',
    keywords:
      'solar water pump Ethiopia, solar pump importer Ethiopia, solar irrigation pump Ethiopia, submersible solar pump Ethiopia, surface solar pump Ethiopia, Difful solar pump Ethiopia, Redbud solar pump Ethiopia, solar home system Ethiopia, Sun King home system Ethiopia, d.light solar home system Ethiopia, portable solar lantern Ethiopia, solar lantern Addis Ababa, solar powered TV Ethiopia, የፀሐይ ውሃ ፓምፕ, የፀሐይ መብራት, የፀሐይ ቤት ሲስተም',
    hash: '#products',
  },
  news: {
    title: 'Solar Energy News & Field Updates from Ethiopia | Meseret Mare',
    description:
      'Field updates from Meseret Mare Gebre Solar, including solar pump exhibitions, Water and Energy Fair participation, rural distribution, training, and clean energy impact stories across Ethiopia.',
    keywords:
      'solar energy fair Ethiopia, Water and Energy Fair Ethiopia, mobile solar water pump Ethiopia, solar pump demonstration Ethiopia, rural solar distribution Ethiopia, solar training Ethiopia, off-grid solar villages Ethiopia',
    hash: '#news',
  },
  contact: {
    title: 'Request Solar Pump or Home System Quote in Ethiopia | Meseret Mare',
    description:
      'Contact Meseret Mare Gebre Solar in Addis Ababa for solar water pump pricing, solar home system recommendations, lantern inquiries, installation support, and NGO or institutional project requests.',
    keywords:
      'solar quote Ethiopia, solar pump price Ethiopia, solar water pump Addis Ababa, solar home system Addis Ababa, solar lantern Addis Ababa, solar importer Addis Ababa, community solar water supply Ethiopia, የፀሐይ ምርቶች ኢትዮጵያ',
    hash: '#contact',
  },
};

function getPageSeo(page) {
  return SEO_META[page] || SEO_META.home;
}

function setMetaTag(selector, attribute, value) {
  const node = document.head.querySelector(selector);
  if (node && value) {
    node.setAttribute(attribute, value);
  }
}

function applyPageSeo(page) {
  const seo = getPageSeo(page);
  const url = `${CANONICAL_ORIGIN}/${seo.hash || ''}`;

  document.title = seo.title;
  setMetaTag('meta[name="description"]', 'content', seo.description);
  setMetaTag('meta[name="keywords"]', 'content', seo.keywords);
  setMetaTag('link[rel="canonical"]', 'href', url);
  setMetaTag('meta[property="og:title"]', 'content', seo.title);
  setMetaTag('meta[property="og:description"]', 'content', seo.description);
  setMetaTag('meta[property="og:url"]', 'content', url);
  setMetaTag('meta[property="og:image"]', 'content', DEFAULT_SEO_IMAGE);
  setMetaTag('meta[name="twitter:title"]', 'content', seo.title);
  setMetaTag('meta[name="twitter:description"]', 'content', seo.description);
  setMetaTag('meta[name="twitter:image"]', 'content', DEFAULT_SEO_IMAGE);
}

function getProductSeoAlt(product) {
  const category = String(product?.category || 'solar product').toLowerCase();
  const name = String(product?.name || 'Meseret Mare solar product').replace(/\s+/g, ' ').trim();
  if (category.includes('pump')) {
    return `${name} solar water pump for irrigation, wells, and off-grid water supply in Ethiopia`;
  }
  if (category.includes('home')) {
    return `${name} solar home system for lighting, phone charging, and off-grid homes in Ethiopia`;
  }
  if (category.includes('lighting')) {
    return `${name} portable solar lantern for homes and off-grid villages in Ethiopia`;
  }
  if (category.includes('appliance')) {
    return `${name} solar appliance for off-grid homes and institutions in Ethiopia`;
  }
  return `${name} ${category} imported solar product for Ethiopia`;
}

function getAssetBasename(value) {
  const source = String(value || '').trim().replace(/\\/g, '/');
  if (!source) return '';
  const withoutQuery = source.split('?')[0].split('#')[0];
  return withoutQuery.slice(withoutQuery.lastIndexOf('/') + 1).toLowerCase();
}

function isKnownBrokenAssetPath(value) {
  return knownBrokenAssetBasenames.has(getAssetBasename(value));
}

function wrapPlaceholderText(value, lineLength = 18, maxLines = 3) {
  const words = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  if (!words.length) {
    return ['Meseret Mare Solar'];
  }

  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= lineLength || currentLine === '') {
      currentLine = nextLine;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createTextPlaceholder(title, subtitle = '', accent = '#1c8a3f') {
  const lines = wrapPlaceholderText(title);
  const lineMarkup = lines
    .map(
      (line, index) =>
        `<text x="32" y="${164 + index * 34}" font-family="Outfit,Segoe UI,sans-serif" font-size="28" font-weight="700" fill="#05210d">${escapeXml(line)}</text>`
    )
    .join('');

  const safeTitle = escapeXml(title || 'Meseret Mare Solar');
  const safeSubtitle = escapeXml(subtitle || 'Meseret Mare Solar');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fcfff6" />
          <stop offset="100%" stop-color="#dff8cb" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#f5c518" />
        </linearGradient>
      </defs>
      <rect width="900" height="640" rx="36" fill="url(#bg)" />
      <circle cx="748" cy="128" r="118" fill="rgba(245,197,24,0.20)" />
      <circle cx="144" cy="528" r="158" fill="rgba(157,243,110,0.30)" />
      <rect x="32" y="32" width="240" height="42" rx="21" fill="url(#accent)" />
      <text x="56" y="60" font-family="Inter,Segoe UI,sans-serif" font-size="20" font-weight="700" fill="#ffffff">${safeSubtitle}</text>
      <rect x="32" y="112" width="836" height="420" rx="28" fill="#ffffff" fill-opacity="0.72" stroke="rgba(28,138,63,0.12)" />
      ${lineMarkup}
      <text x="32" y="584" font-family="Inter,Segoe UI,sans-serif" font-size="22" font-weight="600" fill="#476154">Professional solar solutions for Ethiopia</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeAssetPath(value, fallback = '') {
  const source = String(value || '').trim().replace(/\\/g, '/');
  if (!source) return fallback;
  if (/^(https?:)?\/\//i.test(source) || source.startsWith('data:')) {
    return source;
  }
  if (source.startsWith('/')) {
    const normalized = source.replace(/\/{2,}/g, '/');
    if (typeof window === 'undefined') {
      return normalized;
    }

    const basePath = getRuntimeBasePath();
    if (basePath !== '/' && /^\/(?:images|uploads|partners|api)\//.test(normalized)) {
      return `${basePath.replace(/\/$/, '')}${normalized}`.replace(/\/{2,}/g, '/');
    }

    return normalized;
  }
  if (typeof window === 'undefined') {
    return `/${source.replace(/^\.?\//, '')}`.replace(/\/{2,}/g, '/');
  }

  return new URL(source.replace(/^\.?\//, ''), document.baseURI || window.location.href).toString();
}

function looksMojibake(value) {
  return /(?:Ã.|Â.|â.|á.)/.test(value);
}

function repairText(value) {
  if (!looksMojibake(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value, (char) => char.charCodeAt(0) & 0xff));
    const repaired = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return repaired && !repaired.includes('\ufffd') ? repaired : value;
  } catch {
    return value;
  }
}

function summarizeText(value, maxLength = 170) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return 'Designed for dependable off-grid solar deployment.';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sentenceMatch = normalized.match(/^(.{1,170}?[.!?])(?:\s|$)/);
  if (sentenceMatch?.[1]) {
    return sentenceMatch[1].trim();
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function getProductIdentity(product, fallbackIndex = 0) {
  return [
    product?.id,
    product?.name,
    product?.model,
    product?.category,
    fallbackIndex,
  ]
    .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
    .map((value) => String(value).trim())
    .join('::');
}

function normalizeContent(value, key = '') {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeContent(item, key));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [entryKey, normalizeContent(entryValue, entryKey)])
    );
  }

  if (typeof value === 'string') {
    const repaired = repairText(value).trim();
    if (imageLikeKeys.has(key)) {
      return normalizeAssetPath(repaired);
    }
    return repaired;
  }

  return value;
}

function productFallbackImage(category) {
  return category === 'Solar Home Systems' || category === 'Solar Appliances'
    ? assetFallbacks.home
    : assetFallbacks.product;
}

function withReferenceMedia(items, referenceItems, keyField) {
  const referenceMap = new Map(
    (referenceItems || []).map((item) => [String(item?.[keyField] || '').trim().toLowerCase(), item])
  );

  return (items || []).map((item) => {
    const key = String(item?.[keyField] || '').trim().toLowerCase();
    const reference = referenceMap.get(key);

    return {
      ...reference,
      ...item,
      image: item?.image || reference?.image || '',
    };
  });
}

function SmartImage({ src, alt, fallback, ...props }) {
  const resolvedFallback = normalizeAssetPath(fallback || assetFallbacks.product);
  const [currentSrc, setCurrentSrc] = useState(() =>
    isKnownBrokenAssetPath(src) ? resolvedFallback : normalizeAssetPath(src, resolvedFallback)
  );

  useEffect(() => {
    setCurrentSrc(isKnownBrokenAssetPath(src) ? resolvedFallback : normalizeAssetPath(src, resolvedFallback));
  }, [src, resolvedFallback]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== resolvedFallback) {
          setCurrentSrc(resolvedFallback);
        }
      }}
    />
  );
}

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

function getRuntimeBasePath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  const baseUrl = new URL(document.baseURI || window.location.href);
  return baseUrl.pathname.endsWith('/') ? baseUrl.pathname : baseUrl.pathname.replace(/[^/]+$/, '');
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
            <SmartImage src={siteSettings.brand?.logo} fallback={assetFallbacks.logo} alt="" />
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
          <SmartImage
            src={partner.logo}
            fallback={assetFallbacks.partner}
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
        style={{ '--hero-bg': `url(${normalizeAssetPath(siteMedia.home_hero_image, assetFallbacks.hero)})` }}
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
                <SmartImage src={item.image} fallback={productFallbackImage(item.title)} alt={`${item.title} for solar energy use in Ethiopia`} loading="lazy" />
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
              <SmartImage src={item.image} fallback={assetFallbacks.proof} alt={`${item.title} solar field work and off-grid energy impact in Ethiopia`} loading="lazy" referrerPolicy="no-referrer" />
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
        style={{ '--hero-bg': `url(${normalizeAssetPath(siteMedia.page_hero_image, assetFallbacks.hero)})` }}
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
        className={`container page-content ${page}-page-content`}
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
  const summary = post.excerpt || post.content?.[0] || 'Open to view the full update.';
  const fallback = createTextPlaceholder(post.title, post.category || 'Meseret Mare Solar', '#0f5c2a');

  return (
    <motion.article className="news-card" onClick={onClick} {...revealMotion}>
      <div className="news-card-image-wrapper">
        <SmartImage className="news-card-image" src={post.image} fallback={fallback} alt={post.title} loading="lazy" referrerPolicy="no-referrer" />
      </div>
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-category-badge">{post.category}</span>
          <span className="news-card-date">{post.date}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{summary}</p>
        <span className="news-card-link">
          Read more <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

function NewsModal({ post, onClose }) {
  const fallback = createTextPlaceholder(post.title, post.category || 'Meseret Mare Solar', '#0f5c2a');

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
          <SmartImage className="news-modal-image" src={post.image} fallback={fallback} alt={post.title} referrerPolicy="no-referrer" />
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
            {(post.content?.length ? post.content : [post.excerpt || '']).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MapModal({ address, onClose }) {
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
        className="news-modal map-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '24px', maxWidth: '800px', width: '90%', display: 'flex', flexDirection: 'column' }}
      >
        <button className="news-modal-close" onClick={onClose} aria-label="Close" style={{ right: '16px', top: '16px' }}>
          <X size={20} />
        </button>
        <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginTop: '12px' }}>
          <iframe
            title="Map Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(address || 'Ethiopia')}&output=embed`}
          ></iframe>
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
  const [activeCategory, setActiveCategory] = useState('All Products');
  const categories = ['All Products', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const filteredProducts = activeCategory === 'All Products'
    ? products
    : products.filter((product) => product.category === activeCategory);

  const toggleProduct = (productId) => {
    setExpandedProduct((current) => (current === productId ? null : productId));
  };

  const selectCategory = (category) => {
    setActiveCategory(category);
    setExpandedProduct(null);
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
      <div className="product-filter-bar" aria-label="Product categories">
        {categories.map((category) => (
          <button
            className={`product-filter-btn ${activeCategory === category ? 'active' : ''}`}
            key={category}
            type="button"
            onClick={() => selectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <motion.div className="product-grid" {...staggerContainer}>
        {filteredProducts.map((product, i) => {
          const productId = getProductIdentity(product, i);
          const isExpanded = expandedProduct === productId;
          const detailText = String(product.details || '').trim();
          const compactSummary = summarizeText(product.use || detailText, 96);
          const hasDetails = Boolean(detailText) && detailText !== compactSummary;
          const features = Array.isArray(product.features) ? product.features : [];
          const specs = Array.isArray(product.specs) ? product.specs : [];
          const featurePreview = isExpanded ? features : [];
          const specPreview = isExpanded ? specs : [];
          const fallbackImage = createTextPlaceholder(product.name, 'Meseret Mare Solar');
          const shouldShowToggle = Boolean(detailText || features.length || specs.length);
          const collapsedMeta = [
            product.model ? `Model ${product.model}` : '',
            features.length ? `${features.length} feature${features.length === 1 ? '' : 's'}` : '',
            specs.length ? `${specs.length} spec${specs.length === 1 ? '' : 's'}` : '',
          ].filter(Boolean);

          return (
            <motion.article
              className={`product-card product-card-detailed ${isExpanded ? 'is-expanded' : ''}`}
              key={productId}
              {...staggerItem}
              transition={{ ...staggerItem.transition, delay: i * 0.06 }}
            >
              <div className="product-card-media">
                <span className="product-card-category">{product.category}</span>
                <div className="product-card-media-shell">
                  <SmartImage src={product.image} fallback={fallbackImage} alt={getProductSeoAlt(product)} loading="lazy" />
                </div>
                <div className="product-card-media-caption">
                  <strong>{product.name}</strong>
                  {collapsedMeta.length ? <span>{collapsedMeta.join(' - ')}</span> : null}
                </div>
              </div>
              <div className="product-card-body">
                <p className={`product-card-summary ${isExpanded ? 'is-expanded' : ''}`}>{compactSummary}</p>
                {isExpanded && featurePreview.length ? (
                  <ul className="product-card-features">
                    {featurePreview.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                ) : null}
                {isExpanded && specPreview.length ? (
                  <div className="spec-strip">
                    {specPreview.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              {shouldShowToggle && (
                <div className="product-card-expand">
                  <AnimatePresence initial={false}>
                    {isExpanded && hasDetails && (
                      <motion.div
                        className="product-card-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <p>{detailText}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    className="product-card-toggle"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => toggleProduct(productId)}
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              )}
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
  const formCopy = contactInfo.form || {};
  const needOptions = formCopy.need_options || [];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    need: needOptions[0] || '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrorMessage('');

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'inquiry@meseretmare.com',
      subject: `Solar Inquiry: ${formData.need}`,
      message: `Interest: ${formData.need}\n\nDetails: ${formData.message}`,
    };

    try {
      const response = await fetch('/DM154/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', phone: '', need: needOptions[0] || '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 6000);
      } else {
        setErrorMessage(result.error || result.message || 'Submission failed. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <input
              name="name"
              required
              placeholder={formCopy.name_placeholder}
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            {formCopy.phone_label}
            <input
              name="phone"
              required
              placeholder={formCopy.phone_placeholder}
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          {formCopy.need_label}
          <select name="need" value={formData.need} onChange={handleChange}>
            {needOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          {formCopy.details_label}
          <textarea
            name="message"
            required
            rows="4"
            placeholder={formCopy.details_placeholder}
            value={formData.message}
            onChange={handleChange}
          />
        </label>

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={18} /> Your inquiry has been sent! We'll contact you within 24 hours.
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting || submitSuccess}
          style={{ opacity: (isSubmitting || submitSuccess) ? 0.75 : 1, cursor: (isSubmitting || submitSuccess) ? 'not-allowed' : 'pointer' }}
        >
          {submitSuccess ? (
            <>
              <Check size={17} />
              {formCopy.sent_label || 'Sent!'}
            </>
          ) : isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send size={17} />
              {formCopy.submit_label || 'Send request'}
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
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <>
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
                <SmartImage src={siteSettings.brand?.logo} fallback={assetFallbacks.logo} alt="" aria-hidden="true" />
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
                  <a href={`tel:${contactInfo.primary_phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <span>{contactInfo.phone_display}</span>
                  </a>
                </li>
                <li>
                  <Mail size={18} />
                  <a href={`mailto:${contactInfo.primary_email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <span>
                      {splitLines(contactInfo.email_display).map((line, index) => (
                        <React.Fragment key={line}>
                          {index > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </span>
                  </a>
                </li>
                <li>
                  <MapPin size={18} />
                  <button type="button" onClick={() => setIsMapOpen(true)} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                    <span>
                      {splitLines(contactInfo.address_display).map((line, index) => (
                        <React.Fragment key={line}>
                          {index > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </span>
                  </button>
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

      <AnimatePresence>
        {isMapOpen && <MapModal address={contactInfo.address_short || contactInfo.address_display} onClose={() => setIsMapOpen(false)} />}
      </AnimatePresence>
    </>
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
    applyPageSeo(activePage);
  }, [activePage]);

  useEffect(() => {
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
