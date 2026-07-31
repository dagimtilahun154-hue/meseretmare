<?php
// DM154 Admin Entry Loader
$installedLock = __DIR__ . '/config/installed.lock';

// Auto-redirect to 1-click setup if not installed
if (!file_exists($installedLock)) {
    header('Location: /DM154/install.php');
    exit();
}

$distHtml = __DIR__ . '/admin/dist/index.html';
if (file_exists($distHtml)) {
    $content = file_get_contents($distHtml);
    $content = str_replace('href="./assets/', 'href="admin/dist/assets/', $content);
    $content = str_replace('src="./assets/', 'src="admin/dist/assets/', $content);
    echo $content;
    exit();
}

http_response_code(404);
echo "Admin application build not found. Please run npm run build in DM154/admin.";
