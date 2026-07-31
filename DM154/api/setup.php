<?php
require_once __DIR__ . '/../core/auth.php';
header('Content-Type: application/json');

$installedLock = __DIR__ . '/../config/installed.lock';

// Security check: Once installed, setup/seeding cannot be re-run unless authenticated as Admin
if (file_exists($installedLock)) {
    if (!Auth::check()) {
        http_response_code(403);
        echo json_encode(['error' => 'System is already installed. Access denied. Log in to the admin panel or remove config/installed.lock to reset.']);
        exit();
    }
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$dbHost = trim($data['db_host'] ?? '127.0.0.1');
$dbPort = trim($data['db_port'] ?? '3306');
$dbName = trim($data['db_name'] ?? 'meseret_db');
$dbUser = trim($data['db_user'] ?? 'root');
$dbPass = $data['db_pass'] ?? '';

$adminUser = trim($data['admin_user'] ?? 'admin');
$adminEmail = trim($data['admin_email'] ?? 'admin@meseretmare.com');
$adminPass = trim($data['admin_pass'] ?? 'admin123');

try {
    $dsnNoDb = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
    $pdo = new PDO($dsnNoDb, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `{$dbName}`");
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `password_hash` VARCHAR(255) NOT NULL,
        `name` VARCHAR(100) DEFAULT 'Meseret Admin',
        `email` VARCHAR(100) NOT NULL,
        `role` VARCHAR(50) DEFAULT 'System Administrator',
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
    $pdo->exec("TRUNCATE TABLE `page_views`");

    $passHash = password_hash($adminPass, PASSWORD_DEFAULT);
    $stmtUserCheck = $pdo->prepare("SELECT id FROM `admin_users` WHERE `username` = ?");
    $stmtUserCheck->execute([$adminUser]);
    if ($stmtUserCheck->fetch()) {
        $insAdmin = $pdo->prepare("UPDATE `admin_users` SET `password_hash` = ?, `email` = ? WHERE `username` = ?");
        $insAdmin->execute([$passHash, $adminEmail, $adminUser]);
    } else {
        $insAdmin = $pdo->prepare("INSERT INTO `admin_users` (`username`, `password_hash`, `name`, `email`, `role`) VALUES (?, ?, 'Meseret Admin', ?, 'System Administrator')");
        $insAdmin->execute([$adminUser, $passHash, $adminEmail]);
    }

    // Seed Products from products.json
    $jsonProd = __DIR__ . '/../../react-app/src/data/products.json';
    if (file_exists($jsonProd)) {
        $pdo->exec("TRUNCATE TABLE `products`");
        $rawP = file_get_contents($jsonProd);
        $decodedP = json_decode($rawP, true);
        $productsData = $decodedP['products'] ?? [];

        $insP = $pdo->prepare("INSERT INTO `products` (`name_en`, `name_am`, `sku`, `category`, `category_am`, `short_desc_en`, `short_desc_am`, `full_desc_en`, `full_desc_am`, `specs_json`, `image_url`, `is_published`, `is_featured`, `sort_order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $i = 1;
        foreach ($productsData as $p) {
            $nameEn = $p['name'] ?? '';
            $sku = $p['model'] ?? '';
            $cat = $p['category'] ?? 'Solar Pumps';
            $use = $p['use'] ?? '';
            $det = $p['details'] ?? '';
            $img = $p['image'] ?? '';
            $specs = array_merge($p['features'] ?? [], $p['specs'] ?? []);

            $insP->execute([$nameEn, $nameEn, $sku, $cat, $cat, $use, $use, $det, $det, json_encode($specs), $img, 1, $i <= 6 ? 1 : 0, $i]);
            $i++;
        }
    }

    // Seed News from news.json
    $jsonNews = __DIR__ . '/../../react-app/src/data/news.json';
    if (file_exists($jsonNews)) {
        $pdo->exec("TRUNCATE TABLE `news`");
        $rawN = file_get_contents($jsonNews);
        $decodedN = json_decode($rawN, true);
        $newsData = $decodedN['posts'] ?? [];

        $insN = $pdo->prepare("INSERT INTO `news` (`title_en`, `title_am`, `slug`, `excerpt_en`, `excerpt_am`, `content_en`, `content_am`, `category`, `category_am`, `image_url`, `published_date`, `view_count`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($newsData as $n) {
            $title = $n['title'] ?? '';
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-')) ?: ('news-' . rand(10, 999));
            $excerpt = $n['excerpt'] ?? '';
            $content = is_array($n['content'] ?? null) ? implode("\n\n", $n['content']) : ($n['content'] ?? '');
            $cat = $n['category'] ?? 'News';
            $img = $n['image'] ?? '';
            $date = date('Y-m-d', strtotime($n['date'] ?? 'now'));

            $insN->execute([$title, $title, $slug, $excerpt, $excerpt, $content, $content, $cat, $cat, $img, $date, rand(45, 290), 1]);
        }
    }

    // Comprehensive Page Sections Seeding
    $pdo->exec("TRUNCATE TABLE `page_sections`");
    
    // Initial Operating Model items to seed as structured JSON
    $opModelJson = json_encode([
        ['number' => '01', 'label_en' => 'Field check', 'label_am' => 'የመስክ ግምገማ'],
        ['number' => '02', 'label_en' => 'Right sizing', 'label_am' => 'ትክክለኛ መጠን'],
        ['number' => '03', 'label_en' => 'Certified supply', 'label_am' => 'የተረጋገጠ አቅርቦት'],
        ['number' => '04', 'label_en' => 'Install and care', 'label_am' => 'ተከላ እና ጥገና']
    ]);

    // Initial Journey Timeline items to seed as structured JSON
    $timelineJson = json_encode([
        ['year' => '2016', 'text_en' => 'Company established in Bishoftu', 'text_am' => 'ድርጅቱ በቢሾፍቱ ተመሰረተ'],
        ['year' => '2018', 'text_en' => 'Partnership with Development Bank of Ethiopia', 'text_am' => 'ከኢትዮጵያ ልማት ባንክ ጋር አጋርነት ተጀመረ'],
        ['year' => '2021', 'text_en' => 'Expanded supply to 4 key regions', 'text_am' => 'አቅርቦቱ ወደ 4 ክልሎች አደገ'],
        ['year' => '2024', 'text_en' => 'Solar fair leader and key participant', 'text_am' => 'በፀሐይ ኃይል ኤግዚቢሽን ግንባር ቀደም ተሳታፊ']
    ]);

    // Contact Address details as structured JSON
    $addressJson = json_encode([
        'phone_primary' => '+251 911 000 000',
        'phone_secondary' => '+251 911 111 222',
        'email' => 'info@meseretmare.com',
        'address_en' => 'Bishoftu / Debre Zeit & Addis Ababa, Ethiopia',
        'address_am' => 'ቢሾፍቱ / ደብረ ዘይት እና አዲስ አበባ፣ ኢትዮጵያ'
    ]);

    // Social Media links as structured JSON
    $socialsJson = json_encode([
        'facebook' => 'https://facebook.com/meseretsolar',
        'telegram' => 'https://t.me/meseretsolar',
        'linkedin' => 'https://linkedin.com/company/meseretsolar',
        'youtube' => 'https://youtube.com/c/meseretsolar'
    ]);

    // Core Values as structured JSON
    $coreValuesJson = json_encode([
        ['title_en' => 'Customer Satisfaction', 'title_am' => 'የደንበኞች እርካታ', 'desc_en' => 'Prioritizing user needs with reliable service.', 'desc_am' => 'የደንበኞችን ፍላጎት አስተማማኝ በሆነ አገልግሎት ማስቀደም።'],
        ['title_en' => 'Integrity & Quality', 'title_am' => 'ታማኝነት እና ጥራት', 'desc_en' => 'Importing certified products built for field use.', 'desc_am' => 'ለመስክ አገልግሎት የተሰሩ የተረጋገጡ ምርቶችን ማስመጣት።'],
        ['title_en' => 'Community Impact', 'title_am' => 'ማህበረሰባዊ ተጽዕኖ', 'desc_en' => 'Powering water and light for off-grid families.', 'desc_am' => 'ከመብራት መስመር ውጪ ላሉ ቤተሰቦች ብርሃንና ውሃ ማቅረብ።'],
        ['title_en' => 'Innovation', 'title_am' => 'ፈጠራ', 'desc_en' => 'Bringing modern DC solar technology to rural areas.', 'desc_am' => 'ዘመናዊ የዲሲ ሶላር ቴክኖሎጂን ወደ ገጠር ማምጣት።']
    ]);

    // Partner Logos as structured JSON
    $partnerLogosJson = json_encode([
        ['name' => 'CARE International Ethiopia', 'logo' => '/images/care-international-ethiopia-72937-removebg-preview.png', 'description' => 'Key strategic partner supporting clean solar energy distribution and community water projects across regional states in Ethiopia.'],
        ['name' => 'Addis Ababa University', 'logo' => '/images/addis_ababa_universtiy-removebg-preview.png', 'description' => 'Academic and research partner collaborating on renewable energy efficiency and technical solar field assessments.'],
        ['name' => 'Solar Association', 'logo' => '/images/ethiopian_solar_energy_development_association-removebg-preview.png', 'description' => 'Ethiopian Solar Energy Development Association member promoting quality standards and off-grid solar policies.'],
        ['name' => 'ASDEPO', 'logo' => '/images/asdepo-removebg-preview.png', 'description' => 'Action for Social Development and Environmental Protection Organization partner for community solar water supply.'],
        ['name' => 'Purpose Black', 'logo' => '/images/Purpose-black-removebg-preview.png', 'description' => 'Agricultural value chain partner expanding productive solar water pumping for smallholder farmers.'],
        ['name' => 'Winrock International', 'logo' => '/images/winrock-removebg-preview.png', 'description' => 'International development partner supporting climate-resilient water pumping and clean energy access.'],
        ['name' => 'Ministry of Water & Energy', 'logo' => '/images/ministry_of_water_and_energy-removebg-preview.png', 'description' => 'Regulatory alignment, policy guidance, and rural electrification program stakeholder in Ethiopia.']
    ]);

    // Services Flow Steps as structured JSON
    $servicesFlowJson = json_encode([
        ['step_en' => 'Assess site', 'step_am' => 'ቦታን መገምገም'],
        ['step_en' => 'Design system', 'step_am' => 'ሲስተም መንደፍ'],
        ['step_en' => 'Supply certified hardware', 'step_am' => 'የተረጋገጡ ዕቃዎችን ማቅረብ'],
        ['step_en' => 'Install and commission', 'step_am' => 'መግጠም እና ማስጀመር'],
        ['step_en' => 'Train users', 'step_am' => 'ተጠቃሚዎችን ማሰልጠን'],
        ['step_en' => 'Maintain performance', 'step_am' => 'አፈጻጸምን መጠበቅ']
    ]);

    $sections = [
        // Header & Logo
        ['header_brand', 'header', 'Meseret Mare', 'መሰረት ማሬ', 'Solar Products Importer', 'የፀሐይ ምርቶች አስመጪ', '/images/meseret-solar-logo.webp', null],
        
        // Homepage Metric Badges (4 cards)
        ['metric_1', 'homepage', '2016', '2016', 'Founded', 'የተመሰረተበት ዓመት', '', null],
        ['metric_2', 'homepage', '10k+', '10k+', 'Systems reach', 'የደረሱ ሲስተሞች', '', null],
        ['metric_3', 'homepage', '40+', '40+', 'Districts', 'ወረዳዎች', '', null],
        ['metric_4', 'homepage', 'GOGLA', 'GOGLA', 'Member', 'አባል', '', null],

        // Hero Section
        ['hero', 'homepage', 'Power, sized right.', 'ኃይል፣ በትክክለኛ መጠን።', 'Solar water pumps, solar home systems, portable lanterns, and field support for Ethiopia.', 'ለኢትዮጵያ የፀሐይ ውሃ ፓምፖች፣ የቤት ሲስተሞች፣ መብራቶች እና የመስክ ድጋፍ።', '/images/news-participation-in-water-and-energy-fair.jpeg', null],

        // Certified Solar Supply Cards
        ['cert_supply_heading', 'homepage', 'Certified solar supply. Clean delivery.', 'የተረጋገጠ የፀሐይ አቅርቦት። ንፁህ አቅርቦት።', 'High quality certified solar products for Ethiopian communities.', 'ለኢትዮጵያ ማህበረሰቦች የተረጋገጡ የፀሐይ ምርቶች።', '', null],
        ['cert_card_1', 'homepage', 'CERTIFIED IMPORTS', 'የተረጋገጡ ገቢዎች', 'Lighting Global certified focus', 'በላይቲንግ ግሎባል የተረጋገጡ ምርቶች', '', null],
        ['cert_card_2', 'homepage', 'WATER SECURITY', 'የውሃ ዋስትና', 'Solar water pumps for farms and communities', 'ለእርሻ እና ለማህበረሰብ የፀሐይ ውሃ ፓምፖች', '', null],
        ['cert_card_3', 'homepage', 'FIELD CARE', 'የመስክ ድጋፍ', 'Assessment, installation, maintenance', 'ግምገማ፣ ተከላ፣ ጥገና', '', null],

        // Product Lines (3 Category Showcase Cards with Images)
        ['prod_line_heading', 'homepage', 'Product lines.', 'የምርት መስመሮች።', 'Our core solar water pumps, home kits, and appliances.', 'ዋና የፀሐይ ውሃ ፓምፖች፣ የቤት ሲስተሞች እና መሳሪያዎች።', '', null],
        ['prod_line_1', 'homepage', 'Solar Pump Systems', 'የፀሐይ ፓምፕ ሲስተሞች', 'Irrigation, wells, and community water', 'ለመስኖ፣ ለጉድጓድ እና ለማህበረሰብ ውሃ', '/images/proof-community-solar.png', null],
        ['prod_line_2', 'homepage', 'Solar Home Kits', 'የፀሐይ የቤት ሲስተሞች', 'Lighting, charging, and home power', 'ለብርሃን፣ ለቻርጅ እና ለቤት ኃይል', '/images/product-home-kit.png', null],
        ['prod_line_3', 'homepage', 'DC Solar Appliances', 'የዲሲ የፀሐይ መሳሪያዎች', 'Fans, TV, and efficient essentials', 'ለፋን፣ ለቲቪ እና ለቀልጣፋ መሳሪያዎች', '/images/hero-solar-field.png', null],

        // Field Proof (3 Cards with Images)
        ['field_proof_heading', 'homepage', 'Field proof.', 'የመስክ ምስክሮች።', 'Proven solar installations in daily use across Ethiopia.', 'በመላ ኢትዮጵያ የተረጋገጡ የፀሐይ ተከላዎች።', '', null],
        ['field_proof_1', 'homepage', 'Ethiopia Access', 'በኢትዮጵያ ተደራሽነት', 'Off-grid solar reach for underserved communities.', 'ከመብራት መስመር ውጭ ላሉ ማህበረሰቦች የፀሐይ ኃይል ተደራሽነት።', '/images/proof-community-solar.png', null],
        ['field_proof_2', 'homepage', 'Productive Use', 'ምርታማ አጠቃቀም', 'Solar pumping, connectivity, cooling, and clean power.', 'የፀሐይ ፓምፕ፣ ግንኙነት፣ ማቀዝቀዝ እና ንፁህ ኃይል።', '/images/hero-solar-field.png', null],
        ['field_proof_3', 'homepage', 'Home Power', 'የቤት ኃይል', 'Sun King and d.light home systems in daily life.', 'የሳን ኪንግ እና ዲ.ላይት የቤት ሲስተሞች በዕለት ተዕለት ህይወት።', '/images/product-home-kit.png', null],

        // Achievements (3 Cards)
        ['achievements_heading', 'homepage', 'We Pride Ourselves On Our Significant Achievements:', 'በታላላቅ ስኬቶቻችን እንኮራለን፡', 'Highlighting our key import and regional milestones.', 'የእድገት አበይት ምዕራፎቻችን።', '', null],
        ['achievement_1', 'homepage', 'Imported Successfully', 'በተሳካ ሁኔታ የገባ', 'solar products from manufacturers like Greenlight Planet Inc., OV Beacon, and d.light, including products certified by Lighting Global.', 'ከግሪንላይት ፕላኔት፣ ኦቪ ቢኮን እና ዲ.ላይት የተረጋገጡ የፀሐይ ምርቶች።', '', null],
        ['achievement_2', 'homepage', 'Strong Partnerships', 'ጠንካራ አጋርነቶች', 'Established strong partnerships with the Development Bank of Ethiopia and various regional agencies.', 'ከኢትዮጵያ ልማት ባንክ እና ከክልል አካላት ጋር የተመሰረተ አጋርነት።', '', null],
        ['achievement_3', 'homepage', 'Increased Operation Area', 'የተስፋፋ የስራ ክልል', 'Successfully distributed solar solutions in SNNP, Oromia, Tigray, and Amhara regions.', 'በደቡብ፣ በኦሮሚያ፣ በትግራይ እና በአማራ ክልሎች የተስፋፋ አቅርቦት።', '', null],

        // Operating Model & Assembly Banner (Operating Model populated with JSON steps)
        ['operating_model', 'homepage', 'Clear from day one.', 'ከመጀመሪያው ቀን ግልፅ።', '', '', '', $opModelJson],
        ['assembly_initiative', 'homepage', 'Local assembly initiative', 'የአካባቢ ገጣጣሚ ተInitiative', 'Preparing local assembly for 1, 3, and 4 bulb solar home systems and agricultural solar water pumps to create jobs, transfer skills, and reduce hardware costs.', 'የሀገር ውስጥ ገጣጣሚ ፋብሪካ ዝግጅት።', '', null],

        // About Page Sections
        ['about_intro', 'about', 'Solving Ethiopia rural energy challenges.', 'የኢትዮጵያን የገጠር ኃይል ፈተናዎች መፍታት።', 'Established in 2016, Meseret Mare Gebre Solar Products Importer distributes certified, affordable solar solutions for off-grid homes, farms, NGOs, and institutions.', 'በ2016 የተመሰረተው መሰረት ማሬ ገብሬ የፀሐይ ምርቶች አስመጪ።', '/images/news-debrezeyet-mobile-solar-pump-exhibition.jpg', null],
        ['about_clean_power', 'about', 'Dedicated to clean power access.', 'ለጽዳት ኃይል ተደራሽነት የተሰጠ።', "Meseret Mare Gebre Solar Products Importer was established to address Ethiopia's critical energy shortage, especially in rural and off-grid areas. We import and distribute high-quality solar products at affordable rates to improve household life, agricultural productivity, and institutional reliability.\n\nOur product focus includes የፀሐይ ኃይል, የፀሐይ ውሃ ፓምፕ, የፀሐይ መብራት, and የፀሐይ ቤት ሲስተም for practical Ethiopian field conditions.\n\nBy replacing kerosene lighting, powering irrigation, and supporting productive use, we create safer homes, more productive farms, and stronger local economies.", 'የገጠር እና ከመስመር ውጭ የኃይል እጥረት መፍታት።', '', null],
        ['about_mission', 'about', 'Our Mission', 'ተልዕኳችን', 'Fulfill the power needs of the Ethiopian people with high-quality service and innovative solar solutions that benefit customers and partners.', 'የኢትዮጵያን ህዝብ የኃይል ፍላጎት በከጨማሪ ማሟላት።', '', null],
        ['about_vision', 'about', 'Our Vision', 'ራዕያችን', 'Completely alleviate the power challenges of rural Ethiopians through sustainable, green, and affordable solar technologies.', 'የገጠር ኢትዮጵያውያንን የኃይል ፈተናዎች ሙሉ በሙሉ መቅረፍ።', '', null],
        
        // Structured Core Values
        ['about_values', 'about', 'Our Core Values', 'ዋና እሴቶቻችን', 'Customer satisfaction, product reliability, integrity, innovation, and community impact.', 'የደንበኞች እርካታ፣ የታማኝነት አገልግሎት እና ማህበረሰባዊ ተጽዕኖ።', '', $coreValuesJson],
        // About journey timeline populated with JSON milestones
        ['about_journey', 'about', 'Our Journey', 'ጉዟችን', 'Key milestones in our mission to power Ethiopia.', 'የእድገት አበይት ምዕራፎቻችን።', '', $timelineJson],

        // Services Page Sections
        ['services_intro', 'services', 'Solar assessment, installation, and maintenance in Ethiopia.', 'የፀሐይ ግምገማ፣ ተከላ እና ጥገና በኢትዮጵያ።', 'From solar site assessment and system design to import, installation, commissioning, training, monitoring, and long-term maintenance.', 'ከቦታ ግምገማ እና ሲስተም ንድፍ እስከ ተከላ፣ ስልጠና እና የረጅም ጊዜ ጥገና።', '/images/news-mobile-solar-water-pump-in-action.jpeg', null],
        ['services_card_1', 'services', 'Solar Site Assessment', 'የቦታ ግምገማ', 'On-site hydrological assessment, water table check, and solar radiance calculation.', 'የውሃ ደረጃ እና የፀሐይ ኃይል ግምገማ።', '/images/news-sidama-region-meeting-and-site-visit.jpg', null],
        ['services_card_2', 'services', 'System Design & Sizing', 'የሲስተም ንድፍ', 'Custom engineering to match pump capacity with daily water demand.', 'ከዕለታዊ የውሃ ፍላጎት ጋር የተመጠነ ንድፍ።', '/images/difful-submersible-solar-pump.webp', null],
        ['services_card_3', 'services', 'Import & Certified Supply', 'የተረጋገጠ አቅርቦት', 'Lighting Global & GOGLA certified hardware supply.', 'የተረጋገጡ የፀሐይ መሳሪያዎች አቅርቦት።', '/images/sun-king-homeplus-max-24-tv.webp', null],
        ['services_card_4', 'services', 'Installation & Maintenance', 'ተከላ እና ጥገና', 'Field installation by trained technicians with routine maintenance and warranty support.', 'በባለሙያዎች የሚከናወን ተከላ እና ጥገና።', '/images/news-mobile-solar-water-pump-in-action.jpeg', null],
        // Services Flow Steps
        ['services_flow', 'services', 'Service Execution Steps', 'የአገልግሎት አሰጣጥ ደረጃዎች', 'Our systematic workflow to deploy solar projects.', 'የአገልግሎት አሰጣጥ ሂደታችን።', '', $servicesFlowJson],

        // Partner Logos Showcase Section
        ['partner_logos', 'homepage', 'Key Partners & Stakeholders', 'ዋና አጋሮቻችን', 'Our network of institutional partners and agencies.', 'የአጋሮቻችን አውታረ መረብ።', '', $partnerLogosJson],

        // Contact, Footer & Socials (Structured as JSON fields)
        ['contact_info', 'contact', 'Request a solar pump or home system quote.', 'የፀሐይ ፓምፕ ወይም የቤት ሲስተም ዋጋ ይጠይቁ።', 'Ask about solar water pump pricing, product specifications, home systems, portable lanterns, installation, or a site-specific recommendation in Ethiopia.', 'ስለ የፀሐይ ውሃ ፓምፕ ዋጋ እና ዝርዝር መረጃ ይጠይቁ።', '', null],
        ['contact_address', 'contact', 'Bishoftu / Debre Zeit & Addis Ababa, Ethiopia', 'ቢሾፍቱ / ደብረ ዘይት እና አዲስ አበባ፣ ኢትዮጵያ', '', '', '', $addressJson],
        ['footer_about', 'footer', 'Meseret Mare Solar Systems', 'መሰረት ማሬ የፀሐይ ኃይል', '© 2026 Meseret Mare. All rights reserved. Powering clean water and light across Ethiopia.', '© 2026 መሰረት ማሬ። መብቱ በህግ የተጠበቀ ነው።', '/images/meseret-solar-logo.webp', null],
        ['footer_socials', 'footer', 'Social Media Links', 'ማህበራዊ ሚዲያ', '', '', '', $socialsJson]
    ];

    $insS = $pdo->prepare("INSERT INTO `page_sections` (`section_key`, `section_group`, `title_en`, `title_am`, `content_en`, `content_am`, `image_url`, `meta_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($sections as $sec) {
        $insS->execute($sec);
    }

    $configContent = "<?php\n" .
        "define('DB_HOST', '{$dbHost}');\n" .
        "define('DB_PORT', '{$dbPort}');\n" .
        "define('DB_NAME', '{$dbName}');\n" .
        "define('DB_USER', '{$dbUser}');\n" .
        "define('DB_PASS', '{$dbPass}');\n" .
        "define('DB_CHARSET', 'utf8mb4');\n" .
        "define('UPLOAD_DIR', __DIR__ . '/../uploads/');\n" .
        "define('UPLOAD_URL', '/DM154/uploads/');\n" .
        "define('JWT_SECRET', 'meseret_solar_secret_key_2026_safe');\n" .
        "function set_cors_headers() {\n" .
        "    \$origin = \$_SERVER['HTTP_ORIGIN'] ?? '*';\n" .
        "    header(\"Access-Control-Allow-Origin: \$origin\");\n" .
        "    header(\"Access-Control-Allow-Credentials: true\");\n" .
        "    header(\"Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\");\n" .
        "    header(\"Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\");\n" .
        "    if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }\n" .
        "}\n";

    file_put_contents(__DIR__ . '/../config/config.php', $configContent);
    file_put_contents($installedLock, date('c'));

    echo json_encode([
        'success' => true,
        'message' => 'Database installation and data seeding completed successfully! You can now log in.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Setup error: ' . $e->getMessage()]);
}
