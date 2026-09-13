#!/usr/bin/env bash
set -euo pipefail

SOURCE_SHA="2e6c63ccb0b73ffab21ef74823d0827f7599c9a9"
ROOT="$GITHUB_WORKSPACE"
SRC="$ROOT/buildsrc"
OUT="$ROOT/package_out"

rm -rf "$SRC" "$OUT"
mkdir -p "$SRC" "$OUT/BDNSI_READY_UPLOAD"

git cat-file -e "${SOURCE_SHA}^{commit}"
git archive "$SOURCE_SHA" | tar -x -C "$SRC"
cd "$SRC"

# Start isolated MySQL used only to generate the fresh importable SQL file.
docker rm -f bdnsi-package-mysql >/dev/null 2>&1 || true
docker run -d --name bdnsi-package-mysql -p 3306:3306 \
  -e MYSQL_DATABASE=bdnsi_package \
  -e MYSQL_USER=bdnsi_package_user \
  -e MYSQL_PASSWORD=safe_package_password \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.0 >/dev/null

for i in $(seq 1 45); do
  if docker exec bdnsi-package-mysql mysqladmin ping -uroot -proot --silent >/dev/null 2>&1; then
    break
  fi
  if [ "$i" = "45" ]; then
    docker logs bdnsi-package-mysql
    exit 1
  fi
  sleep 2
done

cp .env.example .env
sed -i 's/APP_ENV=.*/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=.*/APP_DEBUG=false/' .env
sed -i 's#APP_URL=.*#APP_URL=https://YOUR-DOMAIN.COM#' .env
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/DB_PORT=.*/DB_PORT=3306/' .env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=bdnsi_package/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=bdnsi_package_user/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=safe_package_password/' .env
sed -i 's/CACHE_DRIVER=.*/CACHE_DRIVER=file/' .env || true
sed -i 's/SESSION_DRIVER=.*/SESSION_DRIVER=file/' .env || true
sed -i 's/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/' .env || true

composer install --no-dev --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist --optimize-autoloader
php artisan key:generate --force
php artisan package:discover --ansi

npm ci --legacy-peer-deps
NODE_ENV=production npm run build
test -d public/build/assets

php artisan migrate:fresh --force
php artisan db:seed --class='Database\Seeders\LaratrustSeeder' --force
php artisan db:seed --class='Database\Seeders\ConfigSeeder' --force
php artisan db:seed --class='Database\Seeders\SiteConfigSeeder' --force

INSTALL_ADMIN_PASSWORD="$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9@#%+=_' | head -c 24)"
export INSTALL_ADMIN_PASSWORD
php artisan tinker --execute='use App\Models\Admin; use App\Models\Role; use Illuminate\Support\Facades\Hash; $p=getenv("INSTALL_ADMIN_PASSWORD"); $a=Admin::updateOrCreate(["email"=>"admin@bdnsi.local"],["name"=>"BDNSI Administrator","password"=>Hash::make($p)]); $r=Role::whereName("admin")->first(); if ($r) { $a->syncRoles([$r]); }'
printf 'Admin login for this fresh database\nEmail: admin@bdnsi.local\nPassword: %s\n\nChange this password immediately after first login.\n' "$INSTALL_ADMIN_PASSWORD" > FIRST_LOGIN.txt

docker exec bdnsi-package-mysql mysqldump \
  -ubdnsi_package_user -psafe_package_password \
  --single-transaction --routines --triggers --no-tablespaces \
  --default-character-set=utf8mb4 bdnsi_package > database.sql
test -s database.sql

# Exact Git-tracked main source + production runtime files.
git -C "$ROOT" archive "$SOURCE_SHA" | tar -x -C "$OUT/BDNSI_READY_UPLOAD"
cp -a vendor "$OUT/BDNSI_READY_UPLOAD/vendor"
rm -rf "$OUT/BDNSI_READY_UPLOAD/public/build"
cp -a public/build "$OUT/BDNSI_READY_UPLOAD/public/build"
cp database.sql "$OUT/BDNSI_READY_UPLOAD/database.sql"
cp FIRST_LOGIN.txt "$OUT/BDNSI_READY_UPLOAD/FIRST_LOGIN.txt"

APP_KEY_LINE="$(grep '^APP_KEY=' .env | head -n1)"
cp .env.example "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/APP_ENV=.*/APP_ENV=production/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/APP_DEBUG=.*/APP_DEBUG=false/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's#APP_URL=.*#APP_URL=https://YOUR-DOMAIN.COM#' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i "s#^APP_KEY=.*#${APP_KEY_LINE}#" "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_HOST=.*/DB_HOST=localhost/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_PORT=.*/DB_PORT=3306/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_DATABASE=.*/DB_DATABASE=CHANGE_ME/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_USERNAME=.*/DB_USERNAME=CHANGE_ME/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=CHANGE_ME/' "$OUT/BDNSI_READY_UPLOAD/.env"
sed -i 's/CACHE_DRIVER=.*/CACHE_DRIVER=file/' "$OUT/BDNSI_READY_UPLOAD/.env" || true
sed -i 's/SESSION_DRIVER=.*/SESSION_DRIVER=file/' "$OUT/BDNSI_READY_UPLOAD/.env" || true
sed -i 's/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/' "$OUT/BDNSI_READY_UPLOAD/.env" || true

mkdir -p \
  "$OUT/BDNSI_READY_UPLOAD/storage/framework/cache/data" \
  "$OUT/BDNSI_READY_UPLOAD/storage/framework/sessions" \
  "$OUT/BDNSI_READY_UPLOAD/storage/framework/views" \
  "$OUT/BDNSI_READY_UPLOAD/storage/logs" \
  "$OUT/BDNSI_READY_UPLOAD/storage/app/public" \
  "$OUT/BDNSI_READY_UPLOAD/bootstrap/cache"

cat > "$OUT/BDNSI_READY_UPLOAD/UPLOAD_README.txt" <<'TXT'
BDNSI FULL UPLOAD-READY PACKAGE

1. Upload/extract the contents of BDNSI_READY_UPLOAD into public_html.
2. Import database.sql into a fresh MySQL database.
3. Edit .env: APP_URL, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD.

Composer install is not required on hosting: vendor is included.
npm/build is not required on hosting: public/build is included.
The root .htaccess routes requests to Laravel public/.
Use FIRST_LOGIN.txt for the fresh admin and change that password after login.
TXT

printf '%s\n' "$SOURCE_SHA" > "$OUT/BDNSI_READY_UPLOAD/SOURCE_COMMIT.txt"

cd "$OUT"
zip -qry -y BDNSI_READY_UPLOAD_FULL.zip BDNSI_READY_UPLOAD
sha256sum BDNSI_READY_UPLOAD_FULL.zip > BDNSI_READY_UPLOAD_FULL.sha256
unzip -tq BDNSI_READY_UPLOAD_FULL.zip
ls -lh BDNSI_READY_UPLOAD_FULL.zip BDNSI_READY_UPLOAD_FULL.sha256
