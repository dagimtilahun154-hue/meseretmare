<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$pdo = Database::getConnection();

// Seed initial section content if count is less than 8
$stmtCount = $pdo->query("SELECT COUNT(*) FROM `page_sections`");
if ($stmtCount->fetchColumn() < 8) {
    $pdo->exec("TRUNCATE TABLE `page_sections`");

    $initialSections = [
        [
            'section_key' => 'hero',
            'section_group' => 'hero',
            'title_en' => 'Power, sized right.',
            'title_am' => 'ኃይል፣ በትክክለኛ መጠን።',
            'content_en' => 'Solar water pumps, solar home systems, portable lanterns, and field support for Ethiopia.',
            'content_am' => 'ለኢትዮጵያ የፀሐይ ውሃ ፓምፖች፣ የቤት ሲስተሞች፣ መብራቶች እና የመስክ ድጋፍ።',
            'image_url' => '/images/news-participation-in-water-and-energy-fair.jpeg',
            'meta_json' => json_encode([
                'button_label_en' => 'View products',
                'button_label_am' => 'ምርቶችን ይመልከቱ',
                'button_target' => 'products'
            ])
        ],
        [
            'section_key' => 'field_proof_1',
            'section_group' => 'field_proof',
            'title_en' => 'Ethiopia Access',
            'title_am' => 'በኢትዮጵያ ተደራሽነት',
            'content_en' => 'Off-grid solar reach for underserved communities.',
            'content_am' => 'ከመብራት መስመር ውጭ ላሉ ማህበረሰቦች የፀሐይ ኃይል ተደራሽነት።',
            'image_url' => '/images/proof-community-solar.png',
            'meta_json' => json_encode([])
        ],
        [
            'section_key' => 'field_proof_2',
            'section_group' => 'field_proof',
            'title_en' => 'Productive Use',
            'title_am' => 'ምርታማ አጠቃቀም',
            'content_en' => 'Solar pumping, connectivity, cooling, and clean power.',
            'content_am' => 'የፀሐይ ፓምፕ፣ ግንኙነት፣ ማቀዝቀዝ እና ንፁህ ኃይል።',
            'image_url' => '/images/hero-solar-field.png',
            'meta_json' => json_encode([])
        ],
        [
            'section_key' => 'field_proof_3',
            'section_group' => 'field_proof',
            'title_en' => 'Home Power',
            'title_am' => 'የቤት ኃይል',
            'content_en' => 'Sun King and d.light home systems in daily life.',
            'content_am' => 'የሳን ኪንግ እና ዲ.ላይት የቤት ሲስተሞች በዕለት ተዕለት ህይወት።',
            'image_url' => '/images/product-home-kit.png',
            'meta_json' => json_encode([])
        ],
        [
            'section_key' => 'capabilities',
            'section_group' => 'capabilities',
            'title_en' => 'Certified solar supply. Clean delivery.',
            'title_am' => 'የተረጋገጠ የፀሐይ አቅርቦት። ንፁህ አቅርቦት።',
            'content_en' => 'Lighting Global certified focus. Solar water pumps for farms and communities. Field care assessment, installation, maintenance.',
            'content_am' => 'በላይቲንግ ግሎባል የተረጋገጡ ምርቶች። ለእርሻ እና ለማህበረሰብ የፀሐይ ውሃ ፓምፖች።',
            'image_url' => '/images/news-sidama-region-meeting-and-site-visit.jpg',
            'meta_json' => json_encode([])
        ],
        [
            'section_key' => 'about',
            'section_group' => 'about',
            'title_en' => 'Solving Ethiopia rural energy challenges.',
            'title_am' => 'የኢትዮጵያን የገጠር ኃይል ፈተናዎች መፍታት።',
            'content_en' => 'Established in 2016, Meseret Mare Gebre Solar Products Importer distributes certified, affordable solar solutions for off-grid homes, farms, NGOs, and institutions.',
            'content_am' => 'በ2016 የተመሰረተው መሰረት ማሬ ገብሬ የፀሐይ ምርቶች አስመጪ ለገጠር ቤቶች፣ እርሻዎች እና ተቋማት አስተማማኝ የፀሐይ መፍትሄዎችን ያቀርባል።',
            'image_url' => '/images/news-debrezeyet-mobile-solar-pump-exhibition.jpg',
            'meta_json' => json_encode([
                'mission_title' => 'Our Mission',
                'mission_en' => 'Fulfill the power needs of the Ethiopian people with high-quality service and innovative solar solutions that benefit customers and partners.',
                'vision_title' => 'Our Vision',
                'vision_en' => 'Completely alleviate the power challenges of rural Ethiopians through sustainable, green, and affordable solar technologies.'
            ])
        ],
        [
            'section_key' => 'services',
            'section_group' => 'services',
            'title_en' => 'Solar assessment, installation, and maintenance in Ethiopia.',
            'title_am' => 'የፀሐይ ግምገማ፣ ተከላ እና ጥገና በኢትዮጵያ።',
            'content_en' => 'From solar site assessment and system design to import, installation, commissioning, training, monitoring, and long-term maintenance.',
            'content_am' => 'ከቦታ ግምገማ እና ሲስተም ንድፍ እስከ ተከላ፣ ስልጠና እና የረጅም ጊዜ ጥገና።',
            'image_url' => '/images/news-mobile-solar-water-pump-in-action.jpeg',
            'meta_json' => json_encode([])
        ],
        [
            'section_key' => 'contact_info',
            'section_group' => 'contact',
            'title_en' => 'Request a solar pump or home system quote.',
            'title_am' => 'የፀሐይ ፓምፕ ወይም የቤት ሲስተም ዋጋ ይጠይቁ።',
            'content_en' => 'Ask about solar water pump pricing, product specifications, home systems, portable lanterns, installation, or a site-specific recommendation in Ethiopia.',
            'content_am' => 'ስለ የፀሐይ ውሃ ፓምፕ ዋጋ፣ ዝርዝር መረጃ፣ ተከላ እና የምክር አገልግሎት ይጠይቁ።',
            'image_url' => '',
            'meta_json' => json_encode([
                'primary_phone' => '+251 911 000 000',
                'primary_email' => 'info@meseretmare.com',
                'address' => 'Bishoftu / Debre Zeit & Addis Ababa, Ethiopia'
            ])
        ],
        [
            'section_key' => 'footer',
            'section_group' => 'footer',
            'title_en' => 'Meseret Mare Solar Systems',
            'title_am' => 'መሰረት ማሬ የፀሐይ ኃይል',
            'content_en' => '© 2026 Meseret Mare. All rights reserved. Powering clean water and light across Ethiopia.',
            'content_am' => '© 2026 መሰረት ማሬ። መብቱ በህግ የተጠበቀ ነው። ንፁህ ውሃ እና ብርሃን በመላ ኢትዮጵያ።',
            'image_url' => '',
            'meta_json' => json_encode([])
        ]
    ];

    $ins = $pdo->prepare("INSERT INTO `page_sections` (`section_key`, `section_group`, `title_en`, `title_am`, `content_en`, `content_am`, `image_url`, `meta_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($initialSections as $sec) {
        $ins->execute([
            $sec['section_key'],
            $sec['section_group'],
            $sec['title_en'],
            $sec['title_am'],
            $sec['content_en'],
            $sec['content_am'],
            $sec['image_url'],
            $sec['meta_json']
        ]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $group = $_GET['group'] ?? null;
    if ($group) {
        $stmt = $pdo->prepare("SELECT * FROM `page_sections` WHERE `section_group` = ?");
        $stmt->execute([$group]);
        $sections = $stmt->fetchAll();
    } else {
        $stmt = $pdo->query("SELECT * FROM `page_sections` ORDER BY `id` ASC");
        $sections = $stmt->fetchAll();
    }

    echo json_encode(['success' => true, 'sections' => $sections]);
    exit();
}

if ($method === 'POST' || $method === 'PUT') {
    Auth::requireAuth();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $sectionKey = trim($data['section_key'] ?? '');
    if (!$sectionKey) {
        http_response_code(400);
        echo json_encode(['error' => 'Section key is required.']);
        exit();
    }

    $titleEn = trim($data['title_en'] ?? '');
    $titleAm = trim($data['title_am'] ?? '');
    $contentEn = trim($data['content_en'] ?? '');
    $contentAm = trim($data['content_am'] ?? '');
    $imageUrl = str_replace('\\', '/', trim($data['image_url'] ?? ''));
    if (strpos($imageUrl, '/react-app/public') === 0) {
        $imageUrl = str_replace('/react-app/public', '', $imageUrl);
    }
    if (strpos($imageUrl, 'DM154/uploads/') === 0) {
        $imageUrl = '/' . $imageUrl;
    } elseif (strpos($imageUrl, 'uploads/') === 0) {
        $imageUrl = '/' . $imageUrl;
    } elseif (strpos($imageUrl, 'images/') === 0) {
        $imageUrl = '/' . $imageUrl;
    }
    $metaJson = isset($data['meta_json']) ? (is_string($data['meta_json']) ? $data['meta_json'] : json_encode($data['meta_json'])) : null;

    $chk = $pdo->prepare("SELECT COUNT(*) FROM `page_sections` WHERE `section_key` = ?");
    $chk->execute([$sectionKey]);
    if ($chk->fetchColumn() > 0) {
        $stmt = $pdo->prepare("UPDATE `page_sections` SET `title_en` = ?, `title_am` = ?, `content_en` = ?, `content_am` = ?, `image_url` = ?, `meta_json` = COALESCE(?, `meta_json`) WHERE `section_key` = ?");
        $stmt->execute([$titleEn, $titleAm, $contentEn, $contentAm, $imageUrl, $metaJson, $sectionKey]);
    } else {
        $sectionGroup = trim($data['section_group'] ?? 'general');
        $stmt = $pdo->prepare("INSERT INTO `page_sections` (`section_key`, `section_group`, `title_en`, `title_am`, `content_en`, `content_am`, `image_url`, `meta_json`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$sectionKey, $sectionGroup, $titleEn, $titleAm, $contentEn, $contentAm, $imageUrl, $metaJson ?: '{}']);
    }

    echo json_encode(['success' => true, 'message' => 'Section updated successfully.']);
    exit();
}
