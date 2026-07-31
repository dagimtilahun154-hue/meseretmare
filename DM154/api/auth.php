<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? 'check';

switch ($action) {
    case 'login':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $username = trim($data['username'] ?? '');
        $password = trim($data['password'] ?? '');

        if (!$username || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required.']);
            exit();
        }

        $result = Auth::login($username, $password);
        if ($result) {
            echo json_encode([
                'success' => true,
                'user' => $result['user'],
                'token' => $result['token']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password.']);
        }
        break;

    case 'logout':
        Auth::logout();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;

    case 'check':
        if (Auth::check()) {
            echo json_encode([
                'authenticated' => true,
                'user' => Auth::getCurrentUser()
            ]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;

    case 'update':
        Auth::requireAuth();
        $user = Auth::getCurrentUser();
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: [];

        $name = trim($data['name'] ?? $user['name']);
        $email = trim($data['email'] ?? $user['email']);
        $newPassword = trim($data['password'] ?? '');

        $pdo = Database::getConnection();
        if ($newPassword) {
            $hash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE `admin_users` SET `name` = ?, `email` = ?, `password_hash` = ? WHERE `id` = ?");
            $stmt->execute([$name, $email, $hash, $user['id']]);
        } else {
            $stmt = $pdo->prepare("UPDATE `admin_users` SET `name` = ?, `email` = ? WHERE `id` = ?");
            $stmt->execute([$name, $email, $user['id']]);
        }

        $_SESSION['admin_user']['name'] = $name;
        $_SESSION['admin_user']['email'] = $email;

        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $_SESSION['admin_user']
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action.']);
        break;
}
