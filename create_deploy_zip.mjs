import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

const output = fs.createWriteStream('deploy.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes written to deploy.zip');
});

archive.pipe(output);

archive.glob('**/*', {
  cwd: '.',
  ignore: [
    'node_modules/**',
    '.git/**',
    'tests/**',
    'playwright-report/**',
    'test-results/**',
    'deploy.zip',
    '.env',
    '.env.testing',
    'database_backup*.sql'
  ]
});

// We need .env specifically for staging. We will rename deploy.env.example to .env
// Wait, the plan says we configure .env manually or we provide one.
// I will just include the files as they are, and we upload a new .env separately.

archive.finalize();
