import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'src', 'data');
const publicDir = path.join(projectRoot, 'public', 'data');

await fs.mkdir(publicDir, { recursive: true });

const entries = await fs.readdir(sourceDir, { withFileTypes: true });
const copied = [];

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.json')) {
    continue;
  }

  if (entry.name === 'extracted_products.json') {
    continue;
  }

  const sourcePath = path.join(sourceDir, entry.name);
  const destinationPath = path.join(publicDir, entry.name);
  await fs.copyFile(sourcePath, destinationPath);
  copied.push(entry.name);
}

process.stdout.write(`Synced ${copied.length} data files to public/data\n`);
