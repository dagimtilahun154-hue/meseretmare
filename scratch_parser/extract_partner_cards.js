const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDir = 'C:/tmp/meseret-partners';

function clean(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#8243;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function srcFrom($img) {
  return $img.attr('data-src') || $img.attr('src') || '';
}

function redbud() {
  const $ = cheerio.load(fs.readFileSync(path.join(htmlDir, 'redbud.html'), 'utf8'));
  const products = [];
  $('.w-vwrapper.usg_vwrapper_1').each((_, card) => {
    const $card = $(card);
    const name = clean($card.find('.woocommerce-loop-product__title').first().text());
    const image = srcFrom($card.find('img.wp-post-image').first());
    if (name && image) products.push({ name, image });
  });
  return products;
}

function sunking() {
  const $ = cheerio.load(fs.readFileSync(path.join(htmlDir, 'sunking.html'), 'utf8'));
  const products = [];
  $('.card.card--product').each((_, card) => {
    const $card = $(card);
    const name = clean($card.find('.card-title').first().text());
    const image = srcFrom($card.find('img').first());
    const use = clean($card.find('.card-excerpt').first().text());
    if (name && image && !image.startsWith('data:')) products.push({ name, image, use });
  });
  return products;
}

function omni() {
  const html = fs.readFileSync(path.join(htmlDir, 'omni.html'), 'utf8');
  const productRe = /alt="([^"]+)"[^>]+src="(https:\/\/res\.cloudinary\.com\/oves\/image\/upload\/[^"]+)"/g;
  const products = [];
  const seen = new Set();
  let match;
  while ((match = productRe.exec(html))) {
    const name = clean(match[1]);
    const image = clean(match[2]);
    if (!name || seen.has(name) || /logo|omnivoltaic/i.test(name)) continue;
    seen.add(name);
    products.push({ name, image });
  }
  return products;
}

function dlight() {
  const html = fs.readFileSync(path.join(htmlDir, 'dlight.html'), 'utf8');
  const decoded = html.replace(/\\"/g, '"').replace(/\\\//g, '/');
  const products = [];
  const seen = new Set();

  const productRe = /"Name":"([^"]+)"/g;
  let match;
  while ((match = productRe.exec(decoded))) {
    const start = decoded.lastIndexOf('{"id":', match.index);
    if (start < 0) continue;

    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;
    for (let index = start; index < decoded.length; index += 1) {
      const char = decoded[index];
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = !inString;
      } else if (!inString && char === '{') {
        depth += 1;
      } else if (!inString && char === '}') {
        depth -= 1;
        if (depth === 0) {
          end = index + 1;
          break;
        }
      }
    }
    if (end < 0) continue;

    let product;
    try {
      product = JSON.parse(decoded.slice(start, end));
    } catch {
      continue;
    }

    const name = clean(product.Name);
    const use = clean(product.excerpt || product.category?.text);
    const image =
      product.featured_image?.formats?.large?.url ||
      product.featured_image?.formats?.medium?.url ||
      product.featured_image?.url ||
      product.detailedImage?.formats?.large?.url ||
      product.detailedImage?.url;
    if (!name || !image || seen.has(name)) continue;
    if (!/^https:\/\/d2a18w1f2socv6\.cloudfront\.net\/.+\.(png|jpe?g|webp)$/i.test(image)) continue;
    seen.add(name);
    products.push({ name, image: clean(image), use });
  }

  return products;
}

function difful() {
  const files = fs.existsSync(path.join(htmlDir, 'difful-cats'))
    ? fs.readdirSync(path.join(htmlDir, 'difful-cats')).map((file) => path.join(htmlDir, 'difful-cats', file))
    : [path.join(htmlDir, 'difful.html')];
  const products = [];
  const seen = new Set();
  for (const file of files) {
    const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
    $('.mod-content-productlistdf .list-item, .list-item').each((_, card) => {
      const $card = $(card);
      const name = clean($card.find('.product-title a, .pro-name, a').first().text() || $card.find('img').first().attr('alt'));
      const href = clean($card.find('.product-title a, a').first().attr('href') || '');
      const image = srcFrom($card.find('.pic img, img').first());
      if (!name || !image || seen.has(name)) return;
      seen.add(name);
      products.push({ name, image: new URL(image, 'https://www.diffulpump.com/products-list.htm').toString(), href });
    });
  }
  return products;
}

const payload = { redbud: redbud(), difful: difful(), sunking: sunking(), omni: omni(), dlight: dlight() };
const outputPath = path.join(__dirname, 'partner_cards.json');
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(outputPath);
