const fs = require('fs');
const html = fs.readFileSync('C:/Users/new/.gemini/antigravity-ide/brain/ec91d2fb-fc45-4e1c-9d72-291dedfab914/.system_generated/steps/34/content.md', 'utf8');
const re = /img\s+[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/gi;
let m;
let seen = new Set();
while ((m = re.exec(html)) !== null) {
  const url = m[1];
  const alt = m[2] || '';
  if (!seen.has(url) && url.includes('http')) {
    seen.add(url);
    console.log((alt || 'no-alt') + ' => ' + url);
  }
}
