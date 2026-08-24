import Client from 'ssh2-sftp-client';
import { Client as SSHClient } from 'ssh2';
import path from 'path';

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

async function deploy() {
  const sftp = new Client();
  try {
    console.log('[SFTP] Connecting to Hostinger server...');
    await sftp.connect(config);
    console.log('[SFTP] Connected successfully.');

    // 1. Upload specific updated and new files
    const filesToUpload = [
      'app/Console/Kernel.php',
      'app/Providers/TelescopeServiceProvider.php',
      'config/app.php',
      'config/telescope.php',
      'composer.json',
      'composer.lock',
    ];

    for (const relPath of filesToUpload) {
      const localFile = path.resolve(relPath);
      const remoteFile = `${REMOTE_DIR}/${relPath.replace(/\\/g, '/')}`;
      console.log(`[SFTP] Uploading file: ${relPath}`);
      const remoteDir = path.posix.dirname(remoteFile);
      await sftp.mkdir(remoteDir, true);
      await sftp.fastPut(localFile, remoteFile);
    }

    // 2. Upload directories
    console.log('[SFTP] Uploading public/vendor/telescope directory...');
    await sftp.uploadDir(path.resolve('public/vendor/telescope'), `${REMOTE_DIR}/public/vendor/telescope`);

    await sftp.end();
    console.log('[SFTP] All files uploaded successfully.');

    // 3. Run SSH commands for migrations and cache clearing
    console.log('[SSH] Connecting to execute database migrations and cache optimization...');
    await new Promise((resolve, reject) => {
      const conn = new SSHClient();
      conn.on('ready', () => {
        console.log('[SSH] Connected. Running commands...');
        const cmds = `
          cd ${REMOTE_DIR}
          
          echo "=== Setting file permissions ==="
          chmod -R 755 .
          chmod -R 775 storage bootstrap/cache 2>/dev/null || true
          
          echo "=== Installing PHP dependencies ==="
          composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts 2>&1
          
          echo "=== Discovering Packages ==="
          php artisan package:discover
          
          echo "=== Running Database Migrations ==="
          php artisan migrate --force
          
          echo "=== Publishing Telescope Assets ==="
          php artisan telescope:publish
          
          echo "=== Clearing and Rebuilding Laravel Caches ==="
          php artisan optimize:clear
          php artisan config:cache
          php artisan route:cache
          php artisan view:cache
          
          echo "=== Production Deployment Complete ==="
        `;
        conn.exec(cmds, (err, stream) => {
          if (err) { reject(err); return; }
          stream.on('close', (code) => {
            console.log(`[SSH] Commands finished with exit code ${code}`);
            conn.end();
            resolve(code);
          }).on('data', (data) => {
            process.stdout.write('STDOUT: ' + data);
          }).stderr.on('data', (data) => {
            process.stderr.write('STDERR: ' + data);
          });
        });
      }).on('error', reject).connect(config);
    });

    console.log('\n[DEPLOY] Enterprise PDF Engine Production Deployment Completed Successfully!');
  } catch (err) {
    console.error('[DEPLOY ERROR]:', err);
    process.exit(1);
  }
}

deploy();
