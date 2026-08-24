import Client from 'ssh2-sftp-client';
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

async function run() {
  const sftp = new Client();
  const ZIP_FILE = 'deploy3.zip';
  try {
    console.log('Connecting SFTP...');
    await sftp.connect(config);

    console.log(`Uploading ${ZIP_FILE}...`);
    await sftp.fastPut(`../${ZIP_FILE}`, `/home/u881397359/domains/nenobet.live/${ZIP_FILE}`);

    await sftp.end();
    console.log('SFTP Uploads finished.');

    console.log('Connecting SSH...');
    const conn = new SSHClient();
    conn.on('ready', () => {
      console.log('SSH Ready');
      const cmds = `
        cd /home/u881397359/domains/nenobet.live
        
        # 2. Delete public_html contents safely
        echo "Emptying public_html..."
        rm -rf public_html/*
        rm -rf public_html/.[!.]*
        
        # 3. Extract fresh files using PHP
        echo "Extracting ${ZIP_FILE} using PHP ZipArchive..."
        echo '<?php $zip = new ZipArchive; $res = $zip->open("${ZIP_FILE}"); if ($res === TRUE) { $zip->extractTo("public_html/"); $zip->close(); echo "Extracted successfully\\n"; } else { echo "Failed to extract\\n"; }' > unzip.php
        php unzip.php
        rm unzip.php
        
        # 4. Move public folder contents to root and fix index.php
        cd public_html
        mv public/* . || true
        mv public/.[!.]* . || true
        rmdir public || true
        sed -i "s|__DIR__.'/../vendor/autoload.php'|__DIR__.'/vendor/autoload.php'|g" index.php
        sed -i "s|__DIR__.'/../bootstrap/app.php'|__DIR__.'/bootstrap/app.php'|g" index.php
        sed -i "s|\\\\$app = require_once __DIR__.'/bootstrap/app.php';|\\\\$app = require_once __DIR__.'/bootstrap/app.php';\\\\n\\\\$app->bind('path.public', function() { return __DIR__; });|g" index.php
        
        # 5. Setup Laravel
        cp .env.example .env
        sed -i "s/DB_DATABASE=.*/DB_DATABASE=u881397359_bdnsi/g" .env
        sed -i "s/DB_USERNAME=.*/DB_USERNAME=u881397359_bdnsi/g" .env
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=NJnaeem11./g" .env
        sed -i "s|APP_URL=.*|APP_URL=https://nenobet.live|g" .env
        sed -i "s/APP_ENV=.*/APP_ENV=production/g" .env
        sed -i "s/APP_DEBUG=.*/APP_DEBUG=false/g" .env
        sed -i "s/CACHE_DRIVER=.*/CACHE_DRIVER=file/g" .env
        sed -i "s/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/g" .env
        sed -i "s/SESSION_DRIVER=.*/SESSION_DRIVER=file/g" .env
        
        echo "Creating storage structure..."
        mkdir -p storage/framework/cache/data
        mkdir -p storage/framework/views
        mkdir -p storage/framework/sessions
        mkdir -p storage/logs
        mkdir -p storage/app/public
        mkdir -p bootstrap/cache
        
        echo "Setting permissions..."
        chmod -R 755 .
        chmod -R 775 storage bootstrap/cache
        
        echo "Caching Configs..."
        php artisan key:generate
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        
        echo "DONE!"
      `;
      conn.exec(cmds, (err, stream) => {
        if(err) throw err;
        stream.on('close', (code) => {
          console.log('SSH Finished with code ' + code);
          conn.end();
        }).on('data', data => console.log('STDOUT: ' + data))
          .stderr.on('data', data => console.error('STDERR: ' + data));
      });
    }).connect(config);

  } catch(e) {
    console.error(e);
  }
}

run();
