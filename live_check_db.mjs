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

async function checkDb() {
  return new Promise((resolve, reject) => {
    const conn = new SSHClient();
    conn.on('ready', () => {
      console.log('[SSH] Connected. Checking DB...');

      const commands = `
        cd ${REMOTE_DIR}
        php artisan tinker --execute="echo \\App\\Models\\DocumentTemplate::where('is_builtin', 1)->count(); echo '\\n';" 2>&1
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

checkDb()
  .then(code => {
    console.log('Check finished with code', code);
    process.exit(code);
  })
  .catch(err => {
    console.error('Check error:', err);
    process.exit(1);
  });
