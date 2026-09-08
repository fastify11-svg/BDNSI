<?php
unlink(__DIR__ . '/extract.php');
unlink(__DIR__ . '/../extract.php');
unlink(__DIR__ . '/../vendor.zip');
unlink(__DIR__ . '/extract_log.txt');
unlink(__FILE__);
echo "Cleaned up";
