const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = path.resolve(__dirname, '..');
const htmlDir = 'C:/tmp/meseret-partners';
const imagesDir = path.join(rootDir, 'public', 'images');
const srcProductsPath = path.join(rootDir, 'src', 'data', 'products.json');
const publicProductsPath = path.join(rootDir, 'public', 'data', 'products.json');

const partnerProducts = [
  {
    partner: 'Redbud',
    sourceKey: 'redbud',
    products: [
      ['SDC Brushless Solar Pump', 'SDC Series', 'Solar Pumps', 'Stainless steel deep-well solar pump for irrigation and rural water supply.', ['Brushless DC motor', 'Stainless steel pump body', 'Designed for deep wells'], ['Solar powered', 'Deep well', 'DC brushless']],
      ['SPC Brushless Solar Pump', 'SPC Series', 'Solar Pumps', 'High-performance solar pump for farm water transfer and agricultural irrigation.', ['Brushless DC motor', 'High flow operation', 'Durable field-ready design'], ['Solar powered', 'Surface or borehole use', 'High flow']],
      ['Screw Solar Pump', 'Screw Series', 'Solar Pumps', 'Solar screw pump for steady water delivery from boreholes and remote sources.', ['Positive displacement screw design', 'Reliable low-speed pumping', 'Off-grid operation'], ['Solar pump', 'Borehole use', 'Low maintenance']],
      ['AC/DC Solar Pump', 'Hybrid Series', 'Solar Pumps', 'Hybrid solar pump that can operate from solar DC power or AC backup power.', ['AC/DC input support', 'Flexible power options', 'Irrigation ready'], ['Hybrid input', 'Solar and grid/generator compatible']],
      ['3 Inch Solar Pump', '3 Inch Series', 'Solar Pumps', 'Compact solar pump for narrow boreholes and household water lifting.', ['Slim borehole profile', 'Efficient solar operation', 'Compact installation'], ['3 inch', 'Solar powered', 'Borehole pump']],
      ['4 Inch Solar Pump', '4 Inch Series', 'Solar Pumps', 'General-purpose borehole solar pump for farms, homes, and community systems.', ['Deep well compatible', 'Solar direct drive', 'Rugged pump construction'], ['4 inch', 'Solar powered', 'Deep well']],
      ['6 Inch Solar Pump', '6 Inch Series', 'Solar Pumps', 'Larger borehole solar pump for higher-volume water supply projects.', ['High-volume pumping', 'Industrial-grade borehole format', 'Solar operation'], ['6 inch', 'High flow', 'Borehole pump']],
      ['Submersible Solar Pump', 'Submersible Series', 'Solar Pumps', 'Submersible solar water pump for boreholes, wells, and irrigation reservoirs.', ['Submersible design', 'Reliable water lifting', 'Off-grid capable'], ['Solar powered', 'Submersible', 'Water supply']],
      ['Surface Solar Pump', 'Surface Series', 'Solar Pumps', 'Surface solar pump for rivers, ponds, shallow wells, and water transfer.', ['Surface-mounted design', 'Easy service access', 'Farm water transfer'], ['Solar powered', 'Surface pump', 'Irrigation']],
      ['Solar Pump Controller', 'Controller Series', 'Solar Pumps', 'Solar pump controller for managing pump performance and protecting field systems.', ['Pump protection controls', 'Solar input management', 'System monitoring support'], ['Controller', 'Solar pump accessory']]
    ]
  },
  {
    partner: 'Difful',
    sourceKey: 'difful',
    products: [
      ['Difful Submersible Solar Pump', '1500W 110V DC Motor', 'Solar Pumps', 'Deep-well solar pump for borehole water supply and irrigation.', ['Brushless DC motor', 'Submersible pump body', 'High-efficiency solar pumping'], ['1500W', '110V DC', '2HP']],
      ['Difful Surface Solar Pump', 'Surface Water Pump', 'Solar Pumps', 'Surface pump for shallow wells, rivers, ponds, and tank filling.', ['Easy maintenance', 'Durable build', 'Battery-free operation'], ['Surface mount', 'High flow rate']],
      ['Difful DC Surface Pump', 'DC Brushless', 'Solar Pumps', 'DC brushless surface pump for off-grid water transfer systems.', ['DC brushless motor', 'Surface-mounted design', 'Solar direct operation'], ['Solar pump', 'Off-grid']],
      ['Difful Solar Pool Pump', 'Pool Series', 'Solar Pumps', 'Solar-powered circulation pump for pools and water treatment applications.', ['Pool circulation', 'Low-noise operation', 'Solar energy use'], ['Solar pump', 'Pool rated']],
      ['Difful Solar Irrigation Pump', 'Ag Series', 'Solar Pumps', 'Agricultural solar pump for irrigation, greenhouses, and livestock water.', ['Irrigation focused', 'High capacity', 'Farm-ready construction'], ['Solar pump', 'Agriculture']],
      ['Difful High-Flow Surface Pump', 'Flow Series', 'Solar Pumps', 'High-flow surface solar pump for larger water transfer needs.', ['High flow rate', 'Surface mount', 'Heavy-duty pumping'], ['Solar pump', 'Industrial']],
      ['AC/DC Hybrid Solar Pump', 'Hybrid Series', 'Solar Pumps', 'Hybrid water pump that supports solar DC and AC backup power.', ['AC/DC hybrid', 'Flexible power source', 'Reliable water delivery'], ['Solar/Grid', 'Dual input']],
      ['High Speed Deep Well Pump', 'Deep Well Series', 'Solar Pumps', 'High-speed deep-well pump for boreholes and high-lift applications.', ['High-speed pumping', 'Deep well rated', 'Efficient lift performance'], ['200m depth', 'Solar powered']],
      ['Difful Solar Pump Inverter', 'Inverter Series', 'Solar Pumps', 'Solar pump inverter for controlling motor speed and protecting pump systems.', ['Variable speed control', 'Pump protection', 'Solar input optimization'], ['Pump inverter', 'Solar drive']],
      ['Difful Stainless Steel Solar Pump', 'Stainless Series', 'Solar Pumps', 'Stainless steel solar pump for clean water supply and long field life.', ['Stainless steel construction', 'Corrosion resistance', 'Reliable DC motor'], ['Solar powered', 'Stainless steel']]
    ]
  },
  {
    partner: 'OmniVoltaic',
    sourceKey: 'omni',
    products: [
      ['OV Pilot Electric Motorcycle', 'Pilot Series', 'Solar Mobility', 'Electric motorcycle platform for clean mobility and productive transport.', ['Electric drivetrain', 'Low operating cost', 'Urban and peri-urban mobility'], ['Electric motorcycle', 'Rechargeable battery']],
      ['OV Cargo Electric Motorcycle', 'Cargo Series', 'Solar Mobility', 'Electric cargo motorcycle for deliveries, trade routes, and field operations.', ['Cargo-ready frame', 'Battery electric operation', 'Business transport use'], ['Electric mobility', 'Cargo transport']],
      ['OV Electric Three Wheeler', 'Three Wheeler', 'Solar Mobility', 'Electric three-wheeler for passenger and goods transport.', ['Three-wheel stability', 'Rechargeable power system', 'Commercial mobility'], ['Electric vehicle', 'Three wheeler']],
      ['OV Battery Pack', 'Lithium Battery', 'Solar Mobility', 'Rechargeable battery pack for electric mobility and off-grid energy systems.', ['Lithium battery storage', 'Swappable energy support', 'Designed for mobility'], ['Battery pack', 'Rechargeable']],
      ['OV Mobility Charger', 'EV Charger', 'Solar Mobility', 'Charging unit for electric mobility fleets and off-grid energy hubs.', ['EV charging support', 'Fleet-ready operation', 'Energy hub compatible'], ['Charger', 'Electric mobility']],
      ['OV Solar Charging Station', 'Charging Station', 'Solar Mobility', 'Solar-supported charging station for electric mobility businesses.', ['Solar charging support', 'Multi-user charging', 'Productive-use energy service'], ['Solar charging', 'Mobility station']],
      ['OV Fleet Energy Kit', 'Fleet Kit', 'Solar Mobility', 'Energy kit for operating small electric mobility fleets.', ['Fleet charging support', 'Battery management', 'Business-ready configuration'], ['Fleet energy', 'Electric transport']],
      ['OV E-Mobility Service Kit', 'Service Kit', 'Solar Mobility', 'Service and support kit for maintaining electric mobility products.', ['Maintenance support', 'Field service tools', 'Mobility operations'], ['Service kit', 'E-mobility']],
      ['OV Productive Mobility Bundle', 'Business Bundle', 'Solar Mobility', 'Mobility bundle for income-generating clean transport services.', ['Business transport package', 'Rechargeable platform', 'Low fuel dependence'], ['Mobility bundle', 'Productive use']],
      ['OV Off-Grid Mobility System', 'Off-Grid System', 'Solar Mobility', 'Off-grid electric mobility system for areas with limited grid access.', ['Off-grid charging support', 'Clean transport', 'Solar compatible'], ['Off-grid', 'Electric mobility']]
    ]
  },
  {
    partner: 'Sun King',
    sourceKey: 'sunking',
    products: [
      ['Sun King Home 120', 'Solar Home System', 'Solar Home Systems', 'Solar home lighting system with inbuilt battery and USB charging.', ['Inbuilt battery', 'Ceiling lights', 'USB phone charging'], ['Multi-light', 'Phone charging']],
      ['Sun King HomePlus', 'HomePlus', 'Solar Home Systems', 'Complete solar home system for reliable multi-room lighting.', ['Reliable lighting', 'Solar charging', 'Expandable household use'], ['Home system', 'Multi-room']],
      ['Sun King HomePlus Pro', 'HomePlus Pro', 'Solar Home Systems', 'Advanced solar home system with longer runtime for family use.', ['Advanced system package', 'Extended battery support', 'Multiple lights'], ['Home system', 'Pro grade']],
      ['Sun King HomePlus Max', 'HomePlus Max', 'Solar Home Systems', 'Higher-capacity solar home system for larger households.', ['Max capacity', 'Large panel support', 'Household power package'], ['Home system', 'Max power']],
      ['Sun King HomePlus Max + 24" TV', 'TV Bundle 24"', 'Solar Home Systems', 'Solar home system bundled with an efficient 24-inch television.', ['Includes 24-inch TV', 'Solar charging', 'Lighting and entertainment'], ['Home system', 'TV bundle']],
      ['Sun King Boom', 'Boom', 'Home & Portable Lighting', 'Portable solar light with phone charging for home and travel.', ['Portable lighting', 'Phone charging', 'Durable design'], ['Solar rechargeable', 'Portable']],
      ['Sun King Pro', 'Pro', 'Home & Portable Lighting', 'Solar lantern for brighter rooms, study lighting, and phone charging.', ['Bright LED light', 'Phone charging', 'Portable handle'], ['Solar lantern', 'USB output']],
      ['Sun King Pico Plus', 'Pico Plus', 'Home & Portable Lighting', 'Compact solar lantern for study, emergency, and household lighting.', ['Compact lantern', 'Solar rechargeable', 'Everyday lighting'], ['Portable', 'LED']],
      ['Sun King Home 60', 'Home 60', 'Solar Home Systems', 'Entry solar home system for lighting essential rooms and charging phones.', ['Entry home system', 'Multi-light support', 'USB charging'], ['Solar home system', 'Phone charging']],
      ['Sun King Solar Fan', 'Fan', 'Solar Appliances', 'Efficient solar-powered fan for household comfort in off-grid homes.', ['Low-power fan', 'Solar compatible', 'Household appliance'], ['Solar appliance', 'Fan']]
    ]
  },
  {
    partner: 'd.light',
    sourceKey: 'dlight',
    products: [
      ['S500 Solar Light', 'S500', 'Home & Portable Lighting', 'Portable solar light for homes, reading, and emergency use.', ['Multi-purpose lighting', 'Bright LED', 'Portable design'], ['Solar rechargeable']],
      ['S200 Solar Light', 'S200', 'Home & Portable Lighting', 'Compact solar light for daily household lighting and charging needs.', ['Compact design', 'Long battery life', 'Easy solar charging'], ['Integrated panel']],
      ['S3 Portable Solar Lantern', 'S3', 'Home & Portable Lighting', 'Study lamp and emergency solar light for portable use.', ['Study friendly', 'Emergency lighting', 'Lightweight body'], ['Compact', 'Lightweight']],
      ['T200 Portable Solar Lantern', 'T200', 'Home & Portable Lighting', 'Portable lantern and phone charger for camping and household use.', ['Camping ready', 'Phone charger', 'Solar rechargeable'], ['Solar rechargeable']],
      ['T200R Portable Solar Lantern', 'T200R', 'Home & Portable Lighting', 'Dual light and mobile charging in one compact product.', ['Mobile phone charging', 'Dual light modes', 'Portable design'], ['USB output', 'Portable']],
      ['d.light X850', 'X850', 'Solar Home Systems', 'Solar home system for lighting, phone charging, and household power.', ['Multiple lights', 'Phone charging', 'Expandable home use'], ['Solar home system', 'Household power']],
      ['d.light X1000', 'X1000', 'Solar Home Systems', 'Larger solar home system package for lighting and productive household use.', ['High-capacity home package', 'Multiple appliances support', 'Solar charging'], ['Solar home system', 'High capacity']],
      ['d.light X2000', 'X2000', 'Solar Home Systems', 'Premium solar home system designed for larger off-grid energy needs.', ['Premium system package', 'Large battery support', 'Multi-room energy'], ['Solar home system', 'Premium']],
      ['d.light Solar TV', 'TV Bundle', 'Solar Home Systems', 'Efficient solar television package for off-grid household entertainment.', ['Efficient DC TV', 'Solar compatible', 'Household entertainment'], ['TV bundle', 'Solar powered']],
      ['d.light Solar Fan', 'Fan', 'Solar Appliances', 'Energy-efficient fan designed for solar home system use.', ['Efficient motor', 'Solar home compatible', 'Comfort appliance'], ['Solar appliance', 'Fan']]
    ]
  }
];

