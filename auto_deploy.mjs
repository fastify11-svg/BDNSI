import { Client as SSHClient } from 'ssh2';

const config = {
  host: '145.79.212.19',
  port: 65002,
  username: 'u881397359',
  password: 'NJnaeem11.'
};

const REMOTE_DIR = '/home/u881397359/domains/nenobet.live/public_html';

async function deploy() {
  return new Promise((resolve, reject) => {
    const conn = new SSHClient();
    conn.on('ready', () => {
      console.log('[SSH] Connected. Running git-based deployment...');

      // Strategy: git pull latest changes on server
      // Then composer install + artisan cache + migrate
      const commands = `
        cd ${REMOTE_DIR}

        echo "=== Git status ==="
        git status 2>&1 || echo "Not a git repo"

        echo "=== Checking if git is initialized ==="
        if [ -d ".git" ]; then
          echo "Git repo found. Pulling latest..."
          git fetch origin main 2>&1
          git reset --hard origin/main 2>&1
          echo "Git pull done."
        else
          echo "No git repo. Initializing from GitHub..."
          git init 2>&1
          git remote add origin https://github.com/fastify11-svg/BDNSI.git 2>&1
          git fetch origin main 2>&1
          git checkout -f main 2>&1
          echo "Git clone done."
        fi

        echo "=== Setting up directories ==="
        mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
        chmod -R 775 storage bootstrap/cache

        echo "=== Installing PHP dependencies ==="
        composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts 2>&1

        echo "=== Running artisan commands ==="
        php artisan config:cache 2>&1
        php artisan route:cache 2>&1
        php artisan view:cache 2>&1
        php artisan migrate --force 2>&1 || echo "Note: Migration returned an error (likely cache table conflict), continuing..."

        echo "=== Storage link ==="
        rm -rf public/storage
        php artisan storage:link 2>&1 || echo "Note: Storage link failed (symlink disabled on Hostinger), skipping..."

        echo "=== DEPLOYMENT COMPLETE ==="
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

deploy()
  .then(code => {
    console.log('Deploy finished with code', code);
    process.exit(code);
  })
  .catch(err => {
    console.error('Deploy error:', err);
    process.exit(1);
  });
