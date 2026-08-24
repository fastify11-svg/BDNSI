const fs = require('fs');
const path = require('path');

const files = [
  'direct_deploy.mjs',
  'auto_deploy.mjs',
  'frontend_deploy.mjs',
  'full_auto_deploy.mjs',
  'deploy_telescope.mjs',
  'live_migrate.mjs',
  'live_check_db.mjs',
  'ftp-check.js',
  'upload_images.mjs',
  'upload_index.mjs'
];

const configRegex = /const\s+config\s*=\s*\{\s*host:\s*['"][\d\.]+['"],\s*port:\s*\d+,\s*username:\s*['"][a-zA-Z0-9_]+['"],\s*password:\s*['"][^'"]+['"]\s*\};/gs;

const replacement = `import * as dotenv from 'dotenv';
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
};`;

const configRegexCJS = /const\s+config\s*=\s*\{\s*host:\s*['"][\d\.]+['"],\s*port:\s*\d+,\s*username:\s*['"][a-zA-Z0-9_]+['"],\s*password:\s*['"][^'"]+['"]\s*\};/gs;

const replacementCJS = `require('dotenv').config({ path: '.env.deploy' });
if (!process.env.DEPLOY_HOST) {
    require('dotenv').config();
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
};`;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's CJS or ESM
    const isESM = file.endsWith('.mjs') || content.includes('import ') || content.includes('export ');
    const rep = isESM ? replacement : replacementCJS;
    
    if (content.match(configRegex)) {
        content = content.replace(configRegex, rep);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Regex did not match in ${file}, or already updated.`);
    }
  } else {
    console.log(`File ${file} not found.`);
  }
}
