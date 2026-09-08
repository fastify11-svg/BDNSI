const https = require('https');

const urls = [
    'https://nenobet.live/extract.php',
    'https://nenobet.live/live_migrate_exec.php',
    'https://nenobet.live/.env',
    'https://nenobet.live/migrate.php',
    'https://nenobet.live/scratch_hello.php'
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${url} -> ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(e);
    });
});
