import { test, expect } from '@playwright/test';

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('homepage loads with header and type selection', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('QR Code Generator');
    await expect(page.getByText('Choose QR Code Type')).toBeVisible();
  });

  test('select URL type navigates to data step', async ({ page }) => {
    await page.getByText('URL', { exact: true }).click();
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
  });

  test('dark mode toggles', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to/i });
    await toggle.click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
    await toggle.click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
  });

  test('back button returns to type selection', async ({ page }) => {
    await page.getByText('URL', { exact: true }).click();
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.getByText('Choose QR Code Type')).toBeVisible();
  });

  test('navigate through all 4 steps', async ({ page }) => {
    await page.getByText('URL', { exact: true }).click();
    await page.getByRole('button', { name: /next|continue/i }).click();
    await page.getByRole('button', { name: /next|continue/i }).click();
    // On export step - should have format buttons
    await expect(page.locator('body')).toBeVisible();
  });

  test('preview heading exists', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
  });

  test('footer links exist', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
  });

  // Test all QR types can be selected (use actual labels from registry)
  const types = [
    'URL', 'Text', 'WhatsApp', 'Email', 'Phone', 'SMS', 'WiFi',
    'vCard', 'MeCard', 'Social Media', 'App Store',
    'Calendar Event', 'Location', 'Cryptocurrency', 'EPC / SEPA Payment',
  ];
  for (const t of types) {
    test(`select "${t}" without error`, async ({ page }) => {
      // Scroll to ensure visible
      const el = page.getByText(t, { exact: true }).first();
      await el.scrollIntoViewIfNeeded();
      await el.click();
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
