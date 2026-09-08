// Quick test that spawnSync tinker approach works on Windows
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runPhp(phpCode) {
    const tmpFile = path.join(process.cwd(), `_e2e_tmp_${Date.now()}.php`);
    const code = phpCode.trimStart().startsWith('<?php') ? phpCode : `<?php\n${phpCode}`;
    fs.writeFileSync(tmpFile, code);
    try {
        const result = spawnSync(
            'C:\\xampp\\php\\php.exe',
            ['artisan', 'tinker', `--execute=require '${tmpFile.replace(/\\/g, '/')}'`],
            { cwd: process.cwd(), encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] }
        );
        console.log('stdout:', result.stdout);
        console.log('stderr:', result.stderr ? result.stderr.slice(0, 200) : '');
        console.log('status:', result.status);
        return result.stdout || '';
    } finally {
        try { fs.unlinkSync(tmpFile); } catch {}
    }
}

runPhp(`
    $count = \\App\\Models\\Commission::count();
    $team = \\App\\Models\\Team::where('email', 'staff_e2e_comm@example.com')->first();
    echo "Total commissions: {$count}\\n";
    echo "Test team exists: " . ($team ? $team->id : 'NO') . "\\n";
`);
