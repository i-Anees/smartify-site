import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const phase = process.env.QA_CAPTURE_PHASE ?? 'before';
if (!['before', 'after'].includes(phase)) throw new Error('QA_CAPTURE_PHASE must be before or after.');

async function captureDirectory(info: TestInfo) {
    const directory = path.resolve('docs/design/qa', phase, info.project.name);
    await mkdir(directory, { recursive: true });
    return directory;
}

async function expectNoHorizontalOverflow(page: Page) {
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
}

async function openHome(page: Page) {
    const response = await page.goto('/', { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Transforming Ideas into Real Impact.' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.floating-nav')).toHaveCSS('opacity', '1');
}

test('capture the rendered homepage and interactive states', async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const directory = await captureDirectory(info);
    await openHome(page);

    for (const section of await page.locator('[data-studio-reveal], main .project-plate').all()) {
        await section.scrollIntoViewIfNeeded();
        await expect(section).toHaveCSS('opacity', '1');
        await expectNoHorizontalOverflow(page);
    }

    for (const image of await page.locator('img').all()) {
        await expect(image).toHaveJSProperty('complete', true);
        expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('.floating-nav')).not.toHaveClass(/is-scrolled/);
    await page.screenshot({ path: path.join(directory, 'full-page.png'), fullPage: true, animations: 'disabled' });
    await page.screenshot({ path: path.join(directory, 'hero.png'), animations: 'disabled' });

    await page.locator('#work').screenshot({ path: path.join(directory, 'selected-work.png'), animations: 'disabled' });
    await page.locator('#contact').screenshot({ path: path.join(directory, 'footer.png'), animations: 'disabled' });

    const project = page.getByRole('button', { name: 'Explore Ignition / A brand in motion, a studio concept' });
    await project.click();
    const projectDialog = page.getByRole('dialog', { name: 'The art of possibility.' });
    await expect(projectDialog).toBeVisible();
    await page.screenshot({ path: path.join(directory, 'project-dialog.png'), animations: 'disabled' });
    await page.keyboard.press('Escape');
    await expect(projectDialog).not.toBeVisible();
    await expect(project).toBeFocused();

    const menuButton = page.getByRole('button', { name: 'Open navigation' });
    if (await menuButton.isVisible()) {
        await menuButton.click();
        const menu = page.getByRole('dialog', { name: 'SMARTIFY SOLUTIONS / EXPLORE' });
        await expect(menu).toBeVisible();
        await page.screenshot({ path: path.join(directory, 'mobile-menu.png'), animations: 'disabled' });
        await page.keyboard.press('Escape');
        await expect(menu).not.toBeVisible();
        await expect(menuButton).toBeFocused();
    }

    const typography = await page.locator('h1, h2, .hero-description, .eyebrow').evaluateAll((elements) => elements.map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return { text: element.textContent, fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, color: style.color, width: rect.width };
    }));
    await writeFile(path.join(directory, 'render-metrics.json'), JSON.stringify({ viewport: page.viewportSize(), typography, errors }, null, 2));
    expect(errors).toEqual([]);
});

test('capture reduced motion without hiding content', async ({ page }, info) => {
    const directory = await captureDirectory(info);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openHome(page);
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await expect(page.locator('.hero-webgl canvas')).toHaveCount(0);
    await expect(page.locator('.ripple-cursor')).toHaveCount(0);
    await expect(page.getByAltText('Pearl-white AI robot interacting with a transparent blue holographic interface')).toBeVisible();
    for (const line of await page.locator('.hero-title .text-reveal-line > span').all()) {
        await expect(line).toHaveCSS('opacity', '1');
    }
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(directory, 'hero-reduced-motion.png'), animations: 'disabled' });

    const project = page.locator('.project-open').first();
    await project.hover();
    await expect.poll(() => project.locator('img').evaluate((element) => {
        const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return [transform.a, transform.d, transform.e, transform.f];
    })).toEqual([1, 1, 0, 0]);
});

const pages = [
    ['about', '/about', 'Driven by Ideas.'],
    ['services', '/services', 'Complete Digital'],
    ['projects', '/projects', 'Projects That'],
    ['service-detail', '/services/web-development', 'Web Development'],
    ['process', '/process', 'From Idea to'],
    ['testimonials', '/testimonials', 'Honest Feedback.'],
    ['contact', '/contact', 'Let’s Build Something'],
];

for (const [name, url, heading] of pages) {
    test(`capture ${name} page`, async ({ page }, info) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const directory = await captureDirectory(info);
        const response = await page.goto(url, { waitUntil: 'load' });
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
        await page.evaluate(() => document.fonts.ready);
        for (const item of await page.locator('[data-studio-reveal], main .project-plate').all()) {
            await item.scrollIntoViewIfNeeded();
            await expect(item).toHaveCSS('opacity', '1');
            await expectNoHorizontalOverflow(page);
        }
        for (const image of await page.locator('img').all()) {
            await expect(image).toHaveJSProperty('complete', true);
            expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(directory, `${name}.png`), fullPage: true, animations: 'disabled' });
        expect(errors).toEqual([]);
    });
}

