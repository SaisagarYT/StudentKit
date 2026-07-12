import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero section with correct heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toContainText('Everything a student');
  });

  test('renders navigation with logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('a[aria-label="StudentKit — Home"]');
    await expect(logo).toBeVisible();
  });

  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/StudentKit/);
  });

  test('renders tool cards in popular section', async ({ page }) => {
    await page.goto('/');
    const toolLinks = page.locator('a[href^="/tools/"]');
    const count = await toolLinks.count();
    expect(count).toBeGreaterThan(5);
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
