import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BatteryCharging,
  Check,
  ChevronRight,
  Droplet,
  Factory,
  Gauge,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import brandLogo from './assets/meseret-solar-logo.webp';
import heroImage from './assets/hero-solar-field.png';
import productHomeKit from './assets/product-home-kit.png';
import productSolarPump from './assets/product-solar-pump.png';
import proofCommunitySolar from './assets/proof-community-solar.png';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'products', label: 'Products' },
  { id: 'contact', label: 'Contact' },
];

const metrics = [
  ['2016', 'Founded'],
  ['10k+', 'Systems reach'],
  ['40+', 'Districts'],
  ['GOGLA', 'Member'],
];

const highlights = [
  { icon: ShieldCheck, label: 'Certified imports', value: 'Lighting Global focus' },
  { icon: Droplet, label: 'Water security', value: 'Solar pump systems' },
  { icon: Wrench, label: 'Field care', value: 'Install and maintain' },
];

const services = [
  { icon: Gauge, title: 'Assess', detail: 'Site, load, water, and budget fit.' },
  { icon: BatteryCharging, title: 'Supply', detail: 'Solar kits, pumps, lights, and DC appliances.' },
  { icon: Wrench, title: 'Install', detail: 'Mounted, wired, commissioned, and tested.' },
  { icon: Sparkles, title: 'Maintain', detail: 'After-sales checks and practical support.' },
];

const products = [
  ['Solar pumps', 'Submersible and surface units', 'Farms, wells, irrigation', productSolarPump],
  ['Home systems', 'Sun King lighting kits', 'Off-grid households', productHomeKit],
  ['Portable lighting', 'Lanterns with phone charging', 'Homes, shops, field work', productHomeKit],
  ['DC appliances', 'Low-power TVs and essentials', 'Institutions and homes', proofCommunitySolar],
];

const featuredProducts = [
  { icon: Droplet, title: 'Pump Systems', meta: 'Irrigation and wells', image: productSolarPump },
  { icon: BatteryCharging, title: 'Home Kits', meta: 'Lighting and charging', image: productHomeKit },
  { icon: Zap, title: 'DC Appliances', meta: 'Efficient essentials', image: heroImage },
];

const partnerLogos = [
  ['Ministry of Water and Energy', 'ministry-of-water-and-energy.webp'],
  ['Ministry of Agriculture', 'ministry-of-agriculture.webp'],
  ['Development Bank of Ethiopia', 'development-bank-of-ethiopia.webp'],
  ['GIZ', 'giz.webp'],
  ['GOGLA', 'gogla.webp'],
  ['CARE International Ethiopia', 'care-international-ethiopia.webp'],
  ['Addis Ababa University', 'addis-ababa-university.webp'],
  ['Ethiopian Solar Energy Development Association', 'ethiopian-solar-energy-development-association.webp'],
  ['ASDEPO', 'asdepo.webp'],
  ['Purpose Black', 'purpose-black.webp'],
  ['Winrock', 'winrock.webp'],
];

const sunKingPostImages = {
  ethiopiaAccess: 'https://sunking.com/wp-content/uploads/2026/03/Image-7-scaled.jpeg',
  scaleUp: 'https://sunking.com/wp-content/uploads/2026/02/image-31.jpg',
  homePlusFamily: 'https://sunking.com/wp-content/uploads/2025/12/HomePlus-Max-family-scaled.jpg',
};

const previousWorks = [
  ['Ethiopia Access', 'Solar reach for underserved communities.', sunKingPostImages.ethiopiaAccess],
  ['Productive Use', 'Connectivity, cooling, and clean power.', sunKingPostImages.scaleUp],
  ['Home Power', 'Sun King home systems in daily life.', sunKingPostImages.homePlusFamily],
];

const operatingModel = [
  ['01', 'Field check'],
  ['02', 'Right sizing'],
  ['03', 'Certified supply'],
  ['04', 'Install and care'],
];

const pageMotion = {
  initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(10px)' },
  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
};

