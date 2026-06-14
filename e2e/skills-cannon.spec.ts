import { expect, test } from '@playwright/test';

test('cannon barrel points down-field (+Z) toward the stacks', async ({ page }) => {
  await page.goto('/?e2e=skills');

  await expect(page.locator('.skills-hud')).toBeVisible({ timeout: 15_000 });

  // Let WebGL + physics settle and Cannon useFrame populate the probe.
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'e2e/screenshots/skills-cannon.png', fullPage: false });

  const dir = await page.waitForFunction(
    () => (window as Window & { __cannonBarrelDir?: { x: number; y: number; z: number } }).__cannonBarrelDir,
    { timeout: 10_000 },
  );
  const barrel = (await dir.jsonValue()) as { x: number; y: number; z: number };

  expect(barrel.z, `barrel dir = ${JSON.stringify(barrel)}`).toBeGreaterThan(0.5);
  expect(barrel.x).toBeGreaterThan(-0.3);
  expect(barrel.x).toBeLessThan(0.3);
});
