<?php
$f1 = __DIR__.'/../bootstrap/cache/packages.php';
$f2 = __DIR__.'/../bootstrap/cache/services.php';
if (file_exists($f1)) { unlink($f1); echo "Deleted packages.php<br>"; }
if (file_exists($f2)) { unlink($f2); echo "Deleted services.php<br>"; }
$f3 = __DIR__.'/../bootstrap/cache/config.php';
if (file_exists($f3)) { unlink($f3); echo "Deleted config.php<br>"; }
$f4 = __DIR__.'/../bootstrap/cache/routes.php';
if (file_exists($f4)) { unlink($f4); echo "Deleted routes.php<br>"; }
echo "Done.";
?>
