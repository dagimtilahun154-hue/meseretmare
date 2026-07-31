<?php
require_once __DIR__ . '/../config/config.php';

set_cors_headers();
header('Content-Type: application/json');

$lockFile = __DIR__ . '/../config/installed.lock';
$action = $_GET['action'] ?? 'status';

// Check installation status
if ($action === 'status') {
    if (!file_exists($lockFile)) {
        echo json_encode([
            'installed' => false,
            'message' => 'cPanel Database configuration required. Please run setup wizard.'
        ]);
        exit();
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 4
        ]);
        
        // Verify tables exist
        $tables = $pdo->query("SHOW TABLES LIKE 'admin_users'")->fetchAll();
        if (count($tables) === 0) {
            echo json_encode(['installed' => false, 'message' => 'cPanel Database tables missing. Setup required.']);
            exit();
        }

        echo json_encode(['installed' => true, 'database' => DB_NAME, 'host' => DB_HOST]);
        exit();
    } catch (Exception $e) {
        echo json_encode([
            'installed' => false,
            'error' => $e->getMessage(),
            'message' => 'cPanel Database connection failed. Setup required.'
        ]);
        exit();
    }
}

// Reset configuration (Protected: blocked if already installed for security)
if ($action === 'reset') {
    if (file_exists($lockFile)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Forbidden: System is already installed. Reset is disabled for production security.'
        ]);
        exit();
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $pdo->exec("DROP TABLE IF EXISTS `page_views`, `contact_messages`, `news`, `products`, `page_sections`, `admin_users`");
    } catch (Exception $e) {
        // ignore drop error
    }

    echo json_encode([
        'success' => true,
        'message' => 'Configuration & database tables reset successfully. Ready for clean installation!'
    ]);
    exit();
}

