import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');
const reactAppDir = path.resolve(rootDir, 'react-app');
const adminDir = path.resolve(reactAppDir, 'DM154/admin');
const outputDir = path.resolve(rootDir, 'cpanel_package');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Assembling cPanel Production Deployment Package...');

// 1. Clean output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 2. Copy react-app dist files to root of cpanel_package
const reactDist = path.join(reactAppDir, 'dist');
if (fs.existsSync(reactDist)) {
  copyRecursiveSync(reactDist, outputDir);
  console.log('  ✓ React Frontend Dist copied to root');
} else {
  console.error('❌ Error: react-app/dist not found. Run npm run build first.');
}

// 3. Ensure subfolder .htaccess is in place
const subHtaccess = path.join(reactAppDir, 'public/.htaccess');
if (fs.existsSync(subHtaccess)) {
  fs.copyFileSync(subHtaccess, path.join(outputDir, '.htaccess'));
  console.log('  ✓ Subfolder .htaccess copied');
}

// 4. Create DM154 directory structure inside cpanel_package
const targetDm154 = path.join(outputDir, 'DM154');
fs.mkdirSync(targetDm154, { recursive: true });

// Copy DM154 PHP folders (api, config, core, data, uploads)
['api', 'config', 'core', 'data', 'uploads'].forEach((folder) => {
  const srcPath = path.join(reactAppDir, 'DM154', folder);
  const destPath = path.join(targetDm154, folder);
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath);
    console.log(`  ✓ DM154/${folder} copied`);
  }
});

// Ensure root uploads directory exists in cpanel_package
const rootUploadsDir = path.join(outputDir, 'uploads');
fs.mkdirSync(rootUploadsDir, { recursive: true });
const dm154UploadsSrc = path.join(reactAppDir, 'DM154', 'uploads');
if (fs.existsSync(dm154UploadsSrc)) {
  copyRecursiveSync(dm154UploadsSrc, rootUploadsDir);
}
console.log('  ✓ Main app uploads directory synced');

// Keep lock file if present so website is pre-configured and avoids setup wizard
const lockFile = path.join(targetDm154, 'config/installed.lock');
if (fs.existsSync(lockFile)) {
  console.log('  ✓ Preserved production install lock (pre-installed mode)');
} else {
  fs.writeFileSync(lockFile, new Date().toISOString(), 'utf8');
  console.log('  ✓ Created install lock for pre-configured setup');
}

// 5. Copy Admin panel dist to DM154/admin
const adminDist = path.join(adminDir, 'dist');
const targetAdmin = path.join(targetDm154, 'admin');
if (fs.existsSync(adminDist)) {
  copyRecursiveSync(adminDist, targetAdmin);
  console.log('  ✓ DM154 Admin Panel copied to DM154/admin');
} else {
  console.error('❌ Error: DM154/admin/dist not found. Run npm run build first.');
}

console.log('\n✅ cPanel Package Assembled Successfully in: ' + outputDir);
