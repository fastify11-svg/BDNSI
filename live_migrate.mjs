import { Client as SSHClient } from 'ssh2';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.deploy' });
// Fallback to regular .env if .env.deploy doesn't exist
if (!process.env.DEPLOY_HOST) {
    dotenv.config();
}

if (!process.env.DEPLOY_HOST || !process.env.DEPLOY_PASSWORD) {
    console.error('[ERROR] Missing deployment credentials. Please set DEPLOY_HOST, DEPLOY_USERNAME, DEPLOY_PASSWORD in .env or .env.deploy');
    process.exit(1);
}

const config = {
  host: process.env.DEPLOY_HOST,
  port: parseInt(process.env.DEPLOY_PORT || '65002', 10),
  username: process.env.DEPLOY_USERNAME,
  password: process.env.DEPLOY_PASSWORD
};

const REMOTE_DIR = '/home/u881397359/domains/nenobet.live/public_html';

async function migrate() {
  return new Promise((resolve, reject) => {
    const conn = new SSHClient();
    conn.on('ready', () => {
      console.log('[SSH] Connected. Running migration...');

      const commands = `
        cd ${REMOTE_DIR}
        php artisan migrate --path=database/migrations/2026_08_19_004917_add_is_builtin_and_blade_view_to_document_templates_table.php --force 2>&1
      `;

      conn.exec(commands, (err, stream) => {
        if (err) { reject(err); return; }
        stream.on('close', (code) => {
          console.log('SSH finished, exit code: ' + code);
          conn.end();
          resolve(code);
        }).on('data', (data) => {
          process.stdout.write('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          process.stdout.write('STDERR: ' + data);
        });
      });
    }).on('error', reject).connect(config);
  });
}

migrate()
  .then(code => {
    console.log('Migrate finished with code', code);
    process.exit(code);
  })
  .catch(err => {
    console.error('Migrate error:', err);
    process.exit(1);
  });
