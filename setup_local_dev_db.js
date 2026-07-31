import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const configPath = path.join(process.cwd(), 'DM154/config/config.php');

// Local XAMPP MySQL configuration for testing
const localConfig = `<?php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'meseret_test_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
define('UPLOAD_DIR', __DIR__ . '/../../uploads/');
define('UPLOAD_URL', '/uploads/');
define('JWT_SECRET', 'meseret_solar_secret_key_2026_safe');
function set_cors_headers() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
}
`;

fs.writeFileSync(configPath, localConfig, 'utf8');

// Bootstrap & update news #1
const testScript = path.join(process.cwd(), 'bootstrap_test.php');
fs.writeFileSync(testScript, `<?php
require_once __DIR__ . '/DM154/core/db.php';
$pdo = Database::getConnection();

// Seed initial news by querying news.php
require_once __DIR__ . '/DM154/api/news.php';
`, 'utf8');

try {
  execSync('C:\\xampp\\php\\php.exe bootstrap_test.php');
} catch (e) {}

if (fs.existsSync(testScript)) fs.unlinkSync(testScript);

console.log('Local dev test database setup complete.');
