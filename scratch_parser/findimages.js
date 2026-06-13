const fs = require('fs');
const html = fs.readFileSync('C:/Users/new/.gemini/antigravity-ide/brain/ec91d2fb-fc45-4e1c-9d72-291dedfab914/.system_generated/steps/136/content.md', 'utf8');
const re = /img\s+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["']/gi;
let m;
while ((m = re.exec(html)) !== null) {
  console.log(m[2] + ' => ' + m[1]);
}
