import { test, expect } from '@playwright/test';

test.describe('配車パネル2D: UI整合性', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dispatch-panel-2d');
    await page.waitForLoadState('networkidle');
  });

  test('案内時間カラムが青色で表示される', async ({ page }) => {
    const guidanceTime = page.locator('text=案内時間').first();
    await expect(guidanceTime).toBeVisible();
    const color = await guidanceTime.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(37, 99, 235\)|rgb\(29, 78, 216\)|rgb\(30, 64, 175\)|rgb\(59, 130, 246\)/);
  });

  test('出勤予定ホステスの店舗名が表示される', async ({ page }) => {
    const storeLabels = await page.getByText(/南IC店|京都店/).count();
    expect(storeLabels).toBeGreaterThan(0);
  });

  test('出勤・地域・終了・帰宅ヘッダーが全て表示される', async ({ page }) => {
    await expect(page.locator('text=/^出勤$/').first()).toBeVisible();
    await expect(page.locator('text=/^地域$/').first()).toBeVisible();
    await expect(page.locator('text=/^終了$/').first()).toBeVisible();
    await expect(page.locator('text=/^帰宅$/').first()).toBeVisible();
  });

  test('レスポンシブ: ビューポート幅変更で zoom が追従する', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(200);
    const wrapper1920 = await page.locator('div[style*="zoom"]').first().getAttribute('style');
    expect(wrapper1920).toContain('zoom');

    await page.setViewportSize({ width: 2560, height: 1080 });
    await page.waitForTimeout(200);
    const wrapper2560 = await page.locator('div[style*="zoom"]').first().getAttribute('style');
    expect(wrapper2560).toContain('zoom');
    expect(wrapper2560).not.toBe(wrapper1920);
  });

  test('出勤と地域カラムが視覚的に重ならない', async ({ page }) => {
    const arrivalHeader = page.locator('text=/^出勤$/').first();
    const regionHeader = page.locator('text=/^地域$/').first();
    const arrivalBox = await arrivalHeader.boundingBox();
    const regionBox = await regionHeader.boundingBox();
    expect(arrivalBox).not.toBeNull();
    expect(regionBox).not.toBeNull();
    if (arrivalBox && regionBox) {
      const arrivalRight = arrivalBox.x + arrivalBox.width;
      expect(regionBox.x).toBeGreaterThanOrEqual(arrivalRight);
    }
  });

  test('帰宅時刻データが切れずに表示される（00:00 が完全表示）', async ({ page }) => {
    const cells = await page.locator('text=/^00:00$/').all();
    expect(cells.length).toBeGreaterThan(0);
  });

  test('店舗カラー背景がホステス名に適用される', async ({ page }) => {
    const hostessNameCells = await page.locator('div[style*="background-color"]').all();
    const colorsApplied = hostessNameCells.length;
    expect(colorsApplied).toBeGreaterThan(0);
  });
});
