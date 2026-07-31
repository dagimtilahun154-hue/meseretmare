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
  Handshake,
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
  Handshake,
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

const routeIds = new Set(['home', 'about', 'services', 'products', 'partners', 'news', 'contact']);
const normalizeRoute = (target, fallback = 'home') => (routeIds.has(target) ? target : fallback);
const phoneHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
const splitLines = (value) => String(value || '').split('\n');

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
    path: '/',
  },
  about: {
    title: 'About Meseret Mare Gebre Solar | Off-Grid Solar Ethiopia',
    description:
      'Learn about Meseret Mare Gebre Solar, an Ethiopia-based solar products importer supporting rural electrification, Lighting Global certified products, GOGLA principles, farms, homes, and institutions.',
    keywords:
      'Meseret Mare Gebre, Meseret Mare Solar Importer, GOGLA member Ethiopia solar, Lighting Global certified solar products Ethiopia, off-grid solar Ethiopia, rural solar solutions Ethiopia, sustainable energy Ethiopia',
    path: '/about',
  },
  services: {
    title: 'Solar Installation, Site Assessment & Maintenance in Ethiopia',
    description:
      'Solar site assessment, system design, installation, commissioning, monitoring, maintenance, training, and field support for solar pumps and off-grid solar systems in Ethiopia.',
    keywords:
      'solar system installation Ethiopia, solar site assessment Ethiopia, solar system design Ethiopia, solar commissioning Ethiopia, solar monitoring and maintenance Ethiopia, solar water pump installation Ethiopia, solar for agriculture Ethiopia',
    path: '/services',
  },
  products: {
    title: 'Solar Water Pumps, Home Systems & Lanterns in Ethiopia',
    description:
      'Explore imported solar water pumps, Sun King and d.light solar home systems, portable solar lanterns, Difful and Redbud pump lines, solar phone chargers, and solar powered TV solutions for Ethiopia.',
    keywords:
      'solar water pump Ethiopia, solar pump importer Ethiopia, solar irrigation pump Ethiopia, submersible solar pump Ethiopia, surface solar pump Ethiopia, Difful solar pump Ethiopia, Redbud solar pump Ethiopia, solar home system Ethiopia, Sun King home system Ethiopia, d.light solar home system Ethiopia, portable solar lantern Ethiopia, solar lantern Addis Ababa, solar powered TV Ethiopia, የፀሐይ ውሃ ፓምፕ, የፀሐይ መብራት, የፀሐይ ቤት ሲስተም',
    path: '/products',
  },
  partners: {
    title: 'Key Partners & Stakeholders | Meseret Mare Solar Ethiopia',
    description:
      'Discover the institutional partners, development banks, international NGOs, Ministry of Water & Energy, CARE International, GIZ, and GOGLA network collaborating with Meseret Mare Solar in Ethiopia.',
    keywords:
      'Meseret Mare partners, Development Bank of Ethiopia solar loans, DBE solar credit line importer Ethiopia, CARE International Ethiopia solar partner, Ministry of Water and Energy solar company Ethiopia, GIZ Ethiopia solar partner, GOGLA solar association member Ethiopia, ASDEPO solar partner, Winrock International solar partner, Purpose Black solar partner, Addis Ababa University solar partner, NGO solar project supplier Ethiopia, World Bank off-grid solar Ethiopia',
    path: '/partners',
  },
  news: {
    title: 'Solar Energy News & Field Updates from Ethiopia | Meseret Mare',
    description:
      'Field updates from Meseret Mare Gebre Solar, including solar pump exhibitions, Water and Energy Fair participation, rural distribution, training, and clean energy impact stories across Ethiopia.',
    keywords:
      'solar energy fair Ethiopia, Water and Energy Fair Ethiopia, mobile solar water pump Ethiopia, solar pump demonstration Ethiopia, rural solar distribution Ethiopia, solar training Ethiopia, off-grid solar villages Ethiopia',
    path: '/news',
  },
  contact: {
    title: 'Request Solar Pump or Home System Quote in Ethiopia | Meseret Mare',
    description:
      'Contact Meseret Mare Gebre Solar in Addis Ababa for solar water pump pricing, solar home system recommendations, lantern inquiries, installation support, and NGO or institutional project requests.',
    keywords:
      'solar quote Ethiopia, solar pump price Ethiopia, solar water pump Addis Ababa, solar home system Addis Ababa, solar lantern Addis Ababa, solar importer Addis Ababa, community solar water supply Ethiopia, የፀሐይ ምርቶች ኢትዮጵያ',
    path: '/contact',
  },
};

const SEO_META_AM = {
  home: {
    title: 'መሰረት ማሬ ገብሬ የፀሐይ ኃይል | በኢትዮጵያ ምርጡ የሶላር ምርቶች አስመጪ፣ ገጣጣሚ እና ተካይ',
    description: 'መሰረት ማሬ ገብሬ የፀሐይ ኃይል በኢትዮጵያ ምርጡ የሶላር ምርቶች አስመጪ፣ ሀገር በቀል ገጣጣሚ እና ተካይ ነው። ምርጡን የውስጥ (መጠቅለያ) እና የውጭ የሶላር ውሃ ፓምፖች በኢትዮጵያ፣ የቤት ሲስተሞች እና የመስክ ተከላ አገልግሎት እንሰጣለን።',
    keywords: 'መሰረት ማሬ ገብሬ, መሰረት ማሬ የፀሐይ ኃይል, መሰረት ማሬ ሶላር አዲስ አበባ, መሰረት ማሬ ሶላር ቢሾፍቱ, መሰረት ማሬ ሶላር አዲሱ ገበያ, በኢትዮጵያ ምርጡ የሶላር ድርጅት, በኢትዮጵያ ምርጡ የሶላር ውሃ ፓምፕ አስመጪ, በኢትዮጵያ ምርጡ የውስጥ ሶላር ፓምፕ, በኢትዮጵያ ምርጡ የውጭ ሶላር ፓምፕ, በኢትዮጵያ ምርጡ የሶላር ተከላ, በኢትዮጵያ ምርጡ የሶላር ገጣጣሚ, የፀሐይ ኃይል በኢትዮጵያ, የፀሐይ ውሃ ፓምፕ በኢትዮጵያ, የውስጥ ሶላር ፓምፕ በኢትዮጵያ, የውጭ ሶላር ፓምፕ በኢትዮጵያ, የቦርሆል ሶላር ፓምፕ በኢትዮጵያ, የእርሻ መስኖ ሶላር ፓምፕ በኢትዮጵያ, የፀሐይ መብራት በኢትዮጵያ, የፀሐይ ቤት ሲስተም በኢትዮጵያ, የሶላር ፓነል ዋጋ በኢትዮጵያ, የሶላር ውሃ ፓምፕ ዋጋ በኢትዮጵያ, መሰረት ማሬ የፀሐይ ኃይል በኢትዮጵያ, የልማት ባንክ ሶላር በኢትዮጵያ, የሶላር ውሃ ፓምፕ አቅራቢዎች በኢትዮጵያ, የሶላር መብራቶች ዋጋ በአዲስ አበባ, የሶላር ሱቅ አዲሱ ገበያ አዲስ አበባ, የሶላር ቢሮ ቢሾፍቱ',
    path: '/',
  },
  about: {
    title: 'ስለ መሰረት ማሬ ገብሬ የፀሐይ ኃይል | በኢትዮጵያ ታዋቂው አስመጪ፣ ገጣጣሚ እና የአጋሮች መረብ',
    description: 'መሰረት ማሬ ገብሬ የፀሐይ ኃይል በኢትዮጵያ ምርጡ የገጠር አካባቢዎችን በሶላር ለማብራት፣ ለማገዝ እና የሶላር ፓምፖችን ለመገጠም የሚሰራ ታማኝ ድርጅት ነው።',
    keywords: 'መሰረት ማሬ ገብሬ, ስለ መሰረት ማሬ በኢትዮጵያ, በኢትዮጵያ ምርጡ የሶላር ድርጅት, የገጠር መብራት በኢትዮጵያ, ልማት ባንክ ሶላር በኢትዮጵያ, በላይቲንግ ግሎባል የተረጋገጡ ምርቶች በኢትዮጵያ, የፀሐይ ኃይል አስመጪ በኢትዮጵያ, የሶላር ገጣጣሚ በኢትዮጵያ, የኢትዮጵያ ሶላር ማህበር አባል, ኬር ኢንተርናሽናል ሶላር አጋር, ጂ አይ ዜድ ሶላር አጋር',
    path: '/about',
  },
  services: {
    title: 'የሶላር ፓምፕ ተከላ፣ ሳይት ግምገማ እና ጥገና በኢትዮጵያ | መሰረት ማሬ ገብሬ',
    description: 'ስለ የውስጥ እና የውጭ የፀሐይ ውሃ ፓምፕ ተከላ በኢትዮጵያ፣ የቦታ የውሃ መጠን ግምገማ፣ የሲስተም ዲዛይን፣ ስልጠና እና የረጅም ጊዜ የጥገና አገልግሎት በአዲስ አበባ።',
    keywords: 'የሶላር ተከላ በኢትዮጵያ, በኢትዮጵያ ምርጡ የሶላር ተከላ, ሳይት ግምገማ በኢትዮጵያ, የፓምፕ ጥገና በኢትዮጵያ, የፀሐይ ኃይል ቦታ ፍተሻ በኢትዮጵያ, የእርሻ መስኖ በኢትዮጵያ, የሶላር ፓምፕ ጥገና በአዲስ አበባ, የሶላር ውሃ ፓምፕ ተከላ በኢትዮጵያ, የውሃ መጠን ፍተሻ በኢትዮጵያ, የሶላር መሃንዲስ አዲስ አበባ',
    path: '/services',
  },
  products: {
    title: 'የውስጥ እና የውጭ የፀሐይ ውሃ ፓምፖች፣ የቤት ሲስተሞች እና መብራቶች በኢትዮጵያ | መሰረት ማሬ',
    description: 'የሳን ኪንግ እና ዲ.ላይት የፀሐይ የቤት ሲስተሞች በኢትዮጵያ፣ የዲሲ ሶላር ቲቪ እና ምርጡ የውስጥና የውጭ የፀሐይ ውሃ ፓምፖች በኢትዮጵያ ዝርዝር መረጃ።',
    keywords: 'በኢትዮጵያ ምርጡ የሶላር ውሃ ፓምፕ, በኢትዮጵያ ምርጡ የውስጥ ሶላር ፓምፕ, በኢትዮጵያ ምርጡ የውጭ ሶላር ፓምፕ, የሳን ኪንግ የቤት ሲስተም በኢትዮጵያ, ዲ.ላይት መብራቶች በኢትዮጵያ, የዲሲ ሶላር ቲቪ በኢትዮጵያ, ዲፉል የሶላር ፓምፕ በኢትዮጵያ, ሬድበድ የሶላር ፓምፕ በኢትዮጵያ, በላይቲንግ ግሎባል የተረጋገጡ መብራቶች በኢትዮጵያ, የሶላር ፓነል 100W 200W 300W 450W, የሶላር ፋን በኢትዮጵያ',
    path: '/products',
  },
  partners: {
    title: 'አጋር ድርጅቶች እና ባለድርሻ አካላት በኢትዮጵያ | መሰረት ማሬ ሶላር',
    description: 'ከመንግስት ሚኒስቴሮች፣ ከልማት ባንኮች፣ ከኬር ኢንተርናሽናል፣ ከጂ አይ ዜድ እና ከሌሎች ተራዳይ ድርጅቶች ጋር በኢትዮጵያ ያለን ጠንካራ አጋርነት።',
    keywords: 'የልማት ባንክ ሶላር ብድር በኢትዮጵያ, ኬር ኢንተርናሽናል በኢትዮጵያ, የውሃ እና ኢነርጂ ሚኒስቴር በኢትዮጵያ, ጂ አይ ዜድ በኢትዮጵያ, መሰረት ማሬ አጋሮች በኢትዮጵያ, መንግስታዊ ያልሆኑ ድርጅቶች በኢትዮጵያ, የኢትዮጵያ ሶላር ማህበር, የግሎባል ሶላር ማህበር አባል',
    path: '/partners',
  },
  news: {
    title: 'የሶላር ኢነርጂ ዜናዎች፣ የመስክ አውደ ርዕዮች እና ገጣጣሚ መረጃዎች በኢትዮጵያ | መሰረት ማሬ',
    description: 'በኢትዮጵያ የተለያዩ ክልሎች የተከናወኑ የመስክ ስራዎች፣ የሶላር አውደ ርዕይ ተሳትፎዎች፣ የአካባቢ ገጣጣሚ ዝግጅቶች እና ማህበረሰባዊ ታሪኮች።',
    keywords: 'የሶላር አውደ ርዕይ በኢትዮጵያ, የውሃ እና ኢነርጂ ፌስቲቫል በኢትዮጵያ, የመስክ ስራዎች በኢትዮጵያ, የገጠር ሶላር በኢትዮጵያ, የሶላር ገጣጣሚ በኢትዮጵያ, የደብረዘይት ሶላር አውደ ርዕይ, የቅርብ ዜናዎች በኢትዮጵያ',
    path: '/news',
  },
  contact: {
    title: 'የዋጋ መጠየቂያ እና ተከላ በኢትዮጵያ ያግኙን | መሰረት ማሬ ገብሬ የፀሐይ ኃይል',
    description: 'በአዲስ አበባ እና በቢሾፍቱ ያሉ የአገልግሎት መስጫ ቢሮዎቻችንን አድራሻ እና ስልክ ያግኙ፣ በኢትዮጵያ ምርጡን የሶላር ውሃ ፓምፕ ተከላ እና የዋጋ ማቅረቢያ ይጠይቁ።',
    keywords: 'መሰረት ማሬ ስልክ ቁጥር, መሰረት ማሬ አድራሻ አዲስ አበባ, መሰረት ማሬ ቢሮ ቢሾፍቱ, ያግኙን በኢትዮጵያ, የዋጋ መጠየቂያ በኢትዮጵያ, የሶላር ዋጋ በኢትዮጵያ, የፀሐይ ውሃ ፓምፕ ተከላ ዋጋ በኢትዮጵያ, የሶላር ተከላ አዲስ አበባ አዲሱ ገበያ',
    path: '/contact',
  },
};

