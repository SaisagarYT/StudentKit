import { test, expect } from '@playwright/test';

test.describe('Tool Pages', () => {
  test('attendance calculator loads with form', async ({ page }) => {
    await page.goto('/tools/attendance-calculator');
    await expect(page.locator('h1')).toContainText('Attendance Calculator');
    await expect(page.locator('input[placeholder*="60"]')).toBeVisible();
  });

  test('cgpa calculator loads with dynamic rows', async ({ page }) => {
    await page.goto('/tools/cgpa-calculator');
    await expect(page.locator('h1')).toContainText('CGPA Calculator');
    const addButton = page.locator('button', { hasText: 'Add Semester' });
    await expect(addButton).toBeVisible();
  });

  test('image compressor shows upload area', async ({ page }) => {
    await page.goto('/tools/image-compressor');
    await expect(page.locator('h1')).toContainText('Image Compressor');
    await expect(page.locator('text=Drop your image')).toBeVisible();
  });

  test('tools directory page renders all tools', async ({ page }) => {
    await page.goto('/tools');
    const toolLinks = page.locator('a[href^="/tools/"]');
    const count = await toolLinks.count();
    expect(count).toBeGreaterThanOrEqual(11);
  });

  test('breadcrumb navigation works on tool page', async ({ page }) => {
    await page.goto('/tools/age-calculator');
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('a[href="/tools"]')).toBeVisible();
  });
});
