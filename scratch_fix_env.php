<?php
$envPath = __DIR__.'/../.env';
if (!file_exists($envPath)) {
    echo "No .env found.";
    exit;
}

$envContent = file_get_contents($envPath);
$envContent = preg_replace('/^SESSION_DRIVER=.*$/m', 'SESSION_DRIVER=file', $envContent);

if (strpos($envContent, 'SESSION_DRIVER') === false) {
    $envContent .= "\nSESSION_DRIVER=file\n";
}

file_put_contents($envPath, $envContent);

echo ".env updated. SESSION_DRIVER is now file.";
?>
