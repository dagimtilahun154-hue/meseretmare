const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const productsFilePath = path.resolve(__dirname, '..', 'src', 'data', 'products.json');
const publicDataDir = path.resolve(__dirname, '..', 'public', 'data');
const publicUploadsDir = path.resolve(__dirname, '..', 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
}
if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Helper function to download a file
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
            fs.unlink(dest, () => {}); // Delete local file if error
            reject(err);
        });
    });
}

// Map of categories to fallback local images we already generated/have
const fallbackImages = {
    "Solar Pumps": "/uploads/solar-pump-redbud.png",
    "Home & Portable Lighting": "/uploads/solar-home-system.png",
    "Solar Home Systems": "/uploads/solar-home-system.png",
    "Solar Appliances": "/uploads/solar-sewing-machine-pack.jpg"
};

async function processProducts() {
    console.log("Starting image download and local referencing...");
    const products = data.products;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let imageUrl = product.image;

        if (imageUrl && imageUrl.startsWith('http')) {
            // Get file extension or default to .jpg
            let ext = path.extname(imageUrl.split('?')[0]) || '.jpg';
            if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext.toLowerCase())) {
                ext = '.jpg';
            }
            
            // Clean product name for filename
            const cleanName = product.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            const filename = `${cleanName}${ext}`;
            const destPath = path.join(publicUploadsDir, filename);
            const localUrl = `/uploads/${filename}`;

            try {
                console.log(`Downloading ${imageUrl} -> ${localUrl}`);
                await downloadFile(imageUrl, destPath);
                product.image = localUrl;
                console.log(`Successfully saved ${product.name} image.`);
            } catch (err) {
                console.error(`Failed to download image for ${product.name}: ${err.message}`);
                // Use fallback based on category
                product.image = fallbackImages[product.category] || "/uploads/solar-home-system.png";
                console.log(`Fell back to ${product.image} for ${product.name}`);
            }
        }
    }

    // Save back to both src/data/products.json and public/data/products.json
    fs.writeFileSync(path.join(publicDataDir, 'products.json'), JSON.stringify(data, null, 2), 'utf8');
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Finished processing products data.");
}

processProducts();
