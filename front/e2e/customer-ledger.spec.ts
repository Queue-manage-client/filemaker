import { test, expect } from '@playwright/test';

test.describe('顧客台帳: セキュリティ強化', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customer-ledger');
    await page.waitForLoadState('networkidle');
  });

  test('管理者モードボタンが表示されている', async ({ page }) => {
    const adminBtn = page.getByRole('button', { name: /管理者モード/ });
    await expect(adminBtn).toBeVisible();
  });

  test('管理者モード起動時にパスワード入力モーダルが開く', async ({ page }) => {
    await page.getByRole('button', { name: /管理者モード/ }).first().click();
    await expect(page.getByText('管理者モードを有効化')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('誤ったパスワードでは管理者モードに入れない', async ({ page }) => {
    await page.getByRole('button', { name: /管理者モード/ }).first().click();
    await expect(page.getByText('管理者モードを有効化')).toBeVisible();
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('wrongpassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByText('管理者コードが正しくありません')).toBeVisible();
  });

  test('正しいパスワード(admin1234)で管理者モードに入れる', async ({ page }) => {
    await page.getByRole('button', { name: /管理者モード/ }).first().click();
    await expect(page.getByText('管理者モードを有効化')).toBeVisible();
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('admin1234');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByRole('button', { name: /ログアウト/ })).toBeVisible();
  });

  test('操作履歴ボタンが表示されている', async ({ page }) => {
    await expect(page.getByRole('button', { name: /操作履歴/ })).toBeVisible();
  });

  test('操作履歴モーダルが開きログが表示される', async ({ page }) => {
    await page.getByRole('button', { name: /操作履歴/ }).click();
    await expect(page.getByText(/操作者|対象顧客|種別/).first()).toBeVisible();
  });
});

test.describe('顧客台帳: 検索・フィルター強化', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customer-ledger');
    await page.waitForLoadState('networkidle');
  });

  test('検索バーが表示されている', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="会員番号"], input[placeholder*="氏名"], input[placeholder*="電話"], input[placeholder*="検索"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('利用イベントフィルターが表示されている', async ({ page }) => {
    const eventLabel = page.getByText(/利用イベント|イベント/).first();
    await expect(eventLabel).toBeVisible();
  });

  test('期間フィルター（来店期間）が表示されている', async ({ page }) => {
    const dateLabel = page.getByText(/期間|来店/).first();
    await expect(dateLabel).toBeVisible();
  });

  test('氏名検索でリストが絞り込まれる', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="検索"], input[placeholder*="氏名"]').first();
    await searchInput.fill('高橋');
    await page.waitForTimeout(300);
    await expect(page.getByText('高橋一郎')).toBeVisible();
  });

  test('テーブルに「最終来店日」「利用イベント」列がある', async ({ page }) => {
    await expect(page.getByText(/最終来店日/).first()).toBeVisible();
    await expect(page.getByText(/利用イベント/).first()).toBeVisible();
  });
});
