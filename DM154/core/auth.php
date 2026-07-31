<?php
require_once __DIR__ . '/db.php';

class Auth {
    public static function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function login(string $username, string $password): ?array {
        self::startSession();
        $pdo = Database::getConnection();
        
        $stmt = $pdo->prepare("SELECT * FROM `admin_users` WHERE `username` = ? OR `email` = ?");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']);
            $_SESSION['admin_user'] = $user;
            $_SESSION['admin_token'] = bin2hex(random_bytes(32));
            return [
                'user' => $user,
                'token' => $_SESSION['admin_token']
            ];
        }

        return null;
    }

    public static function check(): bool {
        self::startSession();
        
        // Check session
        if (isset($_SESSION['admin_user'])) {
            return true;
        }

        // Check Authorization header token if provided
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            if (isset($_SESSION['admin_token']) && $_SESSION['admin_token'] === $token) {
                return true;
            }
        }

        return false;
    }

    public static function getCurrentUser(): ?array {
        self::startSession();
        return $_SESSION['admin_user'] ?? null;
    }

    public static function logout() {
        self::startSession();
        unset($_SESSION['admin_user']);
        unset($_SESSION['admin_token']);
        session_destroy();
    }

    public static function requireAuth() {
        set_cors_headers();
        if (!self::check()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized access. Please log in.']);
            exit();
        }
    }
}
