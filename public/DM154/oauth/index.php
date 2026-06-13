<?php
// Simple GitHub OAuth Provider for Decap CMS on cPanel
// Place this file in: public_html/DM154/oauth/index.php

// 1. Configuration
define('OAUTH_CLIENT_ID', 'Ov23lienPDIybUKYmEOm');
define('OAUTH_CLIENT_SECRET', 'b65b3660e78b102a2fe4410ac7259f30030b55fc');

$provider = $_GET['provider'] ?? '';
$action = $_GET['action'] ?? '';

// Start a session to verify state
session_start();

// 2. Redirect to GitHub login page
if ($provider === 'github' && !$action) {
    $state = bin2hex(random_bytes(16));
    $_SESSION['oauth_state'] = $state;

    // Build redirect URI to point back to this same script with action=callback
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $redirect_uri = $protocol . $_SERVER['HTTP_HOST'] . strtok($_SERVER['REQUEST_URI'], '?') . '?provider=github&action=callback';

    $auth_url = 'https://github.com/login/oauth/authorize?' . http_build_query([
        'client_id' => OAUTH_CLIENT_ID,
        'redirect_uri' => $redirect_uri,
        'scope' => 'repo,user',
        'state' => $state
    ]);

    header('Location: ' . $auth_url);
    exit;
}

// 3. Callback from GitHub
if ($provider === 'github' && $action === 'callback') {
    $code = $_GET['code'] ?? '';
    $state = $_GET['state'] ?? '';
    $saved_state = $_SESSION['oauth_state'] ?? '';

    // Verify state
    if (empty($code) || empty($state) || $state !== $saved_state) {
        die('Invalid state or authentication code. Please try logging in again.');
    }

    // Exchange authorization code for access token
    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'client_id' => OAUTH_CLIENT_ID,
        'client_secret' => OAUTH_CLIENT_SECRET,
        'code' => $code
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $token = $data['access_token'] ?? '';
    $error = $data['error'] ?? '';

    if ($error || !$token) {
        $message = 'error';
        $content = json_encode(['error' => $error ?: 'Failed to obtain access token']);
    } else {
        $message = 'authorization:github:success';
        $content = json_encode([
            'token' => $token,
            'provider' => 'github'
        ]);
    }

    // Output HTML to send message back to Decap CMS parent window
    ?>
    <!DOCTYPE html>
    <html>
    <head>
      <title>GitHub OAuth Authentication</title>
    </head>
    <body>
      <p>Completing authentication, please wait...</p>
      <script>
        (function() {
          if (window.opener) {
            // Send success or error state
            window.opener.postMessage('<?php echo $message; ?>', '*');
            // Send the JSON content containing token/error payload
            window.opener.postMessage('<?php echo addslashes($content); ?>', '*');
            // Close popup
            window.close();
          } else {
            document.body.innerHTML = "<p>Authentication complete. You can close this window now.</p>";
          }
        })();
      </script>
    </body>
    </html>
    <?php
    exit;
}
?>
