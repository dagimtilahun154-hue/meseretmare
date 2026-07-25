const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const publicImagesDir = path.join(rootDir, 'public', 'images');
const publicUploadsDir = path.join(rootDir, 'public', 'uploads');
const publicPartnersDir = path.join(rootDir, 'public', 'partners');
const publicPartnersWebpDir = path.join(rootDir, 'public', 'partners', 'webp');
const dataDir = path.join(rootDir, 'src', 'data');
const publicDataDir = path.join(rootDir, 'public', 'data');

// Ensure directories exist
if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}
if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
}

// Helper function to download an image
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

// Copy local files
function copyDirFiles(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);
        if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied: ${file} -> public/images/`);
        }
    }
}

async function runConsolidation() {
    console.log("Consolidating local image directories...");
    copyDirFiles(publicUploadsDir, publicImagesDir);
    copyDirFiles(publicPartnersDir, publicImagesDir);
    copyDirFiles(publicPartnersWebpDir, publicImagesDir);

    // 1. Process site.json
    console.log("Processing site.json...");
    const sitePath = path.join(dataDir, 'site.json');
    if (fs.existsSync(sitePath)) {
        let site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
        if (site.brand && site.brand.logo) {
            site.brand.logo = `/images/${path.basename(site.brand.logo)}`;
        }
        if (site.media) {
            for (const key in site.media) {
                site.media[key] = `/images/${path.basename(site.media[key])}`;
            }
        }
        if (site.partner_logos) {
            site.partner_logos = site.partner_logos.map(partner => ({
                ...partner,
                logo: `/images/${path.basename(partner.logo)}`
            }));
        }
        fs.writeFileSync(sitePath, JSON.stringify(site, null, 2), 'utf8');
        fs.writeFileSync(path.join(publicDataDir, 'site.json'), JSON.stringify(site, null, 2), 'utf8');
    }

    // 2. Process homepage.json
    console.log("Processing homepage.json...");
    const homePath = path.join(dataDir, 'homepage.json');
    if (fs.existsSync(homePath)) {
        let home = JSON.parse(fs.readFileSync(homePath, 'utf8'));
        if (home.field_proof && home.field_proof.items) {
            home.field_proof.items = home.field_proof.items.map(item => ({
                ...item,
                image: `/images/${path.basename(item.image)}`
            }));
        }
        if (home.featured && home.featured.items) {
            home.featured.items = home.featured.items.map(item => ({
                ...item,
                image: `/images/${path.basename(item.image)}`
            }));
        }
        fs.writeFileSync(homePath, JSON.stringify(home, null, 2), 'utf8');
        fs.writeFileSync(path.join(publicDataDir, 'homepage.json'), JSON.stringify(home, null, 2), 'utf8');
    }

    // 3. Process products.json
    console.log("Processing products.json...");
    const productsPath = path.join(dataDir, 'products.json');
    if (fs.existsSync(productsPath)) {
        let productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        productsData.products = productsData.products.map(p => ({
            ...p,
            image: p.image.startsWith('http') ? p.image : `/images/${path.basename(p.image)}`
        }));
        fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), 'utf8');
        fs.writeFileSync(path.join(publicDataDir, 'products.json'), JSON.stringify(productsData, null, 2), 'utf8');
    }

    // 4. Process featured.json
    console.log("Processing featured.json...");
    const featuredPath = path.join(dataDir, 'featured.json');
    if (fs.existsSync(featuredPath)) {
        let featured = JSON.parse(fs.readFileSync(featuredPath, 'utf8'));
        if (featured.featured) {
            featured.featured = featured.featured.map(f => ({
                ...f,
                image: `/images/${path.basename(f.image)}`
            }));
        }
        fs.writeFileSync(featuredPath, JSON.stringify(featured, null, 2), 'utf8');
        fs.writeFileSync(path.join(publicDataDir, 'featured.json'), JSON.stringify(featured, null, 2), 'utf8');
    }

    // 5. Process news.json (and download external images)
    console.log("Processing news.json & downloading external images...");
    const newsPath = path.join(dataDir, 'news.json');
    if (fs.existsSync(newsPath)) {
        let newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
        for (let i = 0; i < newsData.posts.length; i++) {
            const post = newsData.posts[i];
            if (post.image && post.image.startsWith('http')) {
                let ext = path.extname(post.image.split('?')[0]) || '.jpg';
                const cleanTitle = post.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                const filename = `news-${cleanTitle}${ext}`;
                const destPath = path.join(publicImagesDir, filename);
                const localUrl = `/images/${filename}`;

                try {
                    console.log(`Downloading news image: ${post.image} -> ${localUrl}`);
                    await downloadFile(post.image, destPath);
                    post.image = localUrl;
                } catch (err) {
                    console.error(`Failed to download news image: ${err.message}. Using fallback.`);
                    post.image = '/images/hero-solar-field.png'; // Fallback
                }
            } else if (post.image) {
                post.image = `/images/${path.basename(post.image)}`;
            }
        }
        fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2), 'utf8');
        fs.writeFileSync(path.join(publicDataDir, 'news.json'), JSON.stringify(newsData, null, 2), 'utf8');
    }

    console.log("Image consolidation complete!");
}

runConsolidation();
