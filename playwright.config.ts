import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/Browser',
    testMatch: '**/*.visual.spec.ts',
    fullyParallel: false,
    workers: 1,
    timeout: 60_000,
    expect: { timeout: 10_000 },
    outputDir: './docs/design/qa/test-results',
    reporter: [
        ['list'],
        ['html', { outputFolder: './docs/design/qa/report', open: 'never' }],
    ],
    use: {
        baseURL: 'http://127.0.0.1:8000',
        browserName: 'chromium',
        colorScheme: 'light',
        reducedMotion: 'no-preference',
        deviceScaleFactor: 1,
        screenshot: 'only-on-failure',
        video: 'on',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'npm run build && php artisan serve --host=127.0.0.1 --port=8000 --no-reload --tries=1 --no-interaction',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        env: { SESSION_DRIVER: 'file', CACHE_STORE: 'file' },
    },
    projects: [
        { name: 'desktop-1440', use: { viewport: { width: 1440, height: 1000 } } },
        { name: 'laptop-1280', use: { viewport: { width: 1280, height: 900 } } },
        { name: 'tablet-768', use: { viewport: { width: 768, height: 1024 } } },
        { name: 'mobile-390', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    ],
});
