const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

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

archive.finalize();
