import { type Page, type Locator, expect } from '@playwright/test'

/**
 * E2Eテスト共通ヘルパー関数
 * 水泳管理システム専用のユーティリティ関数
 */

/**
 * テストユーザー情報
 */
export const TEST_USERS = {
  VALID_USER: {
    email: 'test@example.com',
    password: 'testpassword123'
  },
  INVALID_USER: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
} as const

/**
 * ページ遷移のヘルパー
 */
export class NavigationHelpers {
  constructor(private page: Page) {}

  /**
   * ダッシュボードに移動
   */
  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * ログインページに移動
   */
  async gotoLogin(): Promise<void> {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 練習記録ページに移動
   */
  async gotoPractice(): Promise<void> {
    await this.page.goto('/practice')
    await this.page.waitForLoadState('networkidle')
  }
}

/**
 * 認証関連のヘルパー
 */
export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * ログイン実行
   */
  async login(email: string = TEST_USERS.VALID_USER.email, password: string = TEST_USERS.VALID_USER.password): Promise<void> {
    await this.page.goto('/login')
    
    // メールアドレス入力
    await this.page.getByTestId('email-input').fill(email)
    
    // パスワード入力
    await this.page.getByTestId('password-input').fill(password)
    
    // ログインボタンクリック
    await this.page.getByTestId('login-button').click()
    
    // ダッシュボードへのリダイレクトを待機
    await this.page.waitForURL('/dashboard', { timeout: 10000 })
  }

  /**
   * ログアウト実行
   */
  async logout(): Promise<void> {
    // ユーザーメニューをクリック
    await this.page.getByTestId('user-menu').click()
    
    // ログアウトボタンをクリック
    await this.page.getByTestId('logout-button').click()
    
    // ログインページへのリダイレクトを待機
    await this.page.waitForURL('/login')
  }

  /**
   * 認証状態の確認
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.getByTestId('user-menu').waitFor({ timeout: 3000 })
      return true
    } catch {
      return false
    }
  }
}

/**
 * フォーム関連のヘルパー
 */
export class FormHelpers {
  constructor(private page: Page) {}

  /**
   * 練習記録フォームの入力
   */
  async fillPracticeForm(data: {
    date?: string
    place?: string
    style?: string
    distance?: string
    setCount?: string
    repCount?: string
    note?: string
  }): Promise<void> {
    if (data.date) {
      await this.page.getByTestId('practice-date').fill(data.date)
    }
    
    if (data.place) {
      await this.page.getByTestId('practice-place').fill(data.place)
    }
    
    if (data.style) {
      await this.page.getByTestId('practice-style').selectOption(data.style)
    }
    
    if (data.distance) {
      await this.page.getByTestId('practice-distance').fill(data.distance)
    }
    
    if (data.setCount) {
      await this.page.getByTestId('practice-set-count').fill(data.setCount)
    }
    
    if (data.repCount) {
      await this.page.getByTestId('practice-rep-count').fill(data.repCount)
    }
    
    if (data.note) {
      await this.page.getByTestId('practice-note').fill(data.note)
    }
  }

  /**
   * フォーム送信
   */
  async submitForm(submitButtonTestId: string = 'submit-button'): Promise<void> {
    await this.page.getByTestId(submitButtonTestId).click()
  }
}

/**
 * UI要素の待機ヘルパー
 */
export class WaitHelpers {
  constructor(private page: Page) {}

  /**
   * モーダルの表示を待機
   */
  async waitForModal(modalTestId: string): Promise<Locator> {
    const modal = this.page.getByTestId(modalTestId)
    await modal.waitFor({ state: 'visible' })
    return modal
  }

  /**
   * ローディングの完了を待機
   */
  async waitForLoadingComplete(): Promise<void> {
    // ローディングスピナーが消えるまで待機
    await this.page.getByTestId('loading-spinner').waitFor({ state: 'hidden' })
  }

  /**
   * 成功メッセージの表示を待機
   */
  async waitForSuccessMessage(message?: string): Promise<void> {
    const successElement = this.page.getByTestId('success-message')
    await successElement.waitFor({ state: 'visible' })
    
    if (message) {
      await expect(successElement).toContainText(message)
    }
  }

  /**
   * エラーメッセージの表示を待機
   */
  async waitForErrorMessage(message?: string): Promise<void> {
    const errorElement = this.page.getByTestId('error-message')
    await errorElement.waitFor({ state: 'visible' })
    
    if (message) {
      await expect(errorElement).toContainText(message)
    }
  }
}

/**
 * データ生成ヘルパー
 */
export class DataHelpers {
  /**
   * ランダムな練習記録データを生成
   */
  static generatePracticeData() {
    const today = new Date().toISOString().split('T')[0]
    return {
      date: today,
      place: 'テストプール',
      style: 'fr', // フリースタイル
      distance: '50',
      setCount: '4',
      repCount: '8',
      note: 'E2Eテスト用の練習記録'
    }
  }

  /**
   * ランダムなタイムデータを生成
   */
  static generateTimeData() {
    const minutes = Math.floor(Math.random() * 2)
    const seconds = Math.floor(Math.random() * 60)
    const centiseconds = Math.floor(Math.random() * 100)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }
}

/**
 * ページヘルパーのファクトリー関数
 */
export function createPageHelpers(page: Page) {
  return {
    navigation: new NavigationHelpers(page),
    auth: new AuthHelpers(page),
    form: new FormHelpers(page),
    wait: new WaitHelpers(page),
  }
}
