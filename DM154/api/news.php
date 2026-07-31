<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$pdo = Database::getConnection();

$stmtCount = $pdo->query("SELECT COUNT(*) FROM `news`");
if ($stmtCount->fetchColumn() == 0) {
    $jsonPath = file_exists(__DIR__ . '/../data/news.json') ? (__DIR__ . '/../data/news.json') : (__DIR__ . '/../../src/data/news.json');
    $newsData = [];
    if (file_exists($jsonPath)) {
        $raw = file_get_contents($jsonPath);
        $decoded = json_decode($raw, true);
        $newsData = $decoded['posts'] ?? [];
    }

    if (!empty($newsData)) {
        $pdo->exec("TRUNCATE TABLE `news`");
        $ins = $pdo->prepare("INSERT INTO `news` (`title_en`, `title_am`, `slug`, `excerpt_en`, `excerpt_am`, `content_en`, `content_am`, `category`, `category_am`, `image_url`, `published_date`, `view_count`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($newsData as $n) {
            $titleEn = $n['title'] ?? '';
            $titleAm = $n['title'] ?? '';
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $titleEn), '-')) ?: ('news-' . ($n['id'] ?? rand(10, 999)));
            $excerpt = $n['excerpt'] ?? '';
            $contentArr = $n['content'] ?? [$excerpt];
            $content = is_array($contentArr) ? implode("\n\n", $contentArr) : $contentArr;
            $cat = $n['category'] ?? 'News';
            $image = $n['image'] ?? '';
            $date = date('Y-m-d', strtotime($n['date'] ?? 'now'));
            
            $ins->execute([
                $titleEn,
                $titleAm,
                $slug,
                $excerpt,
                $excerpt,
                $content,
                $content,
                $cat,
                $cat,
                $image,
                $date,
                0, // view count
                1 // is_published
            ]);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

if ($method === 'GET') {
    if ($action === 'view' && isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $pdo->exec("UPDATE `news` SET `view_count` = `view_count` + 1 WHERE `id` = {$id}");
        $stmt = $pdo->prepare("SELECT * FROM `news` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'news' => $stmt->fetch()]);
        exit();
    }

    $all = isset($_GET['all']) && $_GET['all'] === '1';
    if ($all) {
        $stmt = $pdo->query("SELECT * FROM `news` ORDER BY `published_date` DESC, `id` DESC");
    } else {
        $stmt = $pdo->query("SELECT * FROM `news` WHERE `is_published` = 1 ORDER BY `published_date` DESC, `id` DESC");
    }
    echo json_encode(['success' => true, 'news' => $stmt->fetchAll()]);
    exit();
}

if ($method === 'POST') {
    Auth::requireAuth();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $id = isset($data['id']) ? (int)$data['id'] : 0;
    $titleEn = trim($data['title_en'] ?? $data['title'] ?? '');
    $titleAm = trim($data['title_am'] ?? $titleEn);
    $excerptEn = trim($data['excerpt_en'] ?? $data['excerpt'] ?? '');
    $excerptAm = trim($data['excerpt_am'] ?? $excerptEn);
    $contentEn = trim($data['content_en'] ?? (is_array($data['content'] ?? null) ? implode("\n\n", $data['content']) : ($data['content'] ?? '')));
    $contentAm = trim($data['content_am'] ?? $contentEn);
    $category = trim($data['category'] ?? 'News');
    $categoryAm = trim($data['category_am'] ?? $category);
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
    $publishedDate = trim($data['published_date'] ?? $data['date'] ?? date('Y-m-d'));
    $isPublished = isset($data['is_published']) ? (int)$data['is_published'] : 1;

    if (!$titleEn) {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required.']);
        exit();
    }

    $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $titleEn), '-')) ?: 'news';
    $slug = $baseSlug;
    $chkSlug = $pdo->prepare("SELECT COUNT(*) FROM `news` WHERE `slug` = ? AND `id` != ?");
    $chkSlug->execute([$slug, $id]);
    if ($chkSlug->fetchColumn() > 0) {
        $slug = $baseSlug . '-' . time() . '-' . rand(100, 999);
    }

    if ($id > 0) {
        $stmt = $pdo->prepare("UPDATE `news` SET `title_en` = ?, `title_am` = ?, `slug` = ?, `excerpt_en` = ?, `excerpt_am` = ?, `content_en` = ?, `content_am` = ?, `category` = ?, `category_am` = ?, `image_url` = ?, `published_date` = ?, `is_published` = ? WHERE `id` = ?");
        $stmt->execute([$titleEn, $titleAm, $slug, $excerptEn, $excerptAm, $contentEn, $contentAm, $category, $categoryAm, $imageUrl, $publishedDate, $isPublished, $id]);
        echo json_encode(['success' => true, 'message' => 'Article updated successfully.']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `news` (`title_en`, `title_am`, `slug`, `excerpt_en`, `excerpt_am`, `content_en`, `content_am`, `category`, `category_am`, `image_url`, `published_date`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$titleEn, $titleAm, $slug, $excerptEn, $excerptAm, $contentEn, $contentAm, $category, $categoryAm, $imageUrl, $publishedDate, $isPublished]);
        echo json_encode(['success' => true, 'message' => 'Article created successfully.', 'id' => $pdo->lastInsertId()]);
    }
    exit();
}

if ($method === 'DELETE') {
    Auth::requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM `news` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Article deleted successfully.']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid article ID.']);
    }
    exit();
}