function slugify(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function absoluteUrl(url, base) {
  if (!url) return '';
  try {
    return new URL(url, base).toString();
  } catch {
    return '';
  }
}

function srcFromSrcset(srcset) {
  if (!srcset) return '';
  return srcset.split(',').map(item => item.trim().split(/\s+/)[0]).filter(Boolean).pop() || '';
}

function collectImages(sourceKey) {
  const filePath = path.join(htmlDir, `${sourceKey}.html`);
  if (!fs.existsSync(filePath)) return [];
  const baseBySource = {
    redbud: 'https://redbudpumps.com/product-category/solar-pump/',
    difful: 'https://www.diffulpump.com/products-list.htm',
    omni: 'https://omnivoltaic.com/mobility/products/',
    sunking: 'https://sunking.com/solar-home-systems-and-appliances/',
    dlight: 'https://www.dlight.com/products'
  };
  const $ = cheerio.load(fs.readFileSync(filePath, 'utf8'));
  const images = [];
  $('img').each((_, img) => {
    const $img = $(img);
    const src = $img.attr('data-src') || $img.attr('data-lazy-src') || srcFromSrcset($img.attr('srcset') || $img.attr('data-srcset')) || $img.attr('src');
    const abs = absoluteUrl(src, baseBySource[sourceKey]);
    const alt = ($img.attr('alt') || $img.attr('title') || '').replace(/\s+/g, ' ').trim();
    if (!abs || abs.startsWith('data:')) return;
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(abs)) return;
    if (/logo|icon|avatar|placeholder|spinner|payment|flag|\/IN\.svg|\/US\.svg/i.test(abs + ' ' + alt)) return;
    images.push({ url: abs, alt });
  });
  return images;
}