function getPageSeo(page, lang) {
  const isAm = lang === 'am';
  const source = isAm ? SEO_META_AM : SEO_META;
  return source[page] || source.home;
}

function setMetaTag(selector, attribute, value) {
  const node = document.head.querySelector(selector);
  if (node && value) {
    node.setAttribute(attribute, value);
  }
}

function applyPageSeo(page, lang) {
  const seo = getPageSeo(page, lang);
  const pagePath = seo.path !== undefined ? seo.path : (seo.hash ? seo.hash.replace('#', '/') : `/${page}`);
  const url = `${CANONICAL_ORIGIN}${pagePath === '/' ? '' : pagePath}`;

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
  const displayTitle = (title || '').length > 45 ? `${(title || '').slice(0, 42)}...` : title;
  const lines = wrapPlaceholderText(displayTitle);
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
  let source = String(value || '').trim().replace(/\\/g, '/');
  if (!source) return fallback;

  if (source.startsWith('/react-app/public')) {
    source = source.replace('/react-app/public', '');
  }

  if (/^(https?:)?\/\//i.test(source) || source.startsWith('data:')) {
    return source;
  }

  if (source.startsWith('DM154/uploads/')) {
    source = '/' + source;
  } else if (source.startsWith('uploads/')) {
    source = '/' + source;
  } else if (source.startsWith('images/')) {
    source = '/' + source;
  }

  if (source.startsWith('/')) {
    return source.replace(/\/{2,}/g, '/');
  }

  return `/${source.replace(/^\.?\//, '')}`.replace(/\/{2,}/g, '/');
}

function cleanProductName(name) {
  let title = String(name || '').trim();
  if (!title) return 'Solar Product';

  if (/solar pump factory outlet/i.test(title) || /4inch solar powered pump for irrigation/i.test(title)) {
    return '4-Inch Solar Submersible Pump';
  }
  if (/3 inch Screw solar bore pump/i.test(title) || /bore pump for household water supply/i.test(title)) {
    return '3-Inch Screw Solar Bore Pump';
  }
  if (/centrifugal surface pump with solar power/i.test(title)) {
    return 'DC 72V Centrifugal Surface Solar Pump';
  }
  if (/3 inch 1hp DC brushless solar pump/i.test(title) || /solar water pump for well/i.test(title)) {
    return '3-Inch 1HP DC Solar Pump';
  }
  if (/DC peripheral surface solar pump/i.test(title) || /750W vortex solar pump/i.test(title)) {
    return '750W Peripheral Vortex Solar Pump';
  }
  if (/6000 rpm high speed deep well pump/i.test(title)) {
    return 'High-Speed Deep Well Solar Pump (6000 RPM)';
  }
  if (/DIFFUL 6000 rpm high speed deep well pump/i.test(title)) {
    return 'AC/DC Stainless Steel Solar Well Pump';
  }
  if (/DIFFUL 20m3\/h flow high speed/i.test(title)) {
    return 'High-Flow Deep Well Solar Pump (20m³/h)';
  }
  if (/DIFFUL high speed deep well pump/i.test(title)) {
    return 'High-Flow Deep Well Solar Pump (32m³/h)';
  }

  if (title.length > 55) {
    title = title
      .replace(/\s+(factory outlet|price|for sale|solar pump sales|recruit dealers|water pump manufacturer).*/i, '')
      .replace(/\s+solar powered pump for household water supply.*/i, '')
      .replace(/\s+plastic impeller.*/i, '');
  }

  return title;
}

function getRuntimeBasePath() {
  return '/';
}