// Execute setup installer tailored for cPanel with FULL DATA SEEDING
if ($action === 'setup' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $dbHost = trim($data['db_host'] ?? 'localhost');
    $dbPort = trim($data['db_port'] ?? '3306');
    $dbName = trim($data['db_name'] ?? '');
    $dbUser = trim($data['db_user'] ?? '');
    $dbPass = trim($data['db_pass'] ?? '');
    
    $adminUser = trim($data['admin_user'] ?? 'admin');
    $adminEmail = trim($data['admin_email'] ?? 'admin@meseretmare.com');
    $adminPass = trim($data['admin_pass'] ?? 'admin123');

    if (empty($dbName) || empty($dbUser)) {
        echo json_encode([
            'success' => false,
            'error' => 'cPanel Database Name and Database Username are required.'
        ]);
        exit();
    }

    $pdo = null;

    // 1. Connect directly to cPanel database
    try {
        $dsnDb = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsnDb, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (Exception $e) {
        // 2. If database doesn't exist yet, try creating it (if host permits)
        try {
            $dsnServer = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
            $pdoServer = new PDO($dsnServer, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            $pdoServer->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            
            $dsnDb = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($dsnDb, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (Exception $e2) {
            echo json_encode([
                'success' => false,
                'error' => 'cPanel Database Connection Error: Could not connect to database `' . $dbName . '`. Please ensure you created the database and assigned privileges in cPanel MySQL Databases. Error: ' . $e->getMessage()
            ]);
            exit();
        }
    }

    // 3. Create All Tables
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(100) DEFAULT 'Meseret Admin',
            `email` VARCHAR(100) NOT NULL,
            `role` VARCHAR(50) DEFAULT 'Administrator',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `page_sections` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `section_key` VARCHAR(100) NOT NULL UNIQUE,
            `section_group` VARCHAR(50) NOT NULL DEFAULT 'general',
            `title_en` VARCHAR(255) DEFAULT '',
            `title_am` VARCHAR(255) DEFAULT '',
            `content_en` TEXT,
            `content_am` TEXT,
            `image_url` VARCHAR(255) DEFAULT '',
            `meta_json` JSON DEFAULT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `products` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name_en` VARCHAR(255) NOT NULL,
            `name_am` VARCHAR(255) DEFAULT '',
            `sku` VARCHAR(100) DEFAULT '',
            `category` VARCHAR(100) NOT NULL,
            `category_am` VARCHAR(100) DEFAULT '',
            `short_desc_en` TEXT,
            `short_desc_am` TEXT,
            `full_desc_en` TEXT,
            `full_desc_am` TEXT,
            `specs_json` JSON DEFAULT NULL,
            `image_url` VARCHAR(255) DEFAULT '',
            `is_published` TINYINT(1) DEFAULT 1,
            `is_featured` TINYINT(1) DEFAULT 0,
            `sort_order` INT DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `news` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `title_en` VARCHAR(255) NOT NULL,
            `title_am` VARCHAR(255) DEFAULT '',
            `slug` VARCHAR(255) NOT NULL UNIQUE,
            `excerpt_en` TEXT,
            `excerpt_am` TEXT,
            `content_en` LONGTEXT,
            `content_am` LONGTEXT,
            `category` VARCHAR(100) DEFAULT 'News',
            `category_am` VARCHAR(100) DEFAULT 'ዜና',
            `image_url` VARCHAR(255) DEFAULT '',
            `published_date` DATE DEFAULT (CURRENT_DATE),
            `view_count` INT DEFAULT 0,
            `is_published` TINYINT(1) DEFAULT 1,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `contact_messages` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(100) NOT NULL,
            `phone` VARCHAR(50) DEFAULT '',
            `subject` VARCHAR(255) DEFAULT '',
            `message` TEXT NOT NULL,
            `is_read` TINYINT(1) DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `page_views` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `page_slug` VARCHAR(100) NOT NULL,
            `ip_address` VARCHAR(50) DEFAULT '',
            `user_agent` VARCHAR(255) DEFAULT '',
            `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 4. Create Admin User
        $pdo->exec("TRUNCATE TABLE `admin_users`");
        $adminHash = password_hash($adminPass, PASSWORD_DEFAULT);
        $stmtAdmin = $pdo->prepare("INSERT INTO `admin_users` (username, password_hash, name, email, role) VALUES (?, ?, 'System Administrator', ?, 'System Administrator')");
        $stmtAdmin->execute([$adminUser, $adminHash, $adminEmail]);

        // Locate data directory (in DM154/data/ or fallback to src/data/)
        $dataPath = __DIR__ . '/../data';
        if (!file_exists($dataPath)) {
            $dataPath = __DIR__ . '/../../react-app/src/data';
        }

        // 5. Seed Products (from products.json)
        $pPath = $dataPath . '/products.json';
        if (file_exists($pPath)) {
            $decodedP = json_decode(file_get_contents($pPath), true);
            $productsData = $decodedP['products'] ?? [];
            if (!empty($productsData)) {
                $pdo->exec("TRUNCATE TABLE `products`");
                $insP = $pdo->prepare("INSERT INTO `products` (`name_en`, `name_am`, `sku`, `category`, `category_am`, `short_desc_en`, `short_desc_am`, `full_desc_en`, `full_desc_am`, `specs_json`, `image_url`, `is_published`, `is_featured`, `sort_order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
                $idx = 1;
                foreach ($productsData as $p) {
                    $insP->execute([
                        $p['name'] ?? '',
                        $p['name'] ?? '',
                        $p['model'] ?? '',
                        $p['category'] ?? 'Solar Pumps',
                        $p['category'] ?? 'Solar Pumps',
                        $p['use'] ?? '',
                        $p['use'] ?? '',
                        $p['details'] ?? '',
                        $p['details'] ?? '',
                        json_encode(array_merge($p['features'] ?? [], $p['specs'] ?? [])),
                        $p['image'] ?? '',
                        $idx <= 6 ? 1 : 0,
                        $idx
                    ]);
                    $idx++;
                }
            }
        }

        // 6. Seed News Articles & Field Gallery (from news.json)
        $nPath = $dataPath . '/news.json';
        if (file_exists($nPath)) {
            $decodedN = json_decode(file_get_contents($nPath), true);
            $newsPosts = $decodedN['posts'] ?? [];
            if (!empty($newsPosts)) {
                $pdo->exec("TRUNCATE TABLE `news`");
                $insN = $pdo->prepare("INSERT INTO `news` (`title_en`, `title_am`, `slug`, `excerpt_en`, `excerpt_am`, `content_en`, `content_am`, `category`, `category_am`, `image_url`, `published_date`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
                foreach ($newsPosts as $n) {
                    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $n['title'] ?? 'post-' . $n['id'])));
                    $contentStr = is_array($n['content'] ?? '') ? implode("\n\n", $n['content']) : ($n['content'] ?? '');
                    $rawDate = $n['date'] ?? date('Y-m-d');
                    $formattedDate = date('Y-m-d', strtotime($rawDate)) ?: date('Y-m-d');

                    $insN->execute([
                        $n['title'] ?? '',
                        $n['title'] ?? '',
                        $slug,
                        $n['excerpt'] ?? '',
                        $n['excerpt'] ?? '',
                        $contentStr,
                        $contentStr,
                        $n['category'] ?? 'News',
                        $n['category'] ?? 'ዜና',
                        $n['image'] ?? '',
                        $formattedDate
                    ]);
                }
            }
        }

        // 7. Seed Page Sections (Journey timeline, Contact Address, Socials, Partners, Core Values, Hero)
        $pdo->exec("TRUNCATE TABLE `page_sections`");
        $insS = $pdo->prepare("INSERT INTO `page_sections` (`section_key`, `section_group`, `title_en`, `title_am`, `content_en`, `content_am`, `image_url`, `meta_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        // Read site.json
        $sitePath = $dataPath . '/site.json';
        $siteObj = file_exists($sitePath) ? json_decode(file_get_contents($sitePath), true) : [];
        
        // Read timeline.json (Journey)
        $tPath = $dataPath . '/timeline.json';
        $timelineData = file_exists($tPath) ? json_decode(file_get_contents($tPath), true)['timeline'] ?? [] : [];

        // Read values.json (Core Values)
        $vPath = $dataPath . '/values.json';
        $valuesData = file_exists($vPath) ? json_decode(file_get_contents($vPath), true)['values'] ?? [] : [];

        // A. Header & Brand
        $insS->execute([
          'header_brand',
          'header',
          'Meseret Mare',
          'መሰረት ማሬ',
          'Solar Products Importer',
          'የፀሐይ ምርቶች አስመጪ',
          '/images/meseret-solar-logo.webp',
          null
        ]);

        // B. Hero Section
        $insS->execute([
          'hero',
          'homepage',
          'Best Solar Products Importer, Assembler & Installer in Ethiopia',
          'በኢትዮጵያ ምርጡ የሶላር ምርቶች አስመጪ፣ ገጣጣሚ እና ተካይ',
          'Supplying certified submersible & surface solar water pumps, solar home lighting kits, DC appliances, and field installation services across Ethiopia.',
          'የተረጋገጡ የውስጥ እና የውጭ የሶላር ውሃ ፓምፖችን፣ የቤት ሶላር ሲስተሞችን፣ የዲሲ መገልገያዎችን እና ተከላዎችን በኢትዮጵያ ያቀርባል።',
          '/images/hero-solar-field.png',
          null
        ]);

        // C. Journey Timeline Milestones (Keys: about_journey AND timeline_journey for total compatibility)
        $insS->execute([
          'about_journey',
          'about',
          'Our Journey & Growth Milestones',
          'የጉዞታሪካችን እና እድገታችን',
          'Since 2016, Meseret Mare Gebre Solar Products Importer has evolved into Ethiopia\'s premier solar importer, assembler, and installer.',
          'ከ2008 ዓ.ም (2016) ጀምሮ መሰረት ማሬ ገብሬ የፀሐይ ኃይል ምርቶች አስመጪ በኢትዮጵያ ውስጥ ቀዳሚ የሶላር አስመጪ፣ ገጣጣሚ እና ተካይ ሆኖ አድጓል።',
          '/images/hero-solar-field.png',
          json_encode($timelineData)
        ]);

        // D. Contact Details (Primary Phone +251 910691261, Secondary +251 913040053, Emails, Office Address)
        $contactMeta = [
          'phone_primary' => '+251 910691261',
          'phone_secondary' => '+251 913040053',
          'email' => 'meseretmare79@gmail.com / info@meseretmare.com',
          'address_en' => 'Gulele Sub City, Addisu Gebeya, Near to NOC Gas Station, Addis Ababa, Ethiopia',
          'address_am' => 'ጉለሌ ክፍለ ከተማ፣ አዲሱ ገበያ፣ ከኤንኦሲ ማደያ አጠገብ፣ አዲስ አበባ፣ ኢትዮጵያ'
        ];
        $insS->execute([
          'contact_address',
          'contact',
          'Office Address & Support Phones',
          'የቢሮ አድራሻ እና ስልክ ቁጥሮች',
          'Gulele Sub City, Addisu Gebeya, Near to NOC Gas Station, Addis Ababa, Ethiopia',
          'ጉለሌ ክፍለ ከተማ፣ አዲሱ ገበያ፣ ከኤንኦሲ ማደያ አጠገብ፣ አዲስ አበባ፣ ኢትዮጵያ',
          '',
          json_encode($contactMeta)
        ]);

        // E. Social Links (Telegram, Facebook, Instagram, YouTube, LinkedIn, TikTok)
        $socialMeta = $siteObj['social_links'] ?? [
          'telegram' => 'https://t.me/meseretmaresolar',
          'facebook' => 'https://www.facebook.com/profile.php?id=61552345711287',
          'instagram' => 'https://www.instagram.com/meseretmaresolar/',
          'youtube' => 'https://youtube.com/@meseretmare',
          'linkedin' => 'https://www.linkedin.com/company/107757674/admin/dashboard/',
          'tiktok' => 'http://tiktok.com/@meseretmaresolar'
        ];
        $insS->execute([
          'footer_socials',
          'contact',
          'Social Media Links',
          'ማህበራዊ ሚዲያ',
          'Follow Meseret Mare Gebre Solar across official channels.',
          'መሰረት ማሬ የፀሐይ ኃይልን በማህበራዊ ሚዲያ ይከተሉ።',
          '',
          json_encode($socialMeta)
        ]);

        // F. Partner Logos (11 Institutional Partner Logos)
        $partnerMeta = $siteObj['partner_logos'] ?? [];
        $insS->execute([
          'partner_logos',
          'about',
          'Our Institutional Partners & Network',
          'አጋሮቻችን',
          'Partnering with government ministries, international NGOs, and microfinance institutions across Ethiopia.',
          'ከሚኒስቴር መስሪያ ቤቶች፣ ከአለም አቀፍ ግብረ-ሰናይ ድርጅቶች እና የገንዘብ ተቋማት ጋር በመተባበር ይሰራል::',
          '',
          json_encode($partnerMeta)
        ]);

        // G. Core Values (from values.json)
        $insS->execute([
          'about_values',
          'about',
          'Our Core Values',
          'መሰረታዊ እሴቶቻችን',
          'Customer centered, Trustworthiness, Quality & excellence, Strong partnerships.',
          'ደንበኛ ተኮር፣ ታማኝነት፣ ጥራት እና ብቃት፣ ጠንካራ አጋርነት።',
          '',
          json_encode($valuesData)
        ]);

        // H. Company About Story
        $insS->execute([
          'company_about',
          'about',
          'About Meseret Mare Gebre Solar',
          'ስለ መሰረት ማሬ ገብሬ የፀሐይ ኃይል',
          'Since 2016, Meseret Mare Gebre Solar Products Importer has been dedicated to enhancing the lifestyle of people by providing top-quality solar products at affordable prices. As a proud member of GOGLA, we partner with stakeholders across the globe to deliver innovative solar solutions.',
          'ከ2008 ዓ.ም (2016) ጀምሮ መሰረት ማሬ ገብሬ የፀሐይ ኃይል ምርቶች አስመጪ ከፍተኛ ጥራት ያላቸውን የሶላር ምርቶች በተመጣጣኝ ዋጋ በማቅረብ የህብረተሰቡን ህይወት ለማሻሻል እየሰራ ይገኛል።',
          '/images/meseret-solar-logo.webp',
          null
        ]);

        // I. Footer About & Copyright
        $insS->execute([
          'footer_about',
          'footer',
          'Footer Brand & Copyright Notice',
          'የግርጌ ጽሑፍ',
          '2026 © Meseret Mare Gebre Solar Importer. All rights reserved. Powering brighter days across Ethiopia.',
          '2026 © መሰረት ማሬ ገብሬ የፀሐይ ኃይል አስመጪ። መብቱ በህግ የተጠበቀ ነው።',
          '/images/meseret-solar-logo.webp',
          null
        ]);

        // 8. Save config.php and lock installation
        $configContent = "<?php\n"
            . "define('DB_HOST', " . var_export($dbHost, true) . ");\n"
            . "define('DB_PORT', " . var_export($dbPort, true) . ");\n"
            . "define('DB_NAME', " . var_export($dbName, true) . ");\n"
            . "define('DB_USER', " . var_export($dbUser, true) . ");\n"
            . "define('DB_PASS', " . var_export($dbPass, true) . ");\n"
            . "define('DB_CHARSET', 'utf8mb4');\n"
            . "define('IS_CONFIGURED', true);\n"
            . "define('UPLOAD_DIR', __DIR__ . '/../uploads/');\n"
            . "define('UPLOAD_URL', '/DM154/uploads/');\n"
            . "define('JWT_SECRET', 'meseret_solar_cpanel_secret_key_2026');\n"
            . "function set_cors_headers() {\n"
            . "    \$origin = \$_SERVER['HTTP_ORIGIN'] ?? '*';\n"
            . "    header(\"Access-Control-Allow-Origin: \$origin\");\n"
            . "    header(\"Access-Control-Allow-Credentials: true\");\n"
            . "    header(\"Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\");\n"
            . "    header(\"Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\");\n"
            . "    if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }\n"
            . "}\n";

        file_put_contents(__DIR__ . '/../config/config.php', $configContent);
        file_put_contents($lockFile, json_encode([
            'installed_at' => date('Y-m-d H:i:s'),
            'db_name' => $dbName,
            'admin_user' => $adminUser,
            'cpanel_mode' => true,
            'initial_seeded' => true
        ]));

        echo json_encode([
            'success' => true,
            'message' => 'cPanel Installation completed successfully! Products, News, Journey timeline, Contact info, Social links, Partner logos, Values, and Admin credentials have been fully seeded.'
        ]);
        exit();

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'cPanel Installation error: ' . $e->getMessage()
        ]);
        exit();
    }
}