function chooseImage(product, images) {
  const terms = [product.name, product.model]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !['solar', 'pump', 'home', 'system', 'series', 'portable'].includes(word));
  let best = null;
  let bestScore = -1;
  for (const image of images) {
    const haystack = `${image.url} ${image.alt}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    if (score > bestScore) {
      best = image;
      bestScore = score;
    }
  }
  return best && bestScore > 0 ? best.url : images[0]?.url || '';
}

function normalizeKey(product) {
  return `${slugify(product.name)}|${slugify(product.model || '')}`;
}

const imagesBySource = Object.fromEntries(partnerProducts.map(group => [group.sourceKey, collectImages(group.sourceKey)]));
const existingData = JSON.parse(fs.readFileSync(srcProductsPath, 'utf8'));
const productMap = new Map();

for (const product of existingData.products || []) {
  productMap.set(normalizeKey(product), product);
}

for (const group of partnerProducts) {
  const images = imagesBySource[group.sourceKey] || [];
  for (const row of group.products) {
    const product = {
      name: row[0],
      model: row[1],
      category: row[2],
      use: row[3],
      details: `${row[0]} is included in Meseret Mare's partner-sourced catalog for reliable solar access in Ethiopian homes, farms, and businesses. The product is selected for practical field use, serviceability, and compatibility with off-grid energy needs.`,
      image: `/images/${slugify(group.partner)}-${slugify(row[0])}.webp`,
      features: row[4],
      specs: row[5],
      _sourceImage: chooseImage({ name: row[0], model: row[1] }, images)
    };
    productMap.set(normalizeKey(product), product);
  }
}

const products = Array.from(productMap.values()).map(product => {
  const copy = { ...product };
  delete copy._sourceImage;
  return copy;
});

const ordered = products.sort((a, b) => {
  const categoryCompare = String(a.category).localeCompare(String(b.category));
  return categoryCompare || String(a.name).localeCompare(String(b.name));
});

const payload = { products: ordered };
fs.writeFileSync(srcProductsPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(publicProductsPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const imageManifest = [];
for (const group of partnerProducts) {
  for (const row of group.products) {
    const product = productMap.get(`${slugify(row[0])}|${slugify(row[1])}`);
    if (product && product._sourceImage) {
      imageManifest.push({
        name: product.name,
        source: product._sourceImage,
        target: path.join(imagesDir, `${slugify(group.partner)}-${slugify(product.name)}.webp`)
      });
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'partner_image_manifest.json'), `${JSON.stringify(imageManifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${ordered.length} products and ${imageManifest.length} image download entries.`);
for (const [source, images] of Object.entries(imagesBySource)) {
  console.log(`${source}: ${images.length} candidate images`);
}
