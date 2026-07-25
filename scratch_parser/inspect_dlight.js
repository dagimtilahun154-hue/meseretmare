const fs = require('fs');

const html = fs.readFileSync('C:/tmp/meseret-partners/dlight.html', 'utf8');
for (const term of ['Name', 'A2', 'X2000 Pro', 'T500R']) {
  const index = html.indexOf(term);
  console.log(`\n${term}: ${index}`);
  console.log(html.slice(Math.max(0, index - 200), index + 2200));
}
