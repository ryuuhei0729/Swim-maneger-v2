import { expect, test } from '@playwright/test'

/**
 * ダッシュボード機能のE2Eテスト
 * 日付選択、練習記録・大会記録のCRUD操作
 */
test.describe('ダッシュボード機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にログインしてダッシュボードに移動
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    
    // ダッシュボードに移動したことを確認
    await expect(page).toHaveURL('/dashboard')
  })

  test.describe('練習記録の管理', () => {
    test('日付選択して練習記録を作成', async ({ page }) => {
      // カレンダーで今日の日付をクリック
      const today = new Date().getDate().toString()
      await page.click(`[data-testid="calendar-day"]:has-text("${today}")`)
      
      // 練習記録追加ボタンをクリック
      await page.click('[data-testid="add-practice-button"]')
      
      // 練習記録フォームが表示されることを確認
      await expect(page.locator('[data-testid="practice-form-modal"]')).toBeVisible()
      
      // フォームに入力
      await page.fill('[data-testid="practice-place"]', 'メインプール')
      await page.selectOption('[data-testid="practice-style"]', 'fr') // フリースタイル
      await page.fill('[data-testid="practice-distance"]', '50')
      await page.fill('[data-testid="practice-set-count"]', '4')
      await page.fill('[data-testid="practice-rep-count"]', '8')
      await page.fill('[data-testid="practice-note"]', 'フリースタイル強化練習')
      
      // 保存ボタンをクリック
      await page.click('[data-testid="save-practice-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=練習記録を保存しました')).toBeVisible()
      
      // カレンダーに練習マークが表示されることを確認
      await expect(page.locator('[data-testid="practice-mark"]')).toBeVisible()
    })

    test('練習記録を更新', async ({ page }) => {
      // 既存の練習記録をクリック（練習マークがある日付）
      await page.click('[data-testid="practice-mark"]')
      
      // 練習記録詳細が表示されることを確認
      await expect(page.locator('[data-testid="practice-detail-modal"]')).toBeVisible()
      
      // 編集ボタンをクリック
      await page.click('[data-testid="edit-practice-button"]')
      
      // 編集フォームが表示されることを確認
      await expect(page.locator('[data-testid="practice-form-modal"]')).toBeVisible()
      
      // フィールドを更新
      await page.fill('[data-testid="practice-place"]', '更新後プール')
      await page.fill('[data-testid="practice-note"]', '更新後の練習メモ')
      
      // 更新ボタンをクリック
      await page.click('[data-testid="update-practice-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=練習記録を更新しました')).toBeVisible()
      
      // 更新された内容が反映されることを確認
      await page.click('[data-testid="practice-mark"]')
      await expect(page.locator('text=更新後プール')).toBeVisible()
      await expect(page.locator('text=更新後の練習メモ')).toBeVisible()
    })

    test('練習記録を削除', async ({ page }) => {
      // 既存の練習記録をクリック
      await page.click('[data-testid="practice-mark"]')
      
      // 削除ボタンをクリック
      await page.click('[data-testid="delete-practice-button"]')
      
      // 確認ダイアログが表示されることを確認
      await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
      await expect(page.locator('text=本当に削除しますか？')).toBeVisible()
      
      // 削除を確認
      await page.click('[data-testid="confirm-delete-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=練習記録を削除しました')).toBeVisible()
      
      // カレンダーから練習マークが消えることを確認
      await expect(page.locator('[data-testid="practice-mark"]')).not.toBeVisible()
    })

    test('練習記録のタイム入力', async ({ page }) => {
      // 練習記録をクリック
      await page.click('[data-testid="practice-mark"]')
      
      // タイム入力ボタンをクリック
      await page.click('[data-testid="time-input-button"]')
      
      // タイム入力モーダルが表示されることを確認
      await expect(page.locator('[data-testid="time-input-modal"]')).toBeVisible()
      
      // タイムを入力（1セット目1本目）
      await page.fill('[data-testid="time-input-1-1"]', '25.50')
      await page.fill('[data-testid="time-input-1-2"]', '25.60')
      await page.fill('[data-testid="time-input-1-3"]', '25.45')
      await page.fill('[data-testid="time-input-1-4"]', '25.55')
      
      // 保存ボタンをクリック
      await page.click('[data-testid="save-times-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=タイムを保存しました')).toBeVisible()
      
      // タイムが表示されることを確認
      await expect(page.locator('text=25.50')).toBeVisible()
    })
  })

  test.describe('大会記録の管理', () => {
    test('日付選択して大会記録を作成', async ({ page }) => {
      // カレンダーで特定の日付をクリック
      const targetDate = '15'
      await page.click(`[data-testid="calendar-day"]:has-text("${targetDate}")`)
      
      // 大会記録追加ボタンをクリック
      await page.click('[data-testid="add-record-button"]')
      
      // 大会記録フォームが表示されることを確認
      await expect(page.locator('[data-testid="record-form-modal"]')).toBeVisible()
      
      // フォームに入力
      await page.fill('[data-testid="competition-title"]', '春季水泳大会')
      await page.fill('[data-testid="competition-place"]', '国際プール')
      await page.selectOption('[data-testid="record-style"]', 'fr') // フリースタイル
      await page.fill('[data-testid="record-distance"]', '50')
      await page.fill('[data-testid="record-time"]', '24.85')
      await page.fill('[data-testid="record-note"]', '自己ベスト更新')
      
      // 保存ボタンをクリック
      await page.click('[data-testid="save-record-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=大会記録を保存しました')).toBeVisible()
      
      // カレンダーに大会マークが表示されることを確認
      await expect(page.locator('[data-testid="competition-mark"]')).toBeVisible()
    })

    test('大会記録を更新', async ({ page }) => {
      // 既存の大会記録をクリック（大会マークがある日付）
      await page.click('[data-testid="competition-mark"]')
      
      // 大会記録詳細が表示されることを確認
      await expect(page.locator('[data-testid="record-detail-modal"]')).toBeVisible()
      
      // 編集ボタンをクリック
      await page.click('[data-testid="edit-record-button"]')
      
      // 編集フォームが表示されることを確認
      await expect(page.locator('[data-testid="record-form-modal"]')).toBeVisible()
      
      // フィールドを更新
      await page.fill('[data-testid="record-time"]', '24.75') // タイム更新
      await page.fill('[data-testid="record-note"]', '更新後：さらなる自己ベスト')
      
      // 更新ボタンをクリック
      await page.click('[data-testid="update-record-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=大会記録を更新しました')).toBeVisible()
      
      // 更新された内容が反映されることを確認
      await page.click('[data-testid="competition-mark"]')
      await expect(page.locator('text=24.75')).toBeVisible()
      await expect(page.locator('text=更新後：さらなる自己ベスト')).toBeVisible()
    })

    test('大会記録を削除', async ({ page }) => {
      // 既存の大会記録をクリック
      await page.click('[data-testid="competition-mark"]')
      
      // 削除ボタンをクリック
      await page.click('[data-testid="delete-record-button"]')
      
      // 確認ダイアログが表示されることを確認
      await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
      await expect(page.locator('text=本当に削除しますか？')).toBeVisible()
      
      // 削除を確認
      await page.click('[data-testid="confirm-delete-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=大会記録を削除しました')).toBeVisible()
      
      // カレンダーから大会マークが消えることを確認
      await expect(page.locator('[data-testid="competition-mark"]')).not.toBeVisible()
    })

    test('大会記録のスプリットタイム入力', async ({ page }) => {
      // 大会記録をクリック
      await page.click('[data-testid="competition-mark"]')
      
      // スプリットタイム入力ボタンをクリック
      await page.click('[data-testid="split-time-button"]')
      
      // スプリットタイム入力モーダルが表示されることを確認
      await expect(page.locator('[data-testid="split-time-modal"]')).toBeVisible()
      
      // スプリットタイムを入力
      await page.fill('[data-testid="split-25m"]', '12.10')
      await page.fill('[data-testid="split-50m"]', '24.85')
      
      // 保存ボタンをクリック
      await page.click('[data-testid="save-split-times-button"]')
      
      // 成功メッセージの確認
      await expect(page.locator('text=スプリットタイムを保存しました')).toBeVisible()
    })
  })

  test.describe('カレンダー操作', () => {
    test('月の切り替え', async ({ page }) => {
      // 次の月ボタンをクリック
      await page.click('[data-testid="next-month-button"]')
      
      // 月が変更されることを確認
      await page.waitForTimeout(500) // アニメーション待ち
      
      // 前の月ボタンをクリック
      await page.click('[data-testid="prev-month-button"]')
      
      // 元の月に戻ることを確認
      await page.waitForTimeout(500)
    })

    test('今日に戻るボタン', async ({ page }) => {
      // 次の月に移動
      await page.click('[data-testid="next-month-button"]')
      
      // 今日に戻るボタンをクリック
      await page.click('[data-testid="today-button"]')
      
      // 現在の月に戻ることを確認
      const currentMonth = new Date().toLocaleString('ja-JP', { month: 'long' })
      await expect(page.locator(`text=${currentMonth}`)).toBeVisible()
    })

    test('月間サマリーの表示', async ({ page }) => {
      // 月間サマリーが表示されることを確認
      await expect(page.locator('[data-testid="monthly-summary"]')).toBeVisible()
      
      // 練習回数と記録数が表示されることを確認
      await expect(page.locator('[data-testid="practice-count"]')).toBeVisible()
      await expect(page.locator('[data-testid="record-count"]')).toBeVisible()
    })
  })

  test.describe('ダッシュボード全体', () => {
    test('レスポンシブデザインの確認', async ({ page }) => {
      // デスクトップビュー
      await page.setViewportSize({ width: 1280, height: 720 })
      await expect(page.locator('[data-testid="calendar"]')).toBeVisible()
      
      // タブレットビュー
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(page.locator('[data-testid="calendar"]')).toBeVisible()
      
      // モバイルビュー
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(page.locator('[data-testid="calendar"]')).toBeVisible()
    })

    test('エラーハンドリングの確認', async ({ page }) => {
      // ネットワークエラーをシミュレート
      await page.route('**/graphql', route => route.abort())
      
      // 練習記録追加を試行
      const today = new Date().getDate().toString()
      await page.click(`[data-testid="calendar-day"]:has-text("${today}")`)
      await page.click('[data-testid="add-practice-button"]')
      
      // フォーム入力
      await page.fill('[data-testid="practice-place"]', 'テストプール')
      await page.selectOption('[data-testid="practice-style"]', 'fr')
      await page.click('[data-testid="save-practice-button"]')
      
      // エラーメッセージが表示されることを確認
      await expect(page.locator('text=保存に失敗しました')).toBeVisible()
    })
  })
})
