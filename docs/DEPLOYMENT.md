# BDNSI Shared-Hosting Deployment

## Supported output

GitHub Actions builds two deployment files from an exact source commit:

- `BDNSI_PUBLIC_HTML_READY.zip`
- `BDNSI_database.sql`

The ZIP is intentionally a flat `public_html` package. `index.php`, `.htaccess`, compiled frontend assets, Laravel runtime source, `vendor/`, `.env`, and `database.sql` are at the locations expected by ordinary shared hosting.

## Manual deployment

1. Use a fresh or intentionally prepared hosting directory.
2. Extract the contents of `BDNSI_PUBLIC_HTML_READY.zip` directly into `public_html`.
3. Create a fresh MySQL database and import `BDNSI_database.sql`.
4. Edit only these deployment values in `.env`:

```env
APP_URL=https://your-domain.example
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

5. Open the site.
6. Read `FIRST_LOGIN.txt` from File Manager, sign in with the generated admin account, and immediately change its password.

## What is already prepared

The release builder performs these tasks before the ZIP is produced:

- Composer production dependency installation (`vendor/`)
- Vite production build (`build/`)
- Fresh MySQL migrations
- Required roles/config/site seeders
- Fresh initial administrator generation
- Importable MySQL dump
- Production application key generation
- Root Laravel front controller for `public_html`
- Hardened Apache rewrite rules
- Storage-file delivery without `storage:link`
- ZIP integrity and required-file validation

Therefore the hosting server does not need Composer, npm, Git, SSH, or deployment commands for this manual workflow.

## Security

The `.htaccess` in the generated package denies direct web access to Laravel internals and sensitive root files such as `.env`, `database.sql`, Composer metadata, and the first-login file.

Never reuse a real production `.env` inside GitHub or commit credentials to the repository.

## Source traceability

Every generated package includes `SOURCE_COMMIT.txt`. This is the exact Git commit from which that package was built. Use it when reporting a live defect so code and deployment evidence remain aligned.
