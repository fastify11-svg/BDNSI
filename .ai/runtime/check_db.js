const { spawnSync } = require('child_process');
const php = 'C:/xampp/php/php.exe';
const cwd = 'C:/BDNSI';

// Use artisan tinker via spawnSync with require
const script = `<?php
$comms = \\App\\Models\\Commission::with('team')->orderBy('id','desc')->take(5)->get();
foreach ($comms as $c) {
    echo "id={$c->id} team_id={$c->team_id} amount={$c->amount} status={$c->status} team=" . ($c->team ? $c->team->name : 'NULL') . "\\n";
}
echo "Total: " . \\App\\Models\\Commission::count() . "\\n";
`;

const tmpFile = 'C:/BDNSI/_comm_check.php';
require('fs').writeFileSync(tmpFile, script);

const r = spawnSync(php, ['artisan', 'tinker', `--execute=require '${tmpFile}'`], {
    cwd, encoding: 'utf8', timeout: 20000, stdio: ['ignore','pipe','pipe']
});
console.log('stdout:', r.stdout);
console.log('stderr:', r.stderr ? r.stderr.slice(0,300) : '');
require('fs').unlinkSync(tmpFile);
