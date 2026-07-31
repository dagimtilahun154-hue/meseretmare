<?php
require_once __DIR__ . '/../config/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // If database doesn't exist, attempt to create it
                if ($e->getCode() == 1049) {
                    self::createDatabase();
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                } else {
                    header('Content-Type: application/json');
                    http_response_code(500);
                    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
                    exit();
                }
            }

            self::bootstrapSchema(self::$instance);
        }

        return self::$instance;
    }

    private static function createDatabase() {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    }

    private static function bootstrapSchema(PDO $pdo) {
        // Create admin_users table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(100) DEFAULT 'Meseret Admin',
            `email` VARCHAR(100) NOT NULL,
            `role` VARCHAR(50) DEFAULT 'Administrator',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Seed default admin if empty (username: admin, pass: admin123)
        $stmt = $pdo->query("SELECT COUNT(*) FROM `admin_users`");
        if ($stmt->fetchColumn() == 0) {
            $defaultHash = password_hash('admin123', PASSWORD_DEFAULT);
            $stmtInsert = $pdo->prepare("INSERT INTO `admin_users` (username, password_hash, name, email, role) VALUES ('admin', ?, 'Meseret Admin', 'admin@meseretmare.com', 'System Administrator')");
            $stmtInsert->execute([$defaultHash]);
        }

        // Create page_sections table
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

        // Create products table
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

        // Create news table
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

        // Create contact_messages table
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

        // Create page_views table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `page_views` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `page_slug` VARCHAR(100) NOT NULL,
            `ip_address` VARCHAR(50) DEFAULT '',
            `user_agent` VARCHAR(255) DEFAULT '',
            `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }
}
