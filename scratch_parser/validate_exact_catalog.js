const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8'));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/products.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'partner_image_manifest.json'), 'utf8'));
const manifestTargets = new Map(manifest.map((entry) => [path.normalize(entry.target), entry]));

const errors = [];
if (JSON.stringify(src) !== JSON.stringify(pub)) errors.push('src/public product JSON files differ');

const images = new Map();
for (const product of src.products || []) {
  if (!product.image.startsWith('/images/')) errors.push(`${product.name}: image is not local`);
  if (/^https?:\/\//i.test(product.image)) errors.push(`${product.name}: external image URL`);
  const abs = path.join(ROOT, 'public', product.image.replace(/^\//, ''));
  if (!fs.existsSync(abs)) {
    errors.push(`${product.name}: missing ${product.image}`);
  } else {
    const size = fs.statSync(abs).size;
    if (size < 3000) errors.push(`${product.name}: suspiciously small image ${product.image} (${size} bytes)`);
  }
  const norm = path.normalize(abs);
  if (!manifestTargets.has(norm)) errors.push(`${product.name}: no exact source manifest entry for ${product.image}`);
  images.set(product.image, (images.get(product.image) || 0) + 1);
}

for (const [image, count] of images) {
  if (count > 1) errors.push(`duplicate local image reference ${image} used ${count} times`);
}

console.log(JSON.stringify({
  products: src.products.length,
  images: images.size,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
