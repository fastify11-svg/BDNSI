import Client from 'ssh2-sftp-client';
import fs from 'fs';

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
  try {
    console.log('Connecting SFTP...');
    await sftp.connect(config);
    
    console.log('Uploading storage_public.tar.gz...');
    await sftp.fastPut('storage_public.tar.gz', '/home/u881397359/domains/nenobet.live/public_html/storage_public.tar.gz');

    await sftp.end();
    console.log('SFTP Uploads finished.');
  } catch (e) {
    console.error(e);
  }
}

run();
