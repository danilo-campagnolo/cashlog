/* Helper utilities for E2E tests */

export class TestHelpers {
  static async waitForElement(
    el: Detox.NativeElement,
    timeout: number = 10000
  ): Promise<void> {
    await waitFor(el).toBeVisible().withTimeout(timeout);
  }

  static async typeText(
    el: Detox.NativeElement,
    text: string
  ): Promise<void> {
    await el.tap();
    await el.typeText(text);
  }

  static async clearAndTypeText(
    el: Detox.NativeElement,
    text: string
  ): Promise<void> {
    await el.tap();
    await el.clearText();
    await el.typeText(text);
  }

  static async takeScreenshot(name: string): Promise<void> {
    await device.takeScreenshot(name);
  }

  static async reloadApp(): Promise<void> {
    await device.reloadReactNative();
  }

  static async launchWithUrl(url: string): Promise<void> {
    await device.launchApp({ newInstance: true, url });
  }

  static async backgroundAndResume(duration: number = 2000): Promise<void> {
    await device.sendToHome();
    await new Promise(resolve => setTimeout(resolve, duration));
    await device.launchApp({ newInstance: false });
  }

  static generateTransaction(type: 'income' | 'expense' = 'expense') {
    const descriptions = {
      expense: ['Groceries', 'Gas', 'Coffee', 'Lunch', 'Transport'],
      income: ['Salary', 'Freelance', 'Bonus', 'Investment', 'Gift'],
    };
    const amounts = ['10.50', '25.00', '100.00', '50.75', '15.20'];
    return {
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      type,
    };
  }

  static async waitForDatabaseSync(delay: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export class Matchers {
  /* Balance card matchers — formatCurrency uses Math.abs, so no sign */
  static async expectBalanceToEqual(expected: string): Promise<void> {
    await expect(element(by.id('balance-amount'))).toHaveText(expected);
  }

  static async expectIncomeToEqual(expected: string): Promise<void> {
    await expect(element(by.id('income-amount'))).toHaveText(expected);
  }

  static async expectExpenseToEqual(expected: string): Promise<void> {
    await expect(element(by.id('expense-amount'))).toHaveText(expected);
  }

  /* Use compound matchers with testID to avoid ambiguity with suggestion chips */
  static async expectTransactionToExist(
    description: string,
    amount: string
  ): Promise<void> {
    await expect(
      element(by.id('transaction-item-description').and(by.text(description)))
    ).toBeVisible();
    await expect(
      element(by.id('transaction-item-amount').and(by.text(amount)))
    ).toBeVisible();
  }

  static async expectTransactionNotToExist(description: string): Promise<void> {
    await expect(
      element(by.id('transaction-item-description').and(by.text(description)))
    ).not.toBeVisible();
  }

  static async expectMainScreenVisible(): Promise<void> {
    await expect(element(by.id('app-title'))).toBeVisible();
    await expect(element(by.id('balance-card'))).toBeVisible();
  }

  static async expectEmptyState(): Promise<void> {
    await expect(element(by.id('empty-state-message'))).toBeVisible();
  }

  static async expectSuggestionChipVisible(text: string): Promise<void> {
    await expect(
      element(by.id('suggestion-chip').and(by.text(text)))
    ).toBeVisible();
  }

  static async expectSuggestionChipNotVisible(text: string): Promise<void> {
    await expect(
      element(by.id('suggestion-chip').and(by.text(text)))
    ).not.toBeVisible();
  }
}
