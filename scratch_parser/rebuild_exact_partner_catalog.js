const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'partner_cards.json'), 'utf8'));

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/["]/g, ' inch ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function uniqueByImage(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.image || seen.has(item.image)) return false;
    seen.add(item.image);
    return true;
  });
}

function modelFromName(name) {
  const first = clean(name).split(/\s+/)[0] || clean(name);
  return first.replace(/[()]/g, '');
}

function categoryForDlight(use) {
  if (/lantern/i.test(use)) return 'Home & Portable Lighting';
  if (/inverter/i.test(use)) return 'Solar Appliances';
  return 'Solar Home Systems';
}

function product({ partner, name, image, category, use, details, features, specs, model }) {
  const safeName = clean(name);
  return {
    name: safeName,
    model: clean(model || modelFromName(safeName)),
    category,
    use,
    details,
    image: `/images/${partner}-${slugify(safeName)}.webp`,
    features,
    specs,
    sourceImage: image,
  };
}

const redbud = uniqueByImage(cards.redbud).slice(0, 9).map((item) =>
  product({
    partner: 'redbud',
    ...item,
    category: 'Solar Pumps',
    use: 'Solar water pumping for wells, irrigation, livestock watering, and off-grid water supply.',
    details: `${item.name} is imported from Redbud's solar pump range and listed for field-ready water access projects where local service and correct sizing matter.`,
    features: ['Brushless solar pump design', 'Off-grid water pumping', 'Suitable for irrigation and household supply'],
    specs: ['Solar pump series', 'Local image stored as WebP', 'Partner source: Redbud Pumps'],
  }),
);

const difful = uniqueByImage(cards.difful).slice(0, 10).map((item) => {
  const parts = item.name.split('|').map(clean).filter(Boolean);
  const displayName = parts[0] || item.name;
  return product({
    partner: 'difful',
    ...item,
    name: displayName,
    category: 'Solar Pumps',
    use: parts.slice(1, 3).join(' for ') || 'Solar water pumping for farms, boreholes, and household water supply.',
    details: `${displayName} is matched to Difful's source product card. ${parts.length > 1 ? `Source notes: ${parts.slice(1).join('; ')}.` : 'Configured for solar-powered water delivery.'}`,
    features: ['Solar-powered water pumping', 'Agricultural and household supply options', 'Partner-matched product image'],
    specs: [...parts.slice(1, 4), 'Partner source: Difful Pump'].filter(Boolean),
    model: parts[1] || modelFromName(displayName),
  });
});

const sunking = uniqueByImage(cards.sunking).map((item) =>
  product({
    partner: 'sunking',
    ...item,
    category: /fan/i.test(item.name) ? 'Solar Appliances' : 'Solar Home Systems',
    use: item.use || 'Solar home power and appliance package for off-grid households.',
    details: `${item.name} is listed from Sun King's home systems and appliances range with its source product image stored locally.`,
    features: ['Solar home energy package', 'Household lighting and appliance support', 'Partner-matched product image'],
    specs: ['Pay-as-you-go ready where available', 'Partner source: Sun King'],
  }),
);

const omni = uniqueByImage(cards.omni).slice(0, 10).map((item) =>
  product({
    partner: 'omnivoltaic',
    ...item,
    category: 'Solar Mobility',
    use: /CHG|Rack|Qix|Cabinet/i.test(item.name)
      ? 'Electric mobility charging and battery infrastructure.'
      : 'Electric mobility product for clean transport programs.',
    details: `${item.name} is imported from OmniVoltaic's mobility product lineup and paired with the exact source product image.`,
    features: ['Electric mobility ecosystem product', 'Designed for clean transport deployment', 'Partner-matched product image'],
    specs: ['Mobility product line', 'Partner source: OmniVoltaic'],
  }),
);

const dlight = uniqueByImage(cards.dlight)
  .filter((item) => !/T500R/i.test(item.name) || /t500/i.test(item.image))
  .slice(0, 10)
  .map((item) =>
    product({
      partner: 'dlight',
      ...item,
      category: categoryForDlight(item.use),
      use: item.use || 'Off-grid solar product for household energy access.',
      details: `${item.name} is imported from d.light's product catalog with its exact source product image stored locally for CMS editing.`,
      features: ['Off-grid solar energy product', 'Household-ready design', 'Partner-matched product image'],
      specs: [item.use, 'Partner source: d.light'].filter(Boolean),
    }),
  );

const products = [...redbud, ...difful, ...sunking, ...omni, ...dlight];
const imagePathCounts = new Map();
for (const item of products) {
  const count = imagePathCounts.get(item.image) || 0;
  imagePathCounts.set(item.image, count + 1);
  if (count > 0) {
    item.image = item.image.replace(/\.webp$/, `-${count + 1}.webp`);
  }
}
const manifest = products.map((item) => ({
  name: item.name,
  source: item.sourceImage,
  target: path.join(ROOT, item.image.replace(/^\//, 'public/')),
}));
const payload = { products: products.map(({ sourceImage, ...item }) => item) };

for (const file of ['src/data/products.json', 'public/data/products.json']) {
  fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}
fs.writeFileSync(path.join(__dirname, 'partner_image_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const byPartner = products.reduce((acc, item) => {
  const prefix = item.image.split('/').pop().split('-')[0];
  acc[prefix] = (acc[prefix] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ count: products.length, byPartner }, null, 2));
