<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function request($url, $method = 'GET', $data = [], $cookie = '') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://nenobet.live' . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    if ($method === 'POST' || $method === 'PUT') {
        if ($method === 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        } else {
            curl_setopt($ch, CURLOPT_POST, true);
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    }
    
    if ($cookie) {
        curl_setopt($ch, CURLOPT_COOKIE, $cookie);
    }
    
    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Extract new cookies
    preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $header, $matches);
    $cookies = [];
    foreach($matches[1] as $item) {
        parse_str($item, $cookieParsed);
        $cookies = array_merge($cookies, $cookieParsed);
    }
    
    $cookieStr = '';
    foreach ($cookies as $key => $val) {
        $cookieStr .= "$key=$val; ";
    }
    
    // Extract CSRF token from body if possible
    $csrf = '';
    preg_match('/<meta name="csrf-token" content="(.*?)">/', $body, $csrfMatch);
    if (isset($csrfMatch[1])) {
        $csrf = $csrfMatch[1];
    }
    
    return [
        'status' => $status,
        'body' => $body,
        'cookie' => rtrim($cookieStr, '; '),
        'csrf' => $csrf
    ];
}

echo "--- TEST 1: Unauthenticated Access ---\n";
$res1 = request('/admin/leads');
echo "Status: " . $res1['status'] . "\n\n";

echo "--- TEST 2: Login as Admin ---\n";
$resLoginGet = request('/admin/login');
$cookie = $resLoginGet['cookie'];
$csrf = $resLoginGet['csrf'];

$resLoginPost = request('/admin/login', 'POST', [
    '_token' => $csrf,
    'email' => 'admin@gmail.com',
    'password' => '12345678'
], $cookie);

// Combine cookies
$sessionCookie = $cookie . '; ' . $resLoginPost['cookie'];
echo "Login Post Status: " . $resLoginPost['status'] . "\n\n";

echo "--- TEST 3: Authenticated Admin Access ---\n";
$resAuth = request('/admin/leads', 'GET', [], $sessionCookie);
echo "Leads Index Status: " . $resAuth['status'] . "\n\n";

echo "--- TEST 4: Create Test Lead ---\n";
// Extract CSRF from the authenticated page
$csrfAuth = '';
preg_match('/<meta name="csrf-token" content="(.*?)">/', $resAuth['body'], $csrfMatch);
if (isset($csrfMatch[1])) {
    $csrfAuth = $csrfMatch[1];
}

$resCreate = request('/admin/leads', 'POST', [
    '_token' => $csrfAuth,
    'name' => 'Forensic Lead',
    'phone' => '01999999999',
    'source' => 'Website',
    'status' => 'New'
], $sessionCookie);
echo "Create Lead Status: " . $resCreate['status'] . "\n\n";
?>