test('project filters show only the chosen category', async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Branding', exact: true }).click();
    await expect(page.locator('.project-plate')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'The art of possibility.' })).toBeVisible();
    await page.getByRole('button', { name: 'Websites', exact: true }).click();
    await expect(page.locator('.project-plate')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Space to think differently.' })).toBeVisible();
});

test('robot stays usable when the optional Three.js module cannot load', async ({ page }, info) => {
    test.skip(!['desktop-1440', 'laptop-1280'].includes(info.project.name), 'Three.js is a desktop enhancement.');
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('https://cdn.jsdelivr.net/npm/three@0.180.0/**', (route) => route.abort());
    await openHome(page);
    await expect(page.locator('.hero-webgl')).toHaveAttribute('data-webgl', 'fallback');
    await expect(page.getByAltText('Pearl-white AI robot interacting with a transparent blue holographic interface')).toBeVisible();
    await page.getByRole('link', { name: 'Our Services', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Complete Digital');
    expect(errors).toEqual([]);
});

test('each service has a scroll-directed scene and a working detail link', async ({ page }, info) => {
    await page.goto('/services');
    const chapters = page.locator('.service-chapter');
    await expect(chapters).toHaveCount(6);
    const isDesktop = ['desktop-1440', 'laptop-1280'].includes(info.project.name);
    if (!isDesktop) {
        await expect(page.locator('.service-sticky-stage')).toHaveCount(0);
        for (const chapter of await chapters.all()) {
            await chapter.scrollIntoViewIfNeeded();
            await expect(chapter.locator('.service-chapter-image')).toHaveCSS('opacity', '1');
            await expect(chapter.getByRole('link')).toHaveAttribute('href', /^\/services\//);
            await expectNoHorizontalOverflow(page);
        }
        return;
    }
    const directory = await captureDirectory(info);
    const stage = page.locator('.service-sticky-stage');
    for (let index = 0; index < 6; index++) {
        await chapters.nth(index).evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + bounds.top + bounds.height / 2 - window.innerHeight / 2, behavior: 'instant' });
        });
        await expect(stage.locator('.service-stage-topline')).toContainText(`0${index + 1} — 06`);
        await expect(page.locator(`.service-scene-${index}`)).toHaveCSS('opacity', '1');
        await expectNoHorizontalOverflow(page);
        await page.screenshot({ path: path.join(directory, `service-scene-0${index + 1}.png`), animations: 'disabled' });
    }
    await chapters.first().getByRole('link').click();
    await expect(page).toHaveURL(/\/services\/web-development$/);
});

test('reduced motion exposes all service content without the pinned stage', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/services');
    await expect(page.locator('.service-sticky-stage')).toHaveCount(0);
    await expect(page.locator('.service-chapter-image')).toHaveCount(6);
    for (const content of await page.locator('.service-chapter [data-studio-reveal]').all()) {
        await expect(content).toHaveCSS('opacity', '1');
    }
    await expectNoHorizontalOverflow(page);
});

test('team and client-story sections identify pending content honestly', async ({ page }, info) => {
    await openHome(page);
    const directory = await captureDirectory(info);
    for (const [selector, filename] of [['#team', 'team.png'], ['#testimonials', 'client-stories.png']]) {
        const section = page.locator(selector);
        await section.scrollIntoViewIfNeeded();
        for (const content of await section.locator('[data-studio-reveal]').all()) {
            await expect(content).toHaveCSS('opacity', '1');
        }
        await expectNoHorizontalOverflow(page);
        await section.screenshot({ path: path.join(directory, filename), animations: 'disabled' });
    }
    await expect(page.locator('#team')).toContainText('We’re preparing our team introductions.');
    await expect(page.locator('#team .portrait-awaiting')).toHaveCount(3);
    await expect(page.locator('#testimonials')).toContainText('AWAITING APPROVED CONTENT');
    await expect(page.locator('#testimonials blockquote')).toHaveCount(0);
});

test('hero effects can be paused and the showreel remains keyboard accessible', async ({ page }) => {
    await openHome(page);
    const pause = page.getByRole('button', { name: 'Pause hero effects', exact: true });
    await pause.click();
    await expect(page.locator('.hero')).toHaveAttribute('data-effects', 'paused');
    await expect(page.getByRole('button', { name: 'Resume hero effects', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.hero-webgl canvas')).toHaveCount(0);
    await page.mouse.move(100, 100);
    await expect.poll(() => page.locator('.robot-depth').evaluate((element) => {
        const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return [transform.a, transform.d, transform.e, transform.f];
    })).toEqual([1, 1, 0, 0]);

    const showreel = page.getByRole('button', { name: 'Watch Showreel', exact: true });
    await showreel.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'A little of what’s possible.' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(showreel).toBeFocused();
    await page.getByRole('button', { name: 'Resume hero effects', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause hero effects', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
