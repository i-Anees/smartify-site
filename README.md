# Smartify Solutions

Agency website and content administration built with Laravel 13, Inertia 3, React 19, TypeScript, Tailwind CSS 4, and Vite 8. Install the exact dependencies from `composer.lock` and `package-lock.json`.

## Requirements

- PHP 8.3+ with Laravel's required extensions, PDO MySQL, and Fileinfo; PDO SQLite for tests.
- Composer 2, Git, MySQL, and Node.js 22.12+ with npm (Vite also supports Node.js 20.19+).
- Production: an HTTPS web server with PHP-FPM or equivalent PHP hosting.

Commands use a Bash-compatible terminal. On Windows, use Git Bash, WSL, or equivalent commands in your terminal.

## Set up on a new device

```bash
git clone https://github.com/i-Anees/smartify-site.git
cd smartify-site
composer install
npm ci
cp .env.example .env
php artisan key:generate --no-interaction
```

Create an empty MySQL database named `smartify`, then edit `.env`:

```dotenv
APP_NAME="Smartify Solutions"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartify
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

Configure `SMARTIFY_CONTACT_EMAIL`, `SMARTIFY_INSTAGRAM_URL`, `SMARTIFY_LINKEDIN_URL`, and `SMARTIFY_BEHANCE_URL` as needed. Keep real credentials in `.env`, which is excluded from Git.

```bash
php artisan migrate --seed --no-interaction
php artisan storage:link --no-interaction
```

Migrations create content, user, session, cache, and queue tables. The seeder initializes default site content once.

Create an administrator in an interactive terminal:

```bash
php artisan admin:create you@example.com --name="Your Name"
```

This command requires password and confirmation prompts (at least 12 characters). Do not use `--no-interaction` for admin creation. There is no default admin password. An existing email requires confirmation before granting admin access and replacing its password. Sign in at `/admin/login` on your running site.

Start development:

```bash
composer run dev
```

Alternatively, run `php artisan serve --no-interaction` and `npm run dev` in separate terminals. Use the address printed by the application server. For Laragon or another local web server, point the document root at `public/` and set `APP_URL` accordingly.

## Verification

```bash
npm run typecheck
npm run build
php artisan test --compact
```

PHP tests use an in-memory SQLite database, separate from MySQL. For browser QA:

```bash
npx playwright install chromium
npm run qa:visual
```

Linux may require browser system libraries; use `npx playwright install --with-deps chromium` where you have permission to install them. The visual suite uses port 8000 and tests 1440px, 1280px, 768px, and 390px viewports. Screenshots and reports go under `docs/design/qa/`.

## First production deployment

Provision PHP, MySQL, and an HTTPS domain. Point the web server document root at the application's `public/` directory and route requests through `public/index.php`. Never expose the repository root. Give the PHP process write access to `storage/` and `bootstrap/cache/`.

```bash
git clone --branch main https://github.com/i-Anees/smartify-site.git
cd smartify-site
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
npm ci
cp .env.example .env
```

Configure production `.env` with real database credentials and contact/social settings:

```dotenv
APP_NAME="Smartify Solutions"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.example
LOG_LEVEL=warning
SESSION_SECURE_COOKIE=true

DB_CONNECTION=mysql
DB_HOST=your_database_host
DB_PORT=3306
DB_DATABASE=smartify
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Generate the application key **once for this new installation**, then build and initialize:

```bash
php artisan key:generate --force --no-interaction
npm run build
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction
php artisan storage:link --no-interaction
php artisan optimize --no-interaction
```

Run `php artisan admin:create you@example.com --name="Your Name"` interactively on the server. Verify public pages, admin sign-in, content editing, and uploads over HTTPS.

`npm ci` must include development dependencies because Vite and TypeScript are build tools. Alternatively, build in CI and ship `public/build/` with the release; Node.js is then unnecessary on the runtime server. Do not run the Vite development server in production, and ensure no local `public/hot` file is shipped.

Back up `.env`, `APP_KEY`, the database, and `storage/app/public/`. Persist environment settings and uploads across releases; recreate `public/storage` in each release when using release directories. Configure real mail credentials if enabling email delivery; the default `log` mailer only writes to logs.

If adding queued work, supervise `php artisan queue:work --no-interaction` and restart workers after deployment. No scheduled application tasks currently require cron; configure the Laravel scheduler when adding scheduled jobs. Follow your hosting provider's PHP-FPM reload procedure when using OPcache.

## Update an existing production installation

Back up the database and uploads first. For an in-place deployment:

```bash
php artisan down --no-interaction
git pull --ff-only origin main
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
npm ci
npm run build
php artisan optimize:clear --no-interaction
php artisan migrate --force --no-interaction
php artisan optimize --no-interaction
php artisan up --no-interaction
```

For platforms with atomic releases, run equivalent steps in build/release hooks. Preserve `.env` and `APP_KEY`; do not rerun initial setup or regenerate the key. Seed content only on first installation. Never use `migrate:fresh` in production. Restart any queue workers using `php artisan queue:restart --no-interaction` after a successful deployment.

If deployment fails, keep maintenance mode enabled while fixing the issue or restoring the previous release and compatible database backup.

## Troubleshooting

- **Vite manifest missing:** run `npm ci` and `npm run build`, or `npm run dev` during development.
- **Database/session/cache table errors:** check database credentials and run `php artisan migrate --no-interaction` (add `--force` in production).
- **Uploaded images return 404:** check `php artisan storage:link --no-interaction`, persistent uploads, and web server access to the linked files.
- **Old environment settings:** use `php artisan config:clear --no-interaction` locally; rebuild production caches with `php artisan optimize --no-interaction`.
- **Permission errors:** give the PHP process appropriate access to `storage/` and `bootstrap/cache/`, rather than making the repository world-writable.

## Project layout

- `resources/js/`: React pages, reusable components, and motion.
- `resources/css/`: styles and brand tokens.
- `app/Http/`: controllers, middleware, and validation.
- `config/site-content.php`: content collections and initial content.
- `database/`: migrations, factories, and seeders.
- `public/images/`: brand and website imagery.
- `tests/`: PHP tests and Playwright visual QA.
- `docs/design/`: art direction and visual QA artifacts.
