<?php
require_once __DIR__ . '/../core/auth.php';

set_cors_headers();
header('Content-Type: application/json');

Auth::requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit();
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error occurred.']);
    exit();
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileTmp = $file['tmp_name'];
$fileSize = $file['size'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

$allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
if (!in_array($fileExt, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file format. Allowed formats: JPG, PNG, WEBP, GIF, SVG.']);
    exit();
}

if ($fileSize > 15 * 1024 * 1024) { // 15MB max
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds maximum limit of 15MB.']);
    exit();
}

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

$finalFileName = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4));
$isConvertedToWebp = false;
$newFileName = '';
$targetPath = '';

// Automatic WebP Conversion via PHP GD Library for JPG and PNG files
if (function_exists('imagewebp') && in_array($fileExt, ['jpg', 'jpeg', 'png'])) {
    $srcImg = null;
    if ($fileExt === 'jpg' || $fileExt === 'jpeg') {
        if (function_exists('imagecreatefromjpeg')) {
            $srcImg = @imagecreatefromjpeg($fileTmp);
        }
    } elseif ($fileExt === 'png') {
        if (function_exists('imagecreatefrompng')) {
            $srcImg = @imagecreatefrompng($fileTmp);
            if ($srcImg) {
                imagepalettetotruecolor($srcImg);
                imagealphablending($srcImg, true);
                imagesavealpha($srcImg, true);
            }
        }
    }

    if ($srcImg) {
        $webpTarget = UPLOAD_DIR . $finalFileName . '.webp';
        if (@imagewebp($srcImg, $webpTarget, 85)) {
            imagedestroy($srcImg);
            $newFileName = $finalFileName . '.webp';
            $targetPath = $webpTarget;
            $isConvertedToWebp = true;
            $fileSize = filesize($targetPath);
        } else {
            imagedestroy($srcImg);
        }
    }
}

if (!$isConvertedToWebp) {
    $newFileName = $finalFileName . '.' . $fileExt;
    $targetPath = UPLOAD_DIR . $newFileName;
    move_uploaded_file($fileTmp, $targetPath);
}

if (file_exists($targetPath)) {
    $webUrl = UPLOAD_URL . $newFileName;

    // Get image dimensions if available
    $dimensions = null;
    if (function_exists('getimagesize')) {
        $info = @getimagesize($targetPath);
        if ($info) {
            $dimensions = $info[0] . 'x' . $info[1];
        }
    }

    echo json_encode([
        'success' => true,
        'url' => $webUrl,
        'filename' => $newFileName,
        'size' => $fileSize,
        'size_formatted' => round($fileSize / 1024, 1) . ' KB',
        'dimensions' => $dimensions,
        'is_webp' => true,
        'message' => 'Image uploaded and optimized successfully.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save uploaded file on server.']);
}
