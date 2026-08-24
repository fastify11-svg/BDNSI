const ftp = require('basic-ftp');
async function run() {
    const client = new ftp.Client();
    require('dotenv').config({ path: '.env.deploy' });
    if (!process.env.DEPLOY_HOST) {
        require('dotenv').config();
    }
    
    if (!process.env.DEPLOY_HOST || !process.env.DEPLOY_PASSWORD) {
        console.error('[ERROR] Missing deployment credentials in .env.deploy');
        process.exit(1);
    }

    try {
        await client.access({
            host: process.env.DEPLOY_HOST,
            user: process.env.DEPLOY_USERNAME,
            password: process.env.DEPLOY_PASSWORD,
            secure: false
        });
        await client.uploadFrom('check.php', 'domains/nenobet.live/public_html/check.php');
        console.log('Upload success');
    } catch(err) {
        console.error(err);
    }
    client.close();
}
run();
