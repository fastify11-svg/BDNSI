<?php
echo "bootstrap/cache exists: " . (is_dir(__DIR__.'/../bootstrap/cache') ? 'Yes' : 'No') . "<br>";
echo "bootstrap/cache writable: " . (is_writable(__DIR__.'/../bootstrap/cache') ? 'Yes' : 'No') . "<br>";
echo "storage/framework/views exists: " . (is_dir(__DIR__.'/../storage/framework/views') ? 'Yes' : 'No') . "<br>";
echo "storage/framework/views writable: " . (is_writable(__DIR__.'/../storage/framework/views') ? 'Yes' : 'No') . "<br>";
$files = glob(__DIR__.'/../bootstrap/cache/*');
echo "bootstrap/cache files:<br>";
print_r($files);
?>
