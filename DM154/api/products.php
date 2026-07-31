<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$pdo = Database::getConnection();

// Seed initial products if count is 0
$stmtCount = $pdo->query("SELECT COUNT(*) FROM `products`");
if ($stmtCount->fetchColumn() == 0) {
    $jsonPath = file_exists(__DIR__ . '/../data/products.json') ? (__DIR__ . '/../data/products.json') : (__DIR__ . '/../../src/data/products.json');
    $productsData = [];
    if (file_exists($jsonPath)) {
        $raw = file_get_contents($jsonPath);
        $decoded = json_decode($raw, true);
        $productsData = $decoded['products'] ?? [];
    }

    if (!empty($productsData)) {
        $pdo->exec("TRUNCATE TABLE `products`");
        $ins = $pdo->prepare("INSERT INTO `products` (`name_en`, `name_am`, `sku`, `category`, `category_am`, `short_desc_en`, `short_desc_am`, `full_desc_en`, `full_desc_am`, `specs_json`, `image_url`, `is_published`, `is_featured`, `sort_order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $idx = 1;
        foreach ($productsData as $p) {
            $nameEn = $p['name'] ?? '';
            $sku = $p['model'] ?? '';
            $category = $p['category'] ?? 'Solar Pumps';
            $shortDesc = $p['use'] ?? '';
            $fullDesc = $p['details'] ?? '';
            $image = $p['image'] ?? '';
            $specs = array_merge($p['features'] ?? [], $p['specs'] ?? []);
            
            $ins->execute([
                $nameEn,
                $nameEn, // amharic placeholder
                $sku,
                $category,
                $category,
                $shortDesc,
                $shortDesc,
                $fullDesc,
                $fullDesc,
                json_encode($specs),
                $image,
                1, // is_published
                $idx <= 6 ? 1 : 0, // is_featured for first 6
                $idx
            ]);
            $idx++;
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM `products` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'product' => $stmt->fetch()]);
        exit();
    }

    $all = isset($_GET['all']) && $_GET['all'] === '1';
    if ($all) {
        $stmt = $pdo->query("SELECT * FROM `products` ORDER BY `sort_order` ASC, `id` ASC");
    } else {
        $stmt = $pdo->query("SELECT * FROM `products` WHERE `is_published` = 1 ORDER BY `sort_order` ASC, `id` ASC");
    }
    echo json_encode(['success' => true, 'products' => $stmt->fetchAll()]);
    exit();
}

if ($method === 'POST') {
    Auth::requireAuth();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $id = isset($data['id']) ? (int)$data['id'] : 0;
    $nameEn = trim($data['name_en'] ?? '');
    $nameAm = trim($data['name_am'] ?? $nameEn);
    $sku = trim($data['sku'] ?? $data['model'] ?? '');
    $category = trim($data['category'] ?? 'Solar Pumps');
    $categoryAm = trim($data['category_am'] ?? $category);
    $shortDescEn = trim($data['short_desc_en'] ?? $data['use'] ?? '');
    $shortDescAm = trim($data['short_desc_am'] ?? $shortDescEn);
    $fullDescEn = trim($data['full_desc_en'] ?? $data['details'] ?? '');
    $fullDescAm = trim($data['full_desc_am'] ?? $fullDescEn);
    $imageUrl = str_replace('\\', '/', trim($data['image_url'] ?? $data['image'] ?? ''));
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
    $isPublished = isset($data['is_published']) ? (int)$data['is_published'] : 1;
    $isFeatured = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
    $specsJson = isset($data['specs']) ? json_encode($data['specs']) : (isset($data['specs_json']) ? (is_string($data['specs_json']) ? $data['specs_json'] : json_encode($data['specs_json'])) : json_encode([]));

    if (!$nameEn) {
        http_response_code(400);
        echo json_encode(['error' => 'Product name is required.']);
        exit();
    }

    if ($id > 0) {
        $stmt = $pdo->prepare("UPDATE `products` SET `name_en` = ?, `name_am` = ?, `sku` = ?, `category` = ?, `category_am` = ?, `short_desc_en` = ?, `short_desc_am` = ?, `full_desc_en` = ?, `full_desc_am` = ?, `specs_json` = ?, `image_url` = ?, `is_published` = ?, `is_featured` = ? WHERE `id` = ?");
        $stmt->execute([$nameEn, $nameAm, $sku, $category, $categoryAm, $shortDescEn, $shortDescAm, $fullDescEn, $fullDescAm, $specsJson, $imageUrl, $isPublished, $isFeatured, $id]);
        echo json_encode(['success' => true, 'message' => 'Product updated successfully.']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `products` (`name_en`, `name_am`, `sku`, `category`, `category_am`, `short_desc_en`, `short_desc_am`, `full_desc_en`, `full_desc_am`, `specs_json`, `image_url`, `is_published`, `is_featured`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nameEn, $nameAm, $sku, $category, $categoryAm, $shortDescEn, $shortDescAm, $fullDescEn, $fullDescAm, $specsJson, $imageUrl, $isPublished, $isFeatured]);
        echo json_encode(['success' => true, 'message' => 'Product created successfully.', 'id' => $pdo->lastInsertId()]);
    }
    exit();
}

if ($method === 'DELETE') {
    Auth::requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM `products` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product ID.']);
    }
    exit();
}
