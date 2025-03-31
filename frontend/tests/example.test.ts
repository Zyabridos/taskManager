import { test, expect } from '@playwright/test';

test('Contains word "Привет!"', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Привет!');
});
