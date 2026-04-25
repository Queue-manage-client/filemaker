import { test, expect, Page } from '@playwright/test';

async function navigateToCarSection(page: Page) {
  await page.goto('/hostess-management?cast_id=2');
  await page.waitForLoadState('networkidle');
  // ダッシュボードの「送迎車確認」ボタン or サイドナビの「送迎車選択」をクリック
  const navBtn = page.getByRole('button', { name: /送迎車選択|送迎車確認/ }).first();
  await navBtn.click();
  await page.waitForTimeout(300);
}

test.describe('ホステスマイページ: 送迎車自動紐付けフロー', () => {
  test('idle状態でお迎え車両プレビューと開始ボタンが表示される', async ({ page }) => {
    await navigateToCarSection(page);
    const startBtn = page.getByRole('button', { name: 'お迎え車両を確認する' });
    await expect(startBtn).toBeVisible();
  });

  test('女の子側で車を選択するUIは廃止されている', async ({ page }) => {
    await navigateToCarSection(page);
    const carSelectionUI = page.getByText(/車両を選択|車を選んで|選んでください/);
    await expect(carSelectionUI).toHaveCount(0);
  });

  test('idle状態で担当ドライバー名が表示される', async ({ page }) => {
    await navigateToCarSection(page);
    await expect(page.getByText(/担当ドライバー/)).toBeVisible();
  });

  test('お迎え車両を確認するボタンを押すと pickup 状態に遷移する', async ({ page }) => {
    await navigateToCarSection(page);
    await page.getByRole('button', { name: 'お迎え車両を確認する' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('この車です')).toBeVisible();
  });

  test('pickup 状態でドライバー名が表示される', async ({ page }) => {
    await navigateToCarSection(page);
    await page.getByRole('button', { name: 'お迎え車両を確認する' }).click();
    await page.waitForTimeout(500);
    const driverNamePattern = /松尾|山田|田中|佐藤|高橋|鈴木|渡辺|伊藤|加藤|山本|中村|小林|松本|吉田|木村|林|森|清水|汐崎|井上|土居/;
    await expect(page.getByText(driverNamePattern).first()).toBeVisible();
  });
});

async function navigateToAttendance(page: Page) {
  await page.goto('/hostess-management?cast_id=2');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /出勤管理|出勤申請/ }).first().click();
  await page.waitForTimeout(300);
}

test.describe('ホステスマイページ: 出勤管理(シフト提出)', () => {
  test('出勤管理メニューが表示される', async ({ page }) => {
    await page.goto('/hostess-management?cast_id=2');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: '出勤管理' })).toBeVisible();
  });

  test('出勤申請クイックアクションから出勤管理セクションへ遷移する', async ({ page }) => {
    await page.goto('/hostess-management?cast_id=2');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '出勤申請' }).first().click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/ステップ1/)).toBeVisible();
  });

  test('3ステップ全てのラベルが表示される', async ({ page }) => {
    await navigateToAttendance(page);
    await expect(page.getByText(/ステップ1/)).toBeVisible();
    await expect(page.getByText(/ステップ2/)).toBeVisible();
    await expect(page.getByText(/ステップ3/)).toBeVisible();
  });

  test('ステップ1に車重可能併用店が表示される', async ({ page }) => {
    await navigateToAttendance(page);
    await expect(page.getByText('京都デリヘル倶楽部')).toBeVisible();
  });

  test('ステップ2に車重不可併用店が表示される', async ({ page }) => {
    await navigateToAttendance(page);
    await expect(page.getByText('京都ホテヘル倶楽部')).toBeVisible();
    await expect(page.getByText('滋賀DCP')).toBeVisible();
  });

  test('変更して入れ替えるボタンで店舗の順序が変わる', async ({ page }) => {
    await navigateToAttendance(page);
    await page.getByRole('button', { name: /変更して入れ替える/ }).click();
    await page.waitForTimeout(200);
    const labels = await page.locator('text=/京都ホテヘル倶楽部|滋賀DCP/').allTextContents();
    expect(labels[0]).toBe('滋賀DCP');
  });

  test('ステップ3に7日分の出勤行が表示される', async ({ page }) => {
    await navigateToAttendance(page);
    const checkboxes = page.locator('input[type="checkbox"][aria-label*="出勤"]');
    await expect(checkboxes).toHaveCount(7);
  });

  test('出勤チェックを外すと時刻Selectがdisableされる', async ({ page }) => {
    await navigateToAttendance(page);
    const firstCheckbox = page.locator('input[type="checkbox"][aria-label*="出勤"]').first();
    await firstCheckbox.uncheck();
    await page.waitForTimeout(150);
    const firstStartHour = page.locator('select[aria-label*="出勤時"]').first();
    await expect(firstStartHour).toBeDisabled();
  });

  test('OKボタンとリセットボタンが表示される', async ({ page }) => {
    await navigateToAttendance(page);
    await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
    await expect(page.getByRole('button', { name: /リセット/ })).toBeVisible();
  });

  test('リセットボタンで初期値に戻る', async ({ page }) => {
    await navigateToAttendance(page);
    const firstCheckbox = page.locator('input[type="checkbox"][aria-label*="出勤"]').first();
    await firstCheckbox.uncheck();
    await page.getByRole('button', { name: /リセット/ }).click();
    await page.waitForTimeout(200);
    await expect(firstCheckbox).toBeChecked();
  });
});