function getApiUrl(endpoint) {
  const cleanEndpoint = String(endpoint || '').replace(/^\//, '');
  return `/DM154/api/${cleanEndpoint}`.replace(/\/{2,}/g, '/');
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
      decoding="async"
      loading="lazy"
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
  viewport: { once: true, amount: 0 },
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
  const path = window.location.pathname;
  // Extract the last segment of the path (e.g. /about -> 'about', /about/ -> 'about')
  const segment = path.replace(/\/+$/, '').split('/').pop();
  const validPages = ['home', 'about', 'services', 'products', 'partners', 'news', 'contact'];
  return validPages.includes(segment) ? segment : 'home';
}

function Header({ activePage, onNavigate, brand, lang, onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

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

  const navItems = lang === 'en' ? [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'partners', label: 'Partners' },
    { id: 'news', label: 'News' }
  ] : [
    { id: 'home', label: 'ዋና ገጽ' },
    { id: 'about', label: 'ስለ እኛ' },
    { id: 'services', label: 'አገልግሎቶች' },
    { id: 'products', label: 'ምርቶች' },
    { id: 'partners', label: 'አጋሮች' },
    { id: 'news', label: 'ዜናዎች' }
  ];

  return (
    <header className={`site-header ${overHero && !open ? 'is-hero-mode' : 'is-floating'} ${open ? 'menu-open' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="brand-mark" aria-hidden="true">
            <SmartImage src={brand.logo} fallback={assetFallbacks.logo} alt="" />
          </span>
          <span>
            <span className="brand-name">{brand.name}</span>
            <span className="brand-subtitle">{brand.subtitle}</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={activePage === item.id ? 'active' : ''}
              key={item.id}
              href={item.id === 'home' ? '/' : `/${item.id}`}
              onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* Neomorphic Language Toggler */}
          <button 
            className="lang-switcher" 
            type="button" 
            onClick={() => onLanguageChange(lang === 'en' ? 'am' : 'en')}
            style={{
              minHeight: '34px',
              padding: '0 14px',
              background: 'var(--mint-100)',
              border: '1px solid rgba(255, 255, 255, 0.68)',
              borderRadius: '999px',
              color: 'var(--green-950)',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-soft)',
              transition: 'all 180ms ease',
              marginRight: '4px'
            }}
          >
            {lang === 'en' ? 'አማ' : 'En'}
          </button>

          <a className="btn btn-primary btn-sm" href="/contact" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}>
            {lang === 'en' ? 'Contact us' : 'ያግኙን'}
          </a>
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
              <a
                className={activePage === item.id ? 'active' : ''}
                key={item.id}
                href={item.id === 'home' ? '/' : `/${item.id}`}
                onClick={(e) => { e.preventDefault(); handleNavigate(item.id); }}
              >
                {item.label}
                <ChevronRight size={16} />
              </a>
            ))}
            <a
              className={activePage === 'contact' ? 'active' : ''}
              href="/contact"
              onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
            >
              {lang === 'en' ? 'Contact us' : 'ያግኙን'}
              <ChevronRight size={16} />
            </a>

            {/* Mobile Language Switcher block */}
            <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(7, 57, 28, 0.08)', marginTop: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--muted)' }}>
                {lang === 'en' ? 'Language / ቋንቋ' : 'ቋንቋ / Language'}
              </span>
              <button 
                type="button" 
                onClick={() => { onLanguageChange(lang === 'en' ? 'am' : 'en'); setOpen(false); }}
                style={{
                  minHeight: '34px',
                  padding: '0 16px',
                  background: 'var(--mint-100)',
                  border: '1px solid rgba(255, 255, 255, 0.68)',
                  borderRadius: '999px',
                  color: 'var(--green-950)',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                {lang === 'en' ? 'አማ' : 'En'}
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function PartnerRibbon({ partnerLogos }) {
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

function HomePage({ onNavigate, hero, metrics, capabilities, prodLines, fieldProof, achievements, operatingModel, assemblyInitiative, latestNewsList, partnerLogos, contactPhone, lang }) {
  return (
    <div className="page-view home-view">
      <motion.section
        className="hero"
        style={{ '--hero-bg': `url(${normalizeAssetPath(hero.image, assetFallbacks.hero)})` }}
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
              <button className="btn btn-primary" type="button" onClick={() => onNavigate('products')}>
                {lang === 'en' ? 'View products' : 'ምርቶችን ይመልከቱ'}
                <ArrowRight size={18} />
              </button>
              <a className="btn btn-secondary btn-call" href={phoneHref(contactPhone)}>
                <Phone size={18} />
                <span>{lang === 'en' ? 'Call support' : 'ለእገዛ ይደውሉ'}</span>
                <strong>{contactPhone}</strong>
              </a>
            </motion.div>
          </motion.div>
        </div>
        <PartnerRibbon partnerLogos={partnerLogos} />
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
          <h2>{capabilities.heading}</h2>
        </motion.div>
        <motion.div className="capability-list" {...staggerContainer}>
          {capabilities.items.map((item, i) => {
            const Icon = getIcon(item.icon);
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

      <motion.section className="container products-section" aria-label="Product lines" {...revealMotion}>
        <motion.div className="section-kicker" {...slideFromLeft}>
          <h2>{prodLines.heading}</h2>
        </motion.div>
        <div className="product-rail">
          {prodLines.items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.button 
                className="product-rail-item" 
                key={item.title} 
                type="button" 
                onClick={() => onNavigate('products')} 
              >
                <SmartImage src={item.image} fallback={assetFallbacks.proof} alt={item.title} />
                <Icon />
                <span>{item.title}</span>
                <strong>{item.meta}</strong>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Field Proof Section */}
      <motion.section className="container works-section" aria-label="Field Proof" {...revealMotion}>
        <motion.div className="section-kicker" {...slideFromLeft}>
          <h2>{fieldProof.heading}</h2>
        </motion.div>
        <div className="work-timeline">
          {fieldProof.items.map((item, index) => (
            <motion.div 
              className="work-row" 
              key={item.title} 
              {...revealMotion}
            >
              <SmartImage src={item.image} fallback={assetFallbacks.proof} alt={item.title} />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Achievements Section */}
      <motion.section className="achievements-section" aria-label="Our Achievements" {...fadeInScale}>
        <div className="container achievements-inner">
          <motion.div className="achievements-header" {...slideFromLeft}>
            <h2>{achievements.heading}</h2>
          </motion.div>
          <motion.div className="achievements-grid" {...staggerContainer}>
            {achievements.items.map((item, index) => {
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

      {/* Operating Model & Assembly */}
      <motion.section className="container operating-section" aria-label="Operating model" {...fadeInScale}>
        <motion.div className="operating-panel" {...revealMotion}>
          <motion.div {...slideFromLeft}>
            <h2>{operatingModel.heading}</h2>
            {operatingModel.content && <p>{operatingModel.content}</p>}
          </motion.div>
          <div className="operating-steps">
            {operatingModel.steps.map((step, idx) => (
              <div key={idx}>
                <span>{step.number || String(idx + 1).padStart(2, '0')}</span>
                <strong>{step.label}</strong>
              </div>
            ))}
          </div>
        </motion.div>
        
        {assemblyInitiative.title && (
          <div style={{ marginTop: '24px', background: '#f0fdf4', border: '1px solid #dcfce7', padding: '24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: '#16a34a', color: 'white', padding: '12px', borderRadius: '12px' }}>
              <Factory size={24} />
            </div>
            <div>
              <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>{assemblyInitiative.title}</strong>
              <span style={{ fontSize: '13px', color: '#475569' }}>{assemblyInitiative.description}</span>
            </div>
          </div>
        )}
      </motion.section>

      {/* Latest News */}
      <motion.section className="container" aria-label="Latest news" style={{ paddingBottom: 44 }} {...revealMotion}>
        <div className="news-section-kicker" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{lang === 'en' ? 'Latest News & Updates' : 'የቅርብ ዜናዎች እና መረጃዎች'}</h2>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => onNavigate('news')}>
            {lang === 'en' ? 'View all news' : 'ሁሉንም ዜናዎች ይመልከቱ'} <ArrowRight size={16} />
          </button>
        </div>
        <div className="news-grid">
          {latestNewsList.slice(0, 3).map((post, i) => (
            <motion.div key={post.id} {...staggerItem} transition={{ ...staggerItem.transition, delay: i * 0.12 }}>
              <NewsCard post={post} lang={lang} onClick={() => onNavigate('news')} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

function PageShell({ page, title, intro, children, side, bgImage }) {
  return (
    <div className="page-view">
      <motion.section
        className="page-hero"
        style={{ '--hero-bg': `url(${normalizeAssetPath(bgImage, assetFallbacks.hero)})` }}
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
            <h1>{title}</h1>
            <p>{intro}</p>
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

function AboutPage({ aboutCopy, metrics, coreValues, aboutTimeline }) {
  return (
    <PageShell
      page="about"
      title={aboutCopy.title}
      intro={aboutCopy.intro}
      bgImage={aboutCopy.bgImage}
      side={
        <div className="signature-panel">
          <ShieldCheck size={26} />
          <strong>{aboutCopy.signature_title}</strong>
          <span>{aboutCopy.signature_text}</span>
        </div>
      }
    >
      <motion.div className="about-intro-grid" {...revealMotion}>
        <div className="about-intro-text">
          <h2>{aboutCopy.intro_title}</h2>
          {(aboutCopy.intro_paragraphs || []).map((paragraph) => (
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

      <motion.div className="about-mission-vision" {...revealMotion}>
        <div className="about-mv-card mission">
          <div className="about-mv-icon">
            <Target size={24} />
          </div>
          <h2>{aboutCopy.mission_title}</h2>
          <p>{aboutCopy.mission_description}</p>
        </div>
        <div className="about-mv-card vision">
          <div className="about-mv-icon">
            <Eye size={24} />
          </div>
          <h2>{aboutCopy.vision_title}</h2>
          <p>{aboutCopy.vision_description}</p>
        </div>
      </motion.div>

      <motion.div {...revealMotion}>
        <div className="about-section-header">
          <h2>{aboutCopy.values_heading}</h2>
          <p>{aboutCopy.values_intro}</p>
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

      <motion.div className="about-timeline-section" {...revealMotion}>
        <div className="about-section-header">
          <h2>{aboutCopy.timeline_heading}</h2>
          <p>{aboutCopy.timeline_intro}</p>
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

function NewsCard({ post, onClick, lang }) {
  const summary = post.excerpt || post.content?.[0] || (lang === 'en' ? 'Open to view the full update.' : 'ሙሉ መረጃውን ለማየት ይክፈቱ።');
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
          {lang === 'en' ? 'Read more' : 'ተጨማሪ ያንብቡ'} <ArrowRight size={14} />
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

function ProductCardSkeleton() {
  return (
    <article className="product-card skeleton-card">
      <div className="product-card-media">
        <div className="skeleton-pill"></div>
        <div className="product-card-media-shell skeleton-image-box"></div>
      </div>
      <div className="product-card-body">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </article>
  );
}

function NewsCardSkeleton() {
  return (
    <article className="news-card skeleton-card" style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: 'var(--surface)', borderRadius: '24px' }}>
      <div className="skeleton-image-box" style={{ width: '100%', height: '180px' }}></div>
      <div style={{ padding: '16px 8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton-pill"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </article>
  );
}

function NewsDetailPage({ post, newsPosts, onBack, onSelectOtherPost, lang }) {
  const fallback = createTextPlaceholder(post.title, post.category || 'Meseret Mare Solar', '#0f5c2a');
  const paragraphs = post.content?.length ? post.content : [post.excerpt || ''];
  const otherPosts = (newsPosts || []).filter((p) => p.id !== post.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (post && post.id) {
      fetch(getApiUrl(`news.php?action=view&id=${post.id}`)).catch(() => {});
    }
  }, [post]);

  return (
    <PageShell
      page="news"
      title={post.title}
      intro={post.excerpt || 'News & Field Update from Meseret Mare Gebre Solar Products Importer.'}
      bgImage={post.image || '/images/hero-solar-field.png'}
      side={
        <div className="signature-panel yellow">
          <Newspaper size={26} />
          <strong>{post.category || 'Solar News'}</strong>
          <span>{post.date}</span>
        </div>
      }
    >
      <div style={{ margin: '-10px 0 24px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '10px 22px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--green-950)',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(-3px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
          {lang === 'en' ? 'Back to All News' : 'ወደ ዜናዎች ተመለስ'}
        </button>
      </div>

      <article className="news-detail-article" style={{ background: 'var(--surface)', borderRadius: '28px', padding: '32px', border: '1px solid rgba(255,255,255,0.85)', boxShadow: '0 12px 36px rgba(0,0,0,0.04)', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span className="news-category-badge">{post.category}</span>
          <span className="news-card-date">{post.date}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--green-950)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 24px' }}>
          {post.title}
        </h1>

        <div style={{ width: '100%', maxHeight: '480px', borderRadius: '20px', overflow: 'hidden', margin: '0 0 32px', background: '#f8fafc', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
          <SmartImage src={post.image} fallback={fallback} alt={post.title} style={{ width: '100%', height: '100%', maxHeight: '480px', objectFit: 'cover' }} />
        </div>

        <div style={{ fontSize: '16.5px', lineHeight: '1.8', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {paragraphs.map((p, idx) => (
            <p key={idx} style={{ margin: 0 }}>{p}</p>
          ))}
        </div>
      </article>

      {otherPosts.length > 0 && (
        <div style={{ margin: '40px 0 20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--green-950)', marginBottom: '20px' }}>
            {lang === 'en' ? 'More News & Updates' : 'ተጨማሪ ዜናዎች'}
          </h3>
          <div className="news-grid">
            {otherPosts.map((other) => (
              <NewsCard key={other.id} post={other} lang={lang} onClick={() => onSelectOtherPost(other)} />
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function NewsPage({ newsPosts, newsCopy, lang }) {
  const allLabel = lang === 'en' ? 'All' : 'ሁሉም';
  const [activeFilter, setActiveFilter] = useState(allLabel);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setActiveFilter(lang === 'en' ? 'All' : 'ሁሉም');
  }, [lang]);

  if (selectedPost) {
    return (
      <NewsDetailPage
        post={selectedPost}
        newsPosts={newsPosts}
        onBack={() => setSelectedPost(null)}
        onSelectOtherPost={(post) => setSelectedPost(post)}
        lang={lang}
      />
    );
  }

  const categories = [allLabel, ...Array.from(new Set(newsPosts.map((p) => p.category)))];
  const filtered = activeFilter === allLabel ? newsPosts : newsPosts.filter((p) => p.category === activeFilter);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    if (post && post.id) {
      fetch(getApiUrl(`news.php?action=view&id=${post.id}`)).catch(() => {});
    }
  };

  return (
    <PageShell
      page="news"
      title={newsCopy.title}
      intro={newsCopy.intro}
      bgImage={newsCopy.bgImage}
      side={
        <div className="signature-panel yellow">
          <Newspaper size={26} />
          <strong>{newsCopy.signature_title}</strong>
          <span>{newsCopy.signature_text}</span>
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
        {filtered.length > 0 ? (
          filtered.map((post) => (
            <NewsCard key={post.id} post={post} lang={lang} onClick={() => handleOpenPost(post)} />
          ))
        ) : (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        )}
      </div>
    </PageShell>
  );
}

function ServicesPage({ servicesCopy, services }) {
  return (
    <PageShell
      page="services"
      title={servicesCopy.title}
      intro={servicesCopy.intro}
      bgImage={servicesCopy.bgImage}
      side={
        <div className="signature-panel yellow">
          <Zap size={26} />
          <strong>{servicesCopy.signature_title}</strong>
          <span>{servicesCopy.signature_text}</span>
        </div>
      }
    >
      <motion.div className="process-grid" {...staggerContainer}>
        {services.map((service, index) => {
          const Icon = getIcon(service.icon);
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
        {(servicesCopy.flow_steps || []).map((step, i) => (
          <motion.span key={step} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>{step}</motion.span>
        ))}
      </motion.div>
    </PageShell>
  );
}

function ProductsPage({ productsCopy, products, lang }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const allLabel = lang === 'en' ? 'All Products' : 'ሁሉም ምርቶች';
  const [activeCategory, setActiveCategory] = useState(allLabel);

  useEffect(() => {
    setActiveCategory(lang === 'en' ? 'All Products' : 'ሁሉም ምርቶች');
  }, [lang]);

  const categories = [allLabel, ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const filteredProducts = activeCategory === allLabel
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
      title={productsCopy.title}
      intro={productsCopy.intro}
      bgImage={productsCopy.bgImage}
      side={
        <div className="signature-panel">
          <Award size={26} />
          <strong>{productsCopy.signature_title}</strong>
          <span>{productsCopy.signature_text}</span>
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
      <motion.div
        className="product-grid"
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
        }}
      >
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
            product.model ? (lang === 'en' ? `Model ${product.model}` : `ሞዴል ${product.model}`) : '',
            features.length ? (lang === 'en' ? `${features.length} feature${features.length === 1 ? '' : 's'}` : `${features.length} ባህሪያት`) : '',
            specs.length ? (lang === 'en' ? `${specs.length} spec${specs.length === 1 ? '' : 's'}` : `${specs.length} ዝርዝሮች`) : '',
          ].filter(Boolean);

          return (
            <motion.article
              className={`product-card product-card-detailed ${isExpanded ? 'is-expanded' : ''}`}
              key={productId}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="product-card-media">
                <span className="product-card-category">{product.category}</span>
                <div className="product-card-media-shell">
                  <SmartImage src={product.image} fallback={fallbackImage} alt={getProductSeoAlt(product)} loading="lazy" />
                </div>
              </div>
              <div className="product-card-body">
                <h3 className="product-card-title">{cleanProductName(product.name)}</h3>
                {collapsedMeta.length ? <div className="product-card-meta">{collapsedMeta.join(' • ')}</div> : null}
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
                    {isExpanded ? (lang === 'en' ? 'Show less' : 'ያነሰ አሳይ') : (lang === 'en' ? 'Show more' : 'ተጨማሪ አሳይ')}
                  </button>
                </div>
              )}
            </motion.article>
          );
        })}
      </motion.div>
      {productsCopy.assembly_title && (
        <motion.div className="assembly-band" {...fadeInScale}>
          <Factory size={28} />
          <div>
            <strong>{productsCopy.assembly_title}</strong>
            <span>{productsCopy.assembly_description}</span>
          </div>
        </motion.div>
      )}
    </PageShell>
  );
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

function summarizeText(value, maxLength = 170) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return 'Designed for dependable off-grid solar deployment.';
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function ContactPage({ contactInfo }) {
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
      email: 'inquiry@meseretmare.com',
      subject: `Solar Inquiry: ${formData.need}`,
      message: `Interest: ${formData.need}\n\nDetails: ${formData.message}`,
    };

    try {
      const response = await fetch(getApiUrl('contact.php'), {
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
      title="Request a solar pump or home system quote."
      intro="Contact Meseret Mare Solar Importer to receive a customized recommendation."
      bgImage={assetFallbacks.hero}
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

function PartnersPage({ partnersCopy, partnerLogos, onNavigate }) {
  return (
    <PageShell
      page="partners"
      title={partnersCopy?.title || 'Our Partners & Key Stakeholders'}
      intro={partnersCopy?.intro || 'Collaborating with leading institutions, international NGOs, government agencies, and banking partners to power Ethiopia.'}
      bgImage={partnersCopy?.bgImage || '/images/news-sidama-region-meeting-and-site-visit.jpg'}
      side={
        <div className="signature-panel">
          <Handshake size={26} opacity={0.9} />
          <strong>Institutional Network</strong>
          <span>Building sustainable solar energy infrastructure through strong regional and global partnerships.</span>
        </div>
      }
    >
      <motion.div className="about-section-header" {...revealMotion}>
        <h2>Institutional Partners & Key Stakeholders</h2>
        <p>Working together with government ministries, developmental banks, and international humanitarian organizations.</p>
      </motion.div>

      <motion.div 
        className="partners-showcase-grid" 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          margin: '32px 0 48px'
        }}
        {...staggerContainer}
      >
        {partnerLogos.map((partner, index) => (
          <motion.div 
            key={partner.name || index} 
            className="soft-card partner-showcase-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '32px 24px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            variants={staggerItem}
          >
            <div 
              style={{
                width: '120px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <SmartImage 
                src={partner.logo} 
                fallback={assetFallbacks.partner} 
                alt={partner.name}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--slate-900)', marginBottom: '8px' }}>
              {partner.name}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>
              {partner.description || 'Key strategic partner supporting clean solar energy distribution and field projects across regional states in Ethiopia.'}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="assembly-initiative-banner" 
        style={{
          background: 'linear-gradient(135deg, #13713a 0%, #16a34a 100%)',
          borderRadius: '24px',
          padding: '40px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}
        {...revealMotion}
      >
        <div style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#ffffff' }}>
            Partner With Meseret Mare Solar
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', margin: 0 }}>
            Are you an NGO, government agency, development program, or distributor looking for Lighting Global certified solar water pumps and home systems in Ethiopia?
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ background: '#ffffff', color: '#13713a', fontWeight: '700', padding: '14px 28px', borderRadius: '12px' }}
          onClick={() => onNavigate('contact')}
        >
          Get In Touch
        </button>
      </motion.div>
    </PageShell>
  );
}

const socialIconPaths = {
  Telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  Youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

function SocialIcon({ label }) {
  const path = socialIconPaths[label];
  if (!path) return <Zap size={18} />;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function CookieConsentBanner({ onAccept, onOpenPrivacy, lang }) {
  return (
    <motion.div
      className="cookie-banner"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <p>
        {lang === 'en'
          ? 'We use essential cookies and anonymous analytics to ensure you get the best experience on our website in accordance with international privacy standards.'
          : 'ለተሻለ የተጠቃሚ ተሞክሮ እና ለደህንነት አስፈላጊ ኩኪዎችን እና ስም-አልባ ትንታኔዎችን እንጠቀማለን።'}
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-btn-link" onClick={onOpenPrivacy}>
          {lang === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}
        </button>
        <button type="button" className="cookie-btn-accept" onClick={onAccept}>
          {lang === 'en' ? 'Accept All' : 'ተቀበል'}
        </button>
      </div>
    </motion.div>
  );
}

function PrivacyPolicyModal({ onClose, lang }) {
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
    <motion.div className="news-modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="news-modal legal-modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
        <button className="news-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="news-modal-content">
          <h2>{lang === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}</h2>
          <div className="news-modal-body">
            <p><strong>Last Updated: July 2026</strong></p>
            <p>Meseret Mare Gebre Solar Products Importer ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (meseretmare.com).</p>
            <h3>1. Information We Collect</h3>
            <p>We collect information you voluntarily provide through our contact form (such as your name, phone number, and inquiry details). We also automatically collect anonymous traffic analytics (IP address, page views, user agent) to monitor site performance.</p>
            <h3>2. How We Use Your Data</h3>
            <p>We use your contact details solely to respond to your inquiries regarding solar water pumps, home kits, or installations. Anonymous analytics data is used internally for site optimization and security.</p>
            <h3>3. Cookies & Local Storage</h3>
            <p>Our website uses essential local storage to remember your language preference and cookie consent status. We do not sell or trade your data to third parties.</p>
            <h3>4. International Compliance</h3>
            <p>We follow global data protection standards (including GDPR principles and Ethiopian laws). You may request access to, correction of, or deletion of your submitted contact details at any time by contacting us at <strong>info@meseretmare.com</strong>.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TermsModal({ onClose, lang }) {
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
    <motion.div className="news-modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="news-modal legal-modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
        <button className="news-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="news-modal-content">
          <h2>{lang === 'en' ? 'Terms of Service' : 'የአገልግሎት ውሎች'}</h2>
          <div className="news-modal-body">
            <p><strong>Last Updated: July 2026</strong></p>
            <p>By accessing or using meseretmare.com, you agree to comply with and be bound by these Terms of Service.</p>
            <h3>1. Products & Specifications</h3>
            <p>All solar product details, pump capacities, and specifications displayed on this site are for informational purposes. Final quotes and warranties are provided upon formal site assessment.</p>
            <h3>2. Intellectual Property</h3>
            <p>All trademarks, logos, content, and design elements on this site are the property of Meseret Mare Gebre Solar Products Importer and protected by applicable copyright laws.</p>
            <h3>3. Limitation of Liability</h3>
            <p>We strive to provide accurate energy data, but we are not liable for temporary service interruptions or external network issues.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Footer({ onNavigate, brand, footerContent, socialLinks, contactInfo, lang, onOpenPrivacy, onOpenTerms }) {
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
                <SmartImage src={brand.logo} fallback={assetFallbacks.logo} alt="" aria-hidden="true" />
              </div>
              <h3>{footerContent.about_heading}</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>{footerContent.about_text}</p>
              <div className="social-icons" style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                {socialLinks.map((link) => (
                  <a href={link.url} target="_blank" rel="noreferrer" aria-label={link.label} key={link.label} style={{ color: '#ffffff' }}>
                    <SocialIcon label={link.label} />
                  </a>
                ))}
              </div>
            </motion.div>
            
            <motion.div className="footer-col links-col" {...revealMotion}>
              <h3>{footerContent.links_heading}</h3>
              <nav className="footer-links">
                {(lang === 'en' ? [
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'services', label: 'Services' },
                  { id: 'products', label: 'Products' },
                  { id: 'news', label: 'News' }
                ] : [
                  { id: 'home', label: 'ዋና ገጽ' },
                  { id: 'about', label: 'ስለ እኛ' },
                  { id: 'services', label: 'አገልግሎቶች' },
                  { id: 'products', label: 'ምርቶች' },
                  { id: 'news', label: 'ዜናዎች' }
                ]).map(({ id, label }) => (
                  <a key={id} href={id === 'home' ? '/' : `/${id}`} onClick={(e) => { e.preventDefault(); onNavigate(id); }}>
                    {label}
                  </a>
                ))}
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>{footerContent.contact_nav_label}</a>
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
                    <span>{contactInfo.email_display}</span>
                  </a>
                </li>
                <li>
                  <MapPin size={18} />
                  <button type="button" onClick={() => setIsMapOpen(true)} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                    <span>{contactInfo.address_display}</span>
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p>{footerContent.copyright_text}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
              <button type="button" onClick={onOpenPrivacy} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>
                {lang === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}
              </button>
              <button type="button" onClick={onOpenTerms} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>
                {lang === 'en' ? 'Terms of Service' : 'የአገልግሎት ውሎች'}
              </button>
            </div>
          </div>
        </div>
      </motion.footer>

      <AnimatePresence>
        {isMapOpen && <MapModal address={contactInfo.address_short || contactInfo.address_display} onClose={() => setIsMapOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [lang, setLang] = useState(() => localStorage.getItem('meseret_solar_lang') || 'en');
  const [showCookieBanner, setShowCookieBanner] = useState(() => !localStorage.getItem('meseret_cookie_consent'));
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleAcceptCookies = () => {
    localStorage.setItem('meseret_cookie_consent', 'granted');
    setShowCookieBanner(false);
  };
  
  // Dynamic State sourced 100% from PHP MySQL APIs
  const [rawProducts, setRawProducts] = useState([]);
  const [rawNews, setRawNews] = useState([]);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyPageSeo(activePage, lang);
    fetch(getApiUrl(`stats.php?action=track&page=${encodeURIComponent(activePage)}`), { method: 'POST', keepalive: true }).catch(() => {});
  }, [activePage, lang]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('meseret_solar_lang', newLang);
  };

  useEffect(() => {
    const loadAllDatabaseData = async () => {
      try {
        const [resSec, resProd, resNews] = await Promise.all([
          fetch(getApiUrl('content.php')),
          fetch(getApiUrl('products.php?all=1')),
          fetch(getApiUrl('news.php?all=1'))
        ]);

        const dataSec = await resSec.json();
        const secMap = {};
        if (dataSec.success && Array.isArray(dataSec.sections)) {
          dataSec.sections.forEach(s => {
            secMap[s.section_key] = s;
          });
        }

        const dataProd = await resProd.json();
        if (dataProd.success && Array.isArray(dataProd.products)) {
          setRawProducts(dataProd.products);
        }

        const dataNews = await resNews.json();
        if (dataNews.success && Array.isArray(dataNews.news)) {
          setRawNews(dataNews.news);
        }

        setSections(secMap);
      } catch (err) {
        console.error('Failed to sync backend data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllDatabaseData();
  }, []);

  useEffect(() => {
    const handlePopState = () => setActivePage(getInitialPage());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page) => {
    setActivePage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({ page }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map raw database entries to language states on the fly
  const productsList = rawProducts.map(p => ({
    id: p.id,
    name: lang === 'en' ? p.name_en : (p.name_am || p.name_en),
    model: p.sku || '',
    category: lang === 'en' ? p.category : (p.category_am || p.category),
    use: lang === 'en' ? (p.short_desc_en || '') : (p.short_desc_am || p.short_desc_en || ''),
    details: lang === 'en' ? (p.full_desc_en || '') : (p.full_desc_am || p.full_desc_en || ''),
    image: p.image_url || '',
    features: p.specs_json ? (typeof p.specs_json === 'string' ? JSON.parse(p.specs_json) : p.specs_json) : [],
    specs: []
  }));

  const newsList = rawNews.map(n => ({
    id: n.id,
    title: lang === 'en' ? n.title_en : (n.title_am || n.title_en),
    date: n.published_date,
    category: lang === 'en' ? n.category : (n.category_am || n.category),
    image: n.image_url || n.image || '',
    excerpt: lang === 'en' ? (n.excerpt_en || '') : (n.excerpt_am || n.excerpt_en || ''),
    content: [lang === 'en' ? (n.content_en || '') : (n.content_am || n.content_en || '')]
  }));

  // Construct Mapped layout variables with fallbacks to seeded initial copy
  const brand = {
    logo: sections['header_brand']?.image_url || '/images/meseret-solar-logo.webp',
    name: lang === 'en' ? (sections['header_brand']?.title_en || 'Meseret Mare') : (sections['header_brand']?.title_am || 'መሰረት ማሬ'),
    subtitle: lang === 'en' ? (sections['header_brand']?.content_en || 'Solar Products Importer') : (sections['header_brand']?.content_am || 'የፀሐይ ምርቶች አስመጪ')
  };

  const metrics = [
    [sections['metric_1']?.title_en || '2016', lang === 'en' ? (sections['metric_1']?.content_en || 'Founded') : (sections['metric_1']?.content_am || 'የተመሰረተበት ዓመት')],
    [sections['metric_2']?.title_en || '10k+', lang === 'en' ? (sections['metric_2']?.content_en || 'Systems reach') : (sections['metric_2']?.content_am || 'የደረሱ ሲስተሞች')],
    [sections['metric_3']?.title_en || '40+', lang === 'en' ? (sections['metric_3']?.content_en || 'Districts') : (sections['metric_3']?.content_am || 'ወረዳዎች')],
    [sections['metric_4']?.title_en || 'GOGLA', lang === 'en' ? (sections['metric_4']?.content_en || 'Member') : (sections['metric_4']?.content_am || 'አባል')]
  ];

  let partnerLogos = [];
  try {
    const meta = sections['partner_logos']?.meta_json;
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
    if (Array.isArray(parsed) && parsed.length > 0) {
      partnerLogos = parsed.map(item => ({
        name: item.name || '',
        logo: item.logo || '',
        description: lang === 'en' ? (item.description || '') : (item.description_am || item.description || '')
      }));
    }
  } catch(e) {}
  if (partnerLogos.length === 0) {
    partnerLogos = [
      { name: 'CARE International Ethiopia', logo: '/partners/webp/care-international-ethiopia.webp', description: 'Credit options for low-income farmers buying solar kits and productive-use systems.' },
      { name: 'Addis Ababa University', logo: '/partners/webp/addis-ababa-university.webp', description: 'Academic research and solar energy technology testing partner.' },
      { name: 'Ethiopian Solar Energy Development Association', logo: '/partners/webp/ethiopian-solar-energy-development-association.webp', description: 'Industry advocacy and solar energy standards in Ethiopia.' },
      { name: 'ASDEPO', logo: '/partners/webp/asdepo.webp', description: 'Humanitarian and community development partner across regional states.' },
      { name: 'Purpose Black', logo: '/partners/webp/purpose-black.webp', description: 'Agricultural development and solar irrigation partner.' },
      { name: 'Winrock International', logo: '/partners/webp/winrock.webp', description: 'Clean energy transition and agricultural water supply initiatives.' },
      { name: 'Ministry of Water and Energy', logo: '/partners/webp/ministry-of-water-and-energy.webp', description: 'Rural electrification targets and standard compliance for solar imports across Ethiopia.' },
      { name: 'Development Bank of Ethiopia', logo: '/partners/webp/development-bank-of-ethiopia.webp', description: 'Credit facilities, forex allocation support, and rural customer financing models.' },
      { name: 'GIZ Ethiopia', logo: '/partners/webp/giz.webp', description: 'Technical capacity building, field training, and rural distribution network support.' },
      { name: 'GOGLA', logo: '/partners/webp/gogla.webp', description: 'Quality standards and customer protection principles for off-grid solar.' },
      { name: 'Ministry of Agriculture', logo: '/partners/webp/ministry-of-agriculture.webp', description: 'Agricultural solar water pump adoption and irrigation support.' }
    ];
  }

  const hero = {
    title: lang === 'en' ? (sections['hero']?.title_en || 'Power, sized right.') : (sections['hero']?.title_am || 'ኃይል፣ በትክክለኛ መጠን።'),
    subtitle: lang === 'en' ? (sections['hero']?.content_en || 'Solar water pumps, solar home systems, portable lanterns, and field support for Ethiopia.') : (sections['hero']?.content_am || 'ለኢትዮጵያ የፀሐይ ውሃ ፓምፖች፣ የቤት ሲስተሞች፣ መብራቶች እና የመስክ ድጋፍ።'),
    image: sections['hero']?.image_url || '/images/news-participation-in-water-and-energy-fair.jpeg'
  };

  const capabilities = {
    heading: lang === 'en' ? (sections['cert_supply_heading']?.title_en || 'Certified solar supply. Clean delivery.') : (sections['cert_supply_heading']?.title_am || 'የተረጋገጠ የፀሐይ አቅርቦት። ንፁህ አቅርቦት።'),
    items: [
      { label: lang === 'en' ? (sections['cert_card_1']?.title_en || 'CERTIFIED IMPORTS') : (sections['cert_card_1']?.title_am || 'የተረጋገጡ ገቢዎች'), value: lang === 'en' ? (sections['cert_card_1']?.content_en || 'Lighting Global certified focus') : (sections['cert_card_1']?.content_am || 'በላይቲንግ ግሎባል የተረጋገጡ ምርቶች'), icon: 'ShieldCheck' },
      { label: lang === 'en' ? (sections['cert_card_2']?.title_en || 'WATER SECURITY') : (sections['cert_card_2']?.title_am || 'የውሃ ዋስትና'), value: lang === 'en' ? (sections['cert_card_2']?.content_en || 'Solar water pumps for farms and communities') : (sections['cert_card_2']?.content_am || 'ለእርሻ እና ለማህበረሰብ የፀሐይ ውሃ ፓምፖች'), icon: 'Droplet' },
      { label: lang === 'en' ? (sections['cert_card_3']?.title_en || 'FIELD CARE') : (sections['cert_card_3']?.title_am || 'የመስክ ድጋፍ'), value: lang === 'en' ? (sections['cert_card_3']?.content_en || 'Assessment, installation, maintenance') : (sections['cert_card_3']?.content_am || 'ግምገማ፣ ተከላ፣ ጥገና'), icon: 'Wrench' }
    ]
  };

  const prodLines = {
    heading: lang === 'en' ? (sections['prod_line_heading']?.title_en || 'Product lines.') : (sections['prod_line_heading']?.title_am || 'የምርት መስመሮች።'),
    items: [
      { title: lang === 'en' ? (sections['prod_line_1']?.title_en || 'Solar Pump Systems') : (sections['prod_line_1']?.title_am || 'የፀሐይ ፓምፕ ሲስተሞች'), meta: lang === 'en' ? (sections['prod_line_1']?.content_en || 'Irrigation, wells, and community water') : (sections['prod_line_1']?.content_am || 'ለመስኖ፣ ለጉድጓድ እና ለማህበረሰብ ውሃ'), image: sections['prod_line_1']?.image_url || '/images/proof-community-solar.png', icon: 'Droplet' },
      { title: lang === 'en' ? (sections['prod_line_2']?.title_en || 'Solar Home Kits') : (sections['prod_line_2']?.title_am || 'የፀሐይ የቤት ሲስተሞች'), meta: lang === 'en' ? (sections['prod_line_2']?.content_en || 'Lighting, charging, and home power') : (sections['prod_line_2']?.content_am || 'ለብርሃን፣ ለቻርጅ እና ለቤት ኃይል'), image: sections['prod_line_2']?.image_url || '/images/product-home-kit.png', icon: 'BatteryCharging' },
      { title: lang === 'en' ? (sections['prod_line_3']?.title_en || 'DC Solar Appliances') : (sections['prod_line_3']?.title_am || 'የዲሲ የፀሐይ መሳሪያዎች'), meta: lang === 'en' ? (sections['prod_line_3']?.content_en || 'Fans, TV, and efficient essentials') : (sections['prod_line_3']?.content_am || 'ለፋን፣ ለቲቪ እና ለቀልጣፋ መሳሪያዎች'), image: sections['prod_line_3']?.image_url || '/images/hero-solar-field.png', icon: 'Zap' }
    ]
  };

  const fieldProof = {
    heading: lang === 'en' ? (sections['field_proof_heading']?.title_en || 'Field proof.') : (sections['field_proof_heading']?.title_am || 'የመስክ ምስክሮች።'),
    items: [
      { title: lang === 'en' ? (sections['field_proof_1']?.title_en || 'Ethiopia Access') : (sections['field_proof_1']?.title_am || 'በኢትዮጵያ ተደራሽነት'), detail: lang === 'en' ? (sections['field_proof_1']?.content_en || 'Off-grid solar reach for underserved communities.') : (sections['field_proof_1']?.content_am || 'ከመብራት መስመር ውጭ ላሉ ማህበረሰቦች የፀሐይ ኃይል ተደራሽነት።'), image: sections['field_proof_1']?.image_url || '/images/proof-community-solar.png' },
      { title: lang === 'en' ? (sections['field_proof_2']?.title_en || 'Productive Use') : (sections['field_proof_2']?.title_am || 'ምርታማ አጠቃቀም'), detail: lang === 'en' ? (sections['field_proof_2']?.content_en || 'Solar pumping, connectivity, cooling, and clean power.') : (sections['field_proof_2']?.content_am || 'የፀሐይ ፓምፕ፣ ግንኙነት፣ ማቀዝቀዝ እና ንፁህ ኃይል።'), image: sections['field_proof_2']?.image_url || '/images/hero-solar-field.png' },
      { title: lang === 'en' ? (sections['field_proof_3']?.title_en || 'Home Power') : (sections['field_proof_3']?.title_am || 'የቤት ኃይል'), detail: lang === 'en' ? (sections['field_proof_3']?.content_en || 'Sun King and d.light home systems in daily life.') : (sections['field_proof_3']?.content_am || 'የሳን ኪንግ እና ዲ.ላይት የቤት ሲስተሞች በዕለት ተዕለት ህይወት።'), image: sections['field_proof_3']?.image_url || '/images/product-home-kit.png' }
    ]
  };

  const achievements = {
    heading: lang === 'en' ? (sections['achievements_heading']?.title_en || 'We Pride Ourselves On Our Significant Achievements:') : (sections['achievements_heading']?.title_am || 'በታላላቅ ስኬቶቻችን እንኮራለን፡'),
    items: [
      { title: lang === 'en' ? (sections['achievement_1']?.title_en || 'Imported Successfully') : (sections['achievement_1']?.title_am || 'በተሳካ ሁኔታ የገባ'), description: lang === 'en' ? (sections['achievement_1']?.content_en || 'solar products certified by Lighting Global.') : (sections['achievement_1']?.content_am || 'በላይቲንግ ግሎባል የተረጋገጡ የፀሐይ ምርቶች።'), icon: 'Award' },
      { title: lang === 'en' ? (sections['achievement_2']?.title_en || 'Strong Partnerships') : (sections['achievement_2']?.title_am || 'ጠንካራ አጋርነቶች'), description: lang === 'en' ? (sections['achievement_2']?.content_en || 'Established strong partnerships with DBE.') : (sections['achievement_2']?.content_am || 'ከኢትዮጵያ ልማት ባንክ ጋር የተመሰረተ አጋርነት።'), icon: 'Users' },
      { title: lang === 'en' ? (sections['achievement_3']?.title_en || 'Increased Operation Area') : (sections['achievement_3']?.title_am || 'የተስፋፋ የስራ ክልል'), description: lang === 'en' ? (sections['achievement_3']?.content_en || 'Successfully distributed solar solutions in SNNP, Oromia, Tigray, and Amhara.') : (sections['achievement_3']?.content_am || 'በደቡብ፣ በኦሮሚያ፣ በትግራይ እና በአማራ ክልሎች የተስፋፋ አቅርቦት።'), icon: 'MapPin' }
    ]
  };

  let operatingModelSteps = [];
  try {
    const meta = sections['operating_model']?.meta_json;
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
    if (Array.isArray(parsed) && parsed.length > 0) {
      operatingModelSteps = parsed.map(item => ({
        number: item.number || '',
        label: lang === 'en' ? (item.label_en || item.label || '') : (item.label_am || item.label || '')
      }));
    }
  } catch (e) {}
  if (operatingModelSteps.length === 0) {
    operatingModelSteps = [
      { number: '01', label: lang === 'en' ? 'Field check' : 'የመስክ ፍተሻ' },
      { number: '02', label: lang === 'en' ? 'Right sizing' : 'ልክ መምረጥ' },
      { number: '03', label: lang === 'en' ? 'Certified supply' : 'የተረጋገጠ አቅርቦት' },
      { number: '04', label: lang === 'en' ? 'Install and care' : 'ተከላ እና ጥገና' }
    ];
  }

  const operatingModel = {
    heading: lang === 'en' ? (sections['operating_model']?.title_en || 'Clear from day one.') : (sections['operating_model']?.title_am || 'ከመጀመሪያው ቀን ግልፅ።'),
    content: lang === 'en' ? (sections['operating_model']?.content_en || '') : (sections['operating_model']?.content_am || ''),
    steps: operatingModelSteps
  };

  const assemblyInitiative = {
    title: lang === 'en' ? (sections['assembly_initiative']?.title_en || 'Local assembly initiative') : (sections['assembly_initiative']?.title_am || 'የአካባቢ ገጣጣሚ ተነሳሽነት'),
    description: lang === 'en' ? (sections['assembly_initiative']?.content_en || 'Preparing local assembly for 1, 3, and 4 bulb solar home systems and agricultural solar water pumps to create jobs, transfer skills, and reduce hardware costs.') : (sections['assembly_initiative']?.content_am || 'የሀገር ውስጥ ገጣጣሚ ፋብሪካ ዝግጅት።')
  };

  const aboutCopy = {
    title: lang === 'en' ? (sections['about_intro']?.title_en || 'Solving Ethiopia rural energy challenges.') : (sections['about_intro']?.title_am || 'የኢትዮጵያን የገጠር ኃይል ፈተናዎች መፍታት።'),
    intro: lang === 'en' ? (sections['about_intro']?.content_en || 'Established in 2016, Meseret Mare Gebre Solar Products Importer distributes certified, affordable solar solutions for off-grid homes, farms, NGOs, and institutions.') : (sections['about_intro']?.content_am || 'በ2016 የተመሰረተው መሰረት ማሬ ገብሬ የፀሐይ ምርቶች አስመጪ።'),
    bgImage: sections['about_intro']?.image_url || '/images/news-debrezeyet-mobile-solar-pump-exhibition.jpg',
    signature_title: lang === 'en' ? 'Reliable imports. Local support.' : 'አስተማማኝ ግዢዎች። የአካባቢ ድጋፍ።',
    signature_text: lang === 'en' ? 'Focused on affordability, trust, and clean energy access for rural communities.' : 'ተመጣጣኝ ዋጋ፣ ታማኝነት እና ንፁህ የኃይል ተደራሽነት ላይ ትኩረት አድርገናል።',
    intro_title: lang === 'en' ? (sections['about_clean_power']?.title_en || 'Dedicated to clean power access.') : (sections['about_clean_power']?.title_am || 'ለጽዳት ኃይል ተደራሽነት የተሰጠ።'),
    intro_paragraphs: (lang === 'en' ? (sections['about_clean_power']?.content_en || '') : (sections['about_clean_power']?.content_am || '')).split("\n\n"),
    mission_title: lang === 'en' ? (sections['about_mission']?.title_en || 'Our Mission') : (sections['about_mission']?.title_am || 'ተልዕኳችን'),
    mission_description: lang === 'en' ? (sections['about_mission']?.content_en || '') : (sections['about_mission']?.content_am || ''),
    vision_title: lang === 'en' ? (sections['about_vision']?.title_en || 'Our Vision') : (sections['about_vision']?.title_am || 'ራዕያችን'),
    vision_description: lang === 'en' ? (sections['about_vision']?.content_en || '') : (sections['about_vision']?.content_am || ''),
    values_heading: lang === 'en' ? (sections['about_values']?.title_en || 'Our Core Values') : (sections['about_values']?.title_am || 'ዋና እሴቶቻችን'),
    values_intro: lang === 'en' ? 'The principles that guide every decision we make.' : 'እያንዳንዱን ውሳኔ የሚመሩ መርሆዎች።',
    timeline_heading: lang === 'en' ? (sections['about_journey']?.title_en || 'Our Journey') : (sections['about_journey']?.title_am || 'ጉዟችን'),
    timeline_intro: lang === 'en' ? 'Key milestones in our mission to power Ethiopia.' : 'የእድገት አበይት ምዕራፎቻችን።'
  };

  let coreValues = [];
  try {
    const meta = sections['about_values']?.meta_json;
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
    if (Array.isArray(parsed) && parsed.length > 0) {
      coreValues = parsed.map(item => [
        lang === 'en'
          ? (item.title_en || item.title || '')
          : (item.title_am || item.title || ''),
        lang === 'en'
          ? (item.desc_en || item.desc || item.description || '')
          : (item.desc_am || item.desc || item.description || '')
      ]).filter(([name]) => name);
    }
  } catch(e) {}
  // Also try valuesData static JSON as secondary fallback
  if (coreValues.length === 0 && Array.isArray(valuesData?.values)) {
    coreValues = valuesData.values.map(item => [
      item.title || '',
      item.description || ''
    ]).filter(([name]) => name);
  }
  if (coreValues.length === 0) {
    coreValues = lang === 'en' ? [
      ['Customer Satisfaction', 'Prioritizing user needs with reliable service.'],
      ['Integrity & Quality', 'Importing certified products built for field use.'],
      ['Community Impact', 'Powering water and light for off-grid families.'],
      ['Innovation', 'Bringing modern DC solar technology to rural areas.']
    ] : [
      ['የደንበኞች እርካታ', 'የደንበኞችን ፍላጎት አስተማማኝ በሆነ አገልግሎት ማስቀደም።'],
      ['ታማኝነት እና ጥራት', 'ለመስክ አገልግሎት የተሰሩ የተረጋገጡ ምርቶችን ማስመጣት።'],
      ['ማህበረሰባዊ ተጽዕኖ', 'ከመብራት መስመር ውጪ ላሉ ቤተሰቦች ብርሃንና ውሃ ማቅረብ።'],
      ['ፈጠራ', 'ዘመናዊ የዲሲ ሶላር ቴክኖሎጂን ወደ ገጠር ማምጣት።']
    ];
  }

  let aboutTimeline = [];
  try {
    const meta = sections['about_journey']?.meta_json;
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
    if (Array.isArray(parsed) && parsed.length > 0) {
      aboutTimeline = parsed.map(item => ({
        year: item.year || '',
        text: lang === 'en' ? (item.text_en || item.text || '') : (item.text_am || item.text || '')
      }));
    }
  } catch (e) {}
  if (aboutTimeline.length === 0) {
    aboutTimeline = lang === 'en' ? [
      { year: '2016', text: 'Company established in Bishoftu' },
      { year: '2018', text: 'Partnership with DBE' },
      { year: '2021', text: 'Expanded to 4 key regions' },
      { year: '2024', text: 'Solar fair leader' }
    ] : [
      { year: '2016', text: 'ኩባንያው በቢሾፍቱ ተመሰረተ' },
      { year: '2018', text: 'ከኢትዮጵያ ልማት ባንክ ጋር አጋርነት' },
      { year: '2021', text: 'ወደ 4 ዋና ዋና ክልሎች ተስፋፋ' },
      { year: '2024', text: 'በሶላር አውደ ርዕይ መሪ' }
    ];
  }

  let servicesFlowSteps = [];
  try {
    const meta = sections['services_flow']?.meta_json;
    const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
    if (Array.isArray(parsed) && parsed.length > 0) {
      servicesFlowSteps = parsed.map(item => lang === 'en' ? (item.step_en || item.step || '') : (item.step_am || item.step || ''));
    }
  } catch(e) {}
  if (servicesFlowSteps.length === 0) {
    servicesFlowSteps = lang === 'en' ? 
      ['Assess site', 'Design system', 'Supply certified hardware', 'Install and commission', 'Train users', 'Maintain performance'] :
      ['ሳይት መገምገም', 'ሲስተም መንደፍ', 'የተረጋገጡ ምርቶችን ማቅረብ', 'መግጠም እና ማስጀመር', 'ስልጠና መስጠት', 'አገልግሎት መከታተል'];
  }

  const servicesCopy = {
    title: lang === 'en' ? (sections['services_intro']?.title_en || 'Solar assessment, installation, and maintenance in Ethiopia.') : (sections['services_intro']?.title_am || 'የፀሐይ ግምገማ፣ ተከላ እና ጥገና በኢትዮጵያ።'),
    intro: lang === 'en' ? (sections['services_intro']?.content_en || 'From solar site assessment and system design to import, installation, commissioning, training, monitoring, and long-term maintenance.') : (sections['services_intro']?.content_am || 'ከቦታ ግምገማ እና ሲስተም ንድፍ እስከ ተከላ፣ ስልጠና እና የረጅም ጊዜ ጥገና።'),
    bgImage: sections['services_intro']?.image_url || '/images/news-mobile-solar-water-pump-in-action.jpeg',
    signature_title: lang === 'en' ? 'Fast path to working power.' : 'ወደ አስተማማኝ ኃይል ፈጣን መንገድ።',
    signature_text: lang === 'en' ? 'Solar pump, home system, and institutional project support with clear field sizing.' : 'የፀሐይ ፓምፕ፣ የቤት ሲስተም እና ድርጅታዊ የፕሮጀክት ድጋፍ።',
    flow_steps: servicesFlowSteps
  };

  const services = [
    { category: lang === 'en' ? 'ASSESSMENT' : 'ግምገማ', title: lang === 'en' ? (sections['services_card_1']?.title_en || 'Solar Site Assessment') : (sections['services_card_1']?.title_am || 'የፀሐይ ቦታ ግምገማ'), detail: lang === 'en' ? (sections['services_card_1']?.content_en || 'On-site hydrological assessment, water table check, and solar radiance calculation.') : (sections['services_card_1']?.content_am || 'የውሃ ደረጃ እና የፀሐይ ኃይል ግምገማ።'), image: sections['services_card_1']?.image_url || '/images/news-sidama-region-meeting-and-site-visit.jpg', icon: 'FileSearch' },
    { category: lang === 'en' ? 'DESIGN' : 'ንድፍ', title: lang === 'en' ? (sections['services_card_2']?.title_en || 'System Design & Sizing') : (sections['services_card_2']?.title_am || 'የሲስተም ንድፍ እና መጠን'), detail: lang === 'en' ? (sections['services_card_2']?.content_en || 'Custom engineering to match pump capacity with daily water demand.') : (sections['services_card_2']?.content_am || 'ከዕለታዊ የውሃ ፍላጎት ጋር የተመጠነ ንድፍ።'), image: sections['services_card_2']?.image_url || '/images/difful-submersible-solar-pump.webp', icon: 'Zap' },
    { category: lang === 'en' ? 'HARDWARE' : 'አቅርቦት', title: lang === 'en' ? (sections['services_card_3']?.title_en || 'Import & Certified Supply') : (sections['services_card_3']?.title_am || 'ማስመጣት እና የተረጋገጠ አቅርቦት'), detail: lang === 'en' ? (sections['services_card_3']?.content_en || 'Lighting Global & GOGLA certified hardware supply.') : (sections['services_card_3']?.content_am || 'የተረጋገጡ የፀሐይ መሳሪያዎች አቅርቦት።'), image: sections['services_card_3']?.image_url || '/images/sun-king-homeplus-max-24-tv.webp', icon: 'ShieldCheck' },
    { category: lang === 'en' ? 'CARE' : 'ጥገና', title: lang === 'en' ? (sections['services_card_4']?.title_en || 'Installation & Maintenance') : (sections['services_card_4']?.title_am || 'ተከላ እና ጥገና'), detail: lang === 'en' ? (sections['services_card_4']?.content_en || 'Field installation by trained technicians with routine maintenance and warranty support.') : (sections['services_card_4']?.content_am || 'በባለሙያዎች የሚከናወን ተከላ እና ጥገና።'), image: sections['services_card_4']?.image_url || '/images/news-mobile-solar-water-pump-in-action.jpeg', icon: 'Wrench' }
  ];

  let contactMeta = { phone_primary: '+251 910691261', phone_secondary: '+251 913040053', email: 'meseretmare79@gmail.com / info@meseretmare.com', address_en: 'Gulele Sub City, Addisu Gebeya, Near to NOC Gas Station, Addis Ababa, Ethiopia', address_am: 'ጉለሌ ክፍለ ከተማ፣ አዲሱ ገበያ፣ ከኤንኦሲ ማደያ አጠገብ፣ አዲስ አበባ፣ ኢትዮጵያ' };
  try {
    const meta = sections['contact_address']?.meta_json;
    if (meta) {
      const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
      if (parsed.phone_primary) contactMeta = parsed;
    }
  } catch(e) {}

  const contactInfo = {
    address_short: lang === 'en' ? contactMeta.address_en : contactMeta.address_am,
    primary_phone: contactMeta.phone_primary,
    primary_email: contactMeta.email,
    phone_display: `Phone: ${contactMeta.phone_primary} | Secondary: ${contactMeta.phone_secondary}`,
    email_display: contactMeta.email,
    address_display: lang === 'en' ? contactMeta.address_en : contactMeta.address_am,
    form: {
      name_label: lang === 'en' ? 'Your Name' : 'ስምዎ',
      name_placeholder: lang === 'en' ? 'e.g. Abebe Kebede' : 'ምሳሌ፡ አበበ ከበደ',
      phone_label: lang === 'en' ? 'Phone Number' : 'ስልክ ቁጥር',
      phone_placeholder: lang === 'en' ? 'e.g. +251 911...' : 'ምሳሌ፡ +251 911...',
      need_label: lang === 'en' ? 'Product / Service Interest' : 'የምርት / አገልግሎት ፍላጎት',
      need_options: lang === 'en' ? 
        ['Solar Water Pump System', 'Solar Home System', 'Solar Lanterns / Lighting', 'Installation & Sizing Help', 'Maintenance or Repair Request'] :
        ['የፀሐይ ውሃ ፓምፕ ሲስተም', 'የፀሐይ የቤት ሲስተም', 'የፀሐይ ላንተርን / መብራቶች', 'የተከላ እና የዲዛይን እገዛ', 'የጥገና ወይም የአገልግሎት ጥያቄ'],
      details_label: lang === 'en' ? 'Project / Inquiry Details' : 'የፕሮጀክት / የጥያቄ ዝርዝሮች',
      details_placeholder: lang === 'en' ? 'Describe your field size, water needs, or target application details...' : 'የእርሻዎን መጠን፣ የውሃ ፍላጎትዎን ወይም ሌሎች ዝርዝሮችን ይግለጹ...',
      sent_label: lang === 'en' ? 'Sent!' : 'ተልኳል!',
      submit_label: lang === 'en' ? 'Send request' : 'ጥያቄ ይላኩ'
    }
  };

  const footerContent = {
    about_heading: lang === 'en' ? (sections['footer_about']?.title_en || 'Meseret Mare Solar Systems') : (sections['footer_about']?.title_am || 'መሰረት ማሬ የፀሐይ ኃይል'),
    about_text: lang === 'en' ? (sections['footer_about']?.content_en || 'Powering clean water and light across Ethiopia.') : (sections['footer_about']?.content_am || 'በኢትዮጵያ ንፁህ ውሃ እና ብርሃን ማቅረብ።'),
    links_heading: lang === 'en' ? 'Navigation' : 'ገጾች',
    contact_heading: lang === 'en' ? 'Get In Touch' : 'ያግኙን',
    contact_nav_label: lang === 'en' ? 'Contact us' : 'ያግኙን',
    copyright_text: lang === 'en' ? (sections['footer_about']?.content_en || '© 2026 Meseret Mare. All rights reserved.') : (sections['footer_about']?.content_am || '© 2026 መሰረት ማሬ። መብቱ በህግ የተጠበቀ ነው።')
  };

  let socialMeta = { facebook: 'https://facebook.com/meseretsolar', telegram: 'https://t.me/meseretsolar', linkedin: 'https://linkedin.com/company/meseretsolar', youtube: 'https://youtube.com/c/meseretsolar' };
  try {
    const meta = sections['footer_socials']?.meta_json;
    if (meta) {
      const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
      if (parsed.facebook) socialMeta = parsed;
    }
  } catch(e) {}

  const socialLinks = [
    { label: 'Facebook', url: socialMeta.facebook },
    { label: 'Telegram', url: socialMeta.telegram },
    { label: 'LinkedIn', url: socialMeta.linkedin },
    { label: 'YouTube', url: socialMeta.youtube }
  ];

  const partnersCopy = {
    title: lang === 'en' ? (sections['partner_logos']?.title_en || 'Our Partners & Key Stakeholders') : (sections['partner_logos']?.title_am || 'ዋና አጋሮቻችን'),
    intro: lang === 'en' ? (sections['partner_logos']?.content_en || 'Collaborating with leading institutions to power Ethiopia.') : (sections['partner_logos']?.content_am || 'ኢትዮጵያን ለማብራት ከዋና ዋና ተቋማት ጋር በጋራ መስራት።'),
    bgImage: sections['partner_logos']?.image_url || '/images/news-sidama-region-meeting-and-site-visit.jpg'
  };

  function renderPage(activePage, onNavigate) {
    switch (activePage) {
      case 'about':
        return <AboutPage aboutCopy={aboutCopy} metrics={metrics} coreValues={coreValues} aboutTimeline={aboutTimeline} />;
      case 'services':
        return <ServicesPage servicesCopy={servicesCopy} services={services} />;
      case 'products':
        return <ProductsPage productsCopy={aboutCopy} products={productsList} lang={lang} />;
      case 'partners':
        return <PartnersPage partnersCopy={partnersCopy} partnerLogos={partnerLogos} onNavigate={onNavigate} lang={lang} />;
      case 'news':
        return <NewsPage newsPosts={newsList} newsCopy={aboutCopy} lang={lang} />;
      case 'contact':
        return <ContactPage contactInfo={contactInfo} lang={lang} />;
      default:
        return (
          <HomePage 
            onNavigate={onNavigate} 
            hero={hero}
            metrics={metrics}
            capabilities={capabilities}
            prodLines={prodLines}
            fieldProof={fieldProof}
            achievements={achievements}
            operatingModel={operatingModel}
            assemblyInitiative={assemblyInitiative}
            latestNewsList={newsList}
            partnerLogos={partnerLogos}
            contactPhone={contactInfo.primary_phone}
            lang={lang}
          />
        );
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f8fdf6 0%, #ffffff 100%)',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/images/meseret-solar-logo.webp" alt="Meseret Mare Solar" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#05210d', fontFamily: 'var(--font-display, sans-serif)', letterSpacing: '-0.02em' }}>Meseret Mare</div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solar Energy Solutions</div>
          </div>
        </div>
        <div style={{ width: '160px', height: '4px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '45%', background: 'linear-gradient(90deg, #16a34a, #f5c518)', borderRadius: '999px', animation: 'brandPulseBar 1.2s ease-in-out infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header activePage={activePage} onNavigate={navigate} brand={brand} lang={lang} onLanguageChange={handleLanguageChange} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} {...pageMotion}>
            {renderPage(activePage, navigate)}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer 
        onNavigate={navigate} 
        brand={brand} 
        footerContent={footerContent} 
        socialLinks={socialLinks} 
        contactInfo={contactInfo} 
        lang={lang}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />
      <AnimatePresence>
        {showCookieBanner && (
          <CookieConsentBanner
            onAccept={handleAcceptCookies}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            lang={lang}
          />
        )}
        {isPrivacyOpen && <PrivacyPolicyModal onClose={() => setIsPrivacyOpen(false)} lang={lang} />}
        {isTermsOpen && <TermsModal onClose={() => setIsTermsOpen(false)} lang={lang} />}
      </AnimatePresence>
    </>
  );
}
