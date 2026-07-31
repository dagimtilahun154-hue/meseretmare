<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/db.php';

set_cors_headers();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$name = trim($data['name'] ?? $data['fullName'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? $data['phoneNumber'] ?? '');
$subject = trim($data['subject'] ?? 'Website Inquiry');
$message = trim($data['message'] ?? $data['comments'] ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and message are required fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address.']);
    exit();
}

$pdo = Database::getConnection();
$stmt = $pdo->prepare("INSERT INTO `contact_messages` (`name`, `email`, `phone`, `subject`, `message`, `is_read`) VALUES (?, ?, ?, ?, ?, 0)");
$stmt->execute([$name, $email, $phone, $subject, $message]);

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been received successfully. We will get back to you shortly.',
    'id' => $pdo->lastInsertId()
]);
