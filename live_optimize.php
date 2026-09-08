<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$commands = ['optimize:clear', 'config:clear', 'route:clear', 'view:clear'];
foreach($commands as $cmd) {
    $kernel->handle(
        new Symfony\Component\Console\Input\ArrayInput(['command' => $cmd]),
        $output = new Symfony\Component\Console\Output\BufferedOutput()
    );
    echo $cmd . ": " . $output->fetch() . "\n";
}
unlink(__FILE__);
