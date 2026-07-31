<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$pdo = Database::getConnection();

$action = $_GET['action'] ?? 'dashboard';

if ($action === 'track') {
    $pageSlug = trim($_GET['page'] ?? $_POST['page'] ?? 'home');
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

    $stmt = $pdo->prepare("INSERT INTO `page_views` (`page_slug`, `ip_address`, `user_agent`) VALUES (?, ?, ?)");
    $stmt->execute([$pageSlug, $ip, $ua]);

    echo json_encode(['success' => true]);
    exit();
}

Auth::requireAuth();

if ($action === 'dashboard') {
    // Total Views
    $stmtTotalViews = $pdo->query("SELECT COUNT(*) FROM `page_views`");
    $totalViews = (int)$stmtTotalViews->fetchColumn();

    // Daily Views (Views today)
    $stmtDailyViews = $pdo->query("SELECT COUNT(*) FROM `page_views` WHERE DATE(`viewed_at`) = CURDATE()");
    $dailyViewsCount = (int)$stmtDailyViews->fetchColumn();

    // Monthly Views (Views this calendar month)
    $stmtMonthlyViews = $pdo->query("SELECT COUNT(*) FROM `page_views` WHERE MONTH(`viewed_at`) = MONTH(CURDATE()) AND YEAR(`viewed_at`) = YEAR(CURDATE())");
    $monthlyViewsCount = (int)$stmtMonthlyViews->fetchColumn();

    // Daily View Rate (Average views per day over the last 30 days)
    $stmtRate = $pdo->query("
        SELECT COALESCE(AVG(day_count), 0) FROM (
            SELECT DATE(`viewed_at`), COUNT(*) as day_count 
            FROM `page_views` 
            WHERE `viewed_at` >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
            GROUP BY DATE(`viewed_at`)
        ) as daily_avg
    ");
    $dailyViewRate = round((float)$stmtRate->fetchColumn(), 1);

    // Products Count
    $stmtProd = $pdo->query("SELECT COUNT(*) FROM `products` WHERE `is_published` = 1");
    $totalProducts = (int)$stmtProd->fetchColumn();

    // News Count
    $stmtNews = $pdo->query("SELECT COUNT(*) FROM `news` WHERE `is_published` = 1");
    $totalNews = (int)$stmtNews->fetchColumn();

    // Unread Messages Count
    $stmtMsg = $pdo->query("SELECT COUNT(*) FROM `contact_messages` WHERE `is_read` = 0");
    $unreadMessages = (int)$stmtMsg->fetchColumn();

    // Views by Day (Last 7 Days)
    $stmtDaily = $pdo->query("
        SELECT DATE(`viewed_at`) as view_date, COUNT(*) as count 
        FROM `page_views` 
        WHERE `viewed_at` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        GROUP BY DATE(`viewed_at`) 
        ORDER BY view_date ASC
    ");
    $dailyViews = $stmtDaily->fetchAll();

    // Top Pages breakdown
    $stmtTopPages = $pdo->query("
        SELECT `page_slug`, COUNT(*) as count 
        FROM `page_views` 
        GROUP BY `page_slug` 
        ORDER BY count DESC 
        LIMIT 5
    ");
    $topPages = $stmtTopPages->fetchAll();

    echo json_encode([
        'success' => true,
        'metrics' => [
            'total_views' => $totalViews,
            'daily_views' => $dailyViewsCount,
            'monthly_views' => $monthlyViewsCount,
            'daily_view_rate' => $dailyViewRate,
            'total_products' => $totalProducts,
            'total_news' => $totalNews,
            'unread_messages' => $unreadMessages,
            'growth_rate' => '+0%'
        ],
        'daily_views' => $dailyViews,
        'top_pages' => $topPages
    ]);
    exit();
}