const revealMotion = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.28 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const pageCopy = {
  about: {
    title: 'Built for practical solar access.',
    intro: 'Meseret Mare imports reliable solar technology for Ethiopian homes, farms, and institutions.',
  },
  services: {
    title: 'From site check to long-term support.',
    intro: 'Clear technical delivery for water, lighting, home power, and community programs.',
  },
  products: {
    title: 'Hardware selected for real conditions.',
    intro: 'A focused catalog for off-grid energy, irrigation, lighting, and low-power appliances.',
  },
  contact: {
    title: 'Start with the site. We will size the solution.',
    intro: 'Send a short request and the team can recommend the next practical step.',
  },
};

function getInitialPage() {
  const hash = window.location.hash.replace('#', '');
  return navItems.some((item) => item.id === hash) ? hash : 'home';
}

function Header({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(activePage === 'home');

  useEffect(() => {
    const updateHeaderMode = () => {
      const hero = document.querySelector('.hero');
      const heroHeight = hero?.getBoundingClientRect().height || window.innerHeight;
      const trigger = Math.max(180, heroHeight - 130);
      setOverHero(activePage === 'home' && window.scrollY < trigger);
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
            <img src={brandLogo} alt="" />
          </span>
          <span>
            <span className="brand-name">Meseret Mare</span>
            <span className="brand-subtitle">Solar Products Importer</span>
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
          <button className="btn btn-primary btn-sm" type="button" onClick={() => handleNavigate('contact')}>
            Get quote
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
        </div>
      )}
    </header>
  );
}

function PartnerRibbon() {
  const basePath = `${import.meta.env.BASE_URL}partners/webp/`;

  const renderLogoSet = (hidden = false) => (
    <div className="partner-ribbon-set" aria-hidden={hidden}>
      {partnerLogos.map(([name, file]) => (
        <span className="partner-logo-pill" key={`${hidden ? 'repeat-' : ''}${name}`}>
          <img
            src={`${basePath}${file}`}
            alt={hidden ? '' : name}
            loading="eager"
            decoding="async"
            draggable="false"
          />
          <span>{name}</span>
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
  return (
    <div className="page-view home-view">
      <motion.section className="hero" style={{ '--hero-bg': `url(${heroImage})` }} {...revealMotion}>
        <div className="container hero-shell">
          <div className="hero-panel">
            <h1>Power, sized right.</h1>
            <p>Solar pumps, home systems, and field support for Ethiopia.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={() => onNavigate('products')}>
                View products
              <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => onNavigate('contact')}>
                Request sizing
              </button>
            </div>
            <PartnerRibbon />
          </div>
        </div>
      </motion.section>

      <motion.section className="container metrics-dock" aria-label="Company metrics" {...revealMotion}>
        {metrics.map(([value, label]) => (
          <div className="metric-tile" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </motion.section>

      <motion.section className="container capability-band" aria-label="Company strengths" {...revealMotion}>
        <div>
          <h2>Certified supply. Clean delivery.</h2>
        </div>
        <div className="capability-list">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div className="capability-item" key={item.label}>
                <Icon size={20} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="container showcase-section" aria-label="Featured solar products" {...revealMotion}>
        <div className="section-kicker">
          <h2>Product lines.</h2>
        </div>
        <div className="product-rail">
          {featuredProducts.map((item) => {
            const Icon = item.icon;
            return (
              <button className="product-rail-item" key={item.title} type="button" onClick={() => onNavigate('products')}>
                <img src={item.image} alt="" aria-hidden="true" loading="lazy" />
                <Icon size={28} />
                <span>{item.title}</span>
                <strong>{item.meta}</strong>
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="container works-section" aria-label="Previous works" {...revealMotion}>
        <div className="section-kicker">
          <h2>Field proof.</h2>
        </div>
        <div className="work-timeline">
          {previousWorks.map(([title, detail, image], index) => (
            <article className="work-row" key={title}>
              <img src={image} alt="" aria-hidden="true" loading="lazy" referrerPolicy="no-referrer" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section className="container operating-section" aria-label="Operating model" {...revealMotion}>
        <div className="operating-panel">
          <div>
            <h2>Clear from day one.</h2>
          </div>
          <div className="operating-steps">
            {operatingModel.map(([number, label]) => (
              <div key={label}>
                <span>{number}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="container prestige-cta" aria-label="Project call to action" {...revealMotion}>
        <div>
          <h2>Size first. Buy once.</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => onNavigate('contact')}>
          Start request
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
      <section className="page-hero" style={{ '--hero-bg': `url(${heroImage})` }}>
        <div className="container page-hero-inner">
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>
          {side}
        </div>
      </section>
      <section className="container page-content">{children}</section>
    </div>
  );
}

function AboutPage() {
  return (
    <PageShell
      page="about"
      side={
        <div className="signature-panel">
          <ShieldCheck size={26} />
          <strong>Reliable imports. Local support.</strong>
          <span>Focused on affordability, trust, and clean energy access.</span>
        </div>
      }
    >
      <div className="statement-grid">
        {['Customer centered', 'Quality first', 'Transparent trade', 'Rural impact'].map((item) => (
          <div className="soft-card compact" key={item}>
            <Check size={20} />
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <div className="timeline-band">
        <span>2016</span>
        <strong>Started importing off-grid solar products.</strong>
        <span>Now</span>
        <strong>Expanding pumps, home kits, and local assembly.</strong>
      </div>
    </PageShell>
  );
}

function ServicesPage() {
  return (
    <PageShell
      page="services"
      side={
        <div className="signature-panel yellow">
          <Zap size={26} />
          <strong>Fast path to working power.</strong>
          <span>Less paperwork. More field clarity.</span>
        </div>
      }
    >
      <div className="process-grid">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <article className="process-card" key={service.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Icon size={24} />
              <h2>{service.title}</h2>
              <p>{service.detail}</p>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}

function ProductsPage() {
  return (
    <PageShell
      page="products"
      side={
        <div className="signature-panel">
          <Award size={26} />
          <strong>Certified product focus.</strong>
          <span>Practical choices for tough environments.</span>
        </div>
      }
    >
      <div className="product-grid">
        {products.map(([name, detail, use, image]) => (
          <article className="product-card" key={name}>
            <img src={image} alt="" aria-hidden="true" loading="lazy" />
            <div>
              <span>{name}</span>
              <h2>{detail}</h2>
            </div>
            <p>{use}</p>
          </article>
        ))}
      </div>
      <div className="assembly-band">
        <Factory size={28} />
        <div>
          <strong>Local assembly initiative</strong>
          <span>Solar home systems and agricultural pumps, built closer to the communities they serve.</span>
        </div>
      </div>
    </PageShell>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
            <span>Addis Ababa, Gulele Sub City</span>
          </div>
          <div>
            <Phone size={20} />
            <span>+251 910691261</span>
          </div>
          <div>
            <Mail size={20} />
            <span>info@meseretmare.com</span>
          </div>
        </div>
      }
    >
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input required placeholder="Your name" />
          </label>
          <label>
            Phone
            <input required placeholder="+251..." type="tel" />
          </label>
        </div>
        <label>
          Need
          <select defaultValue="Solar pump">
            <option>Solar pump</option>
            <option>Home system</option>
            <option>Lighting</option>
            <option>Institutional project</option>
          </select>
        </label>
        <label>
          Details
          <textarea required rows="4" placeholder="Site, water depth, rooms, or project size." />
        </label>
        <button className="btn btn-primary" type="submit">
          {submitted ? (
            <>
              <Check size={17} />
              Sent
            </>
          ) : (
            <>
              <Send size={17} />
              Send request
            </>
          )}
        </button>
      </form>
    </PageShell>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">
            <img src={brandLogo} alt="" aria-hidden="true" />
            Meseret Mare
          </div>
          <p>Solar imports, pumps, home systems, and support for Ethiopia.</p>
        </div>
        <div className="footer-links">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
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
    case 'contact':
      return <ContactPage />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);

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
