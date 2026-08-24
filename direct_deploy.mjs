import Client from 'ssh2-sftp-client';
import { Client as SSHClient } from 'ssh2';
import path from 'path';

const config = {
  host: '145.79.212.19',
  port: 65002,
  username: 'u881397359',
  password: 'NJnaeem11.'
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
      'app/Http/Kernel.php',
      'app/Http/Middleware/HandleInertiaRequests.php',
      'app/Http/Middleware/CaptureReferralMiddleware.php',
      'app/Http/Middleware/CheckStudentPortalActive.php',
      'app/Http/Requests/CenterStoreRequest.php',
      'app/Http/Requests/Student/Auth/LoginRequest.php',
      'app/Http/Controllers/Admin/BulkDocumentController.php',
      'app/Jobs/GenerateBulkDocumentsJob.php',
      'app/Services/PdfEngineService.php',
      'app/Models/Session.php',
      'app/Models/SiteConfig.php',
      'app/Models/Student.php',
      'app/Models/Subject.php',
      'app/Models/Team.php',
      'app/Scopes/StaffScope.php',
      'app/Traits/BelongsToStaff.php',
      'config/auth.php',
      'pdf_engine.mjs',
      'routes/admin.php',
      'routes/staff.php',
      'routes/student.php',
      'routes/web.php',
      'database/migrations/2026_08_24_060000_add_auth_and_referral_to_teams_table.php',
      'database/migrations/2026_08_24_060001_add_team_id_to_subjects_and_sessions_table.php',
      'database/migrations/2026_08_24_070000_add_toggle_student_portal_to_site_configs_table.php',
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
    console.log('[SFTP] Uploading app/Http/Controllers/Staff directory...');
    await sftp.uploadDir(path.resolve('app/Http/Controllers/Staff'), `${REMOTE_DIR}/app/Http/Controllers/Staff`);

    console.log('[SFTP] Uploading app/Http/Controllers/Student directory...');
    await sftp.uploadDir(path.resolve('app/Http/Controllers/Student'), `${REMOTE_DIR}/app/Http/Controllers/Student`);

    console.log('[SFTP] Uploading resources/views/student/document directory...');
    await sftp.uploadDir(path.resolve('resources/views/student/document'), `${REMOTE_DIR}/resources/views/student/document`);

    console.log('[SFTP] Uploading public/build directory...');
    await sftp.uploadDir(path.resolve('public/build'), `${REMOTE_DIR}/public/build`);

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
          
          echo "=== Running Database Migrations ==="
          php artisan migrate --force
          
          echo "=== Clearing and Rebuilding Laravel Caches ==="
          php artisan optimize:clear
          php artisan config:cache
          php artisan route:cache
          php artisan view:cache
          
          echo "=== Checking PDF Engine Routes ==="
          php artisan route:list | grep -i bulk || true
          
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
