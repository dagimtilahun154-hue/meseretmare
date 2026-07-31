<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$pdo = Database::getConnection();



$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list';

    if ($action === 'unread_count') {
        $stmt = $pdo->query("SELECT COUNT(*) as unread_count FROM `contact_messages` WHERE `is_read` = 0");
        echo json_encode(['success' => true, 'unread_count' => (int)$stmt->fetchColumn()]);
        exit();
    }

    Auth::requireAuth();
    $stmt = $pdo->query("SELECT * FROM `contact_messages` ORDER BY `created_at` DESC");
    $messages = $stmt->fetchAll();

    $stmtUnread = $pdo->query("SELECT COUNT(*) FROM `contact_messages` WHERE `is_read` = 0");
    $unreadCount = (int)$stmtUnread->fetchColumn();

    echo json_encode([
        'success' => true,
        'messages' => $messages,
        'unread_count' => $unreadCount
    ]);
    exit();
}

if ($method === 'POST') {
    Auth::requireAuth();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $action = $data['action'] ?? 'toggle_read';
    $id = (int)($data['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid message ID is required.']);
        exit();
    }

    if ($action === 'toggle_read') {
        $isRead = isset($data['is_read']) ? (int)$data['is_read'] : 1;
        $stmt = $pdo->prepare("UPDATE `contact_messages` SET `is_read` = ? WHERE `id` = ?");
        $stmt->execute([$isRead, $id]);
        echo json_encode(['success' => true, 'message' => 'Message status updated.']);
    } elseif ($action === 'mark_all_read') {
        $pdo->exec("UPDATE `contact_messages` SET `is_read` = 1");
        echo json_encode(['success' => true, 'message' => 'All messages marked as read.']);
    }
    exit();
}

if ($method === 'DELETE') {
    Auth::requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM `contact_messages` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Message deleted successfully.']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid message ID.']);
    }
    exit();
}
