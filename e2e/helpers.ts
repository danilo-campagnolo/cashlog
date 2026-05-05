/* Helper utilities for E2E tests */

export class TestHelpers {
  /* Wait for element to be visible with retry logic */
  static async waitForElement(
    element: Detox.NativeElement,
    timeout: number = 10000
  ): Promise<void> {
    await waitFor(element)
      .toBeVisible()
      .withTimeout(timeout);
  }

  /* Scroll to element if not visible */
  static async scrollToElement(
    scrollView: Detox.NativeElement,
    element: Detox.IndexableNativeElement,
    direction: 'down' | 'up' = 'down'
  ): Promise<void> {
    await waitFor(element)
      .toBeVisible()
      .whileElement(by.id(scrollView))
      .scroll(100, direction);
  }

  /* Type text with delay to ensure proper input */
  static async typeText(
    element: Detox.NativeElement,
    text: string
  ): Promise<void> {
    await element.tap();
    await element.typeText(text);
  }

  /* Clear and type new text */
  static async clearAndTypeText(
    element: Detox.NativeElement,
    text: string
  ): Promise<void> {
    await element.tap();
    await element.clearText();
    await element.typeText(text);
  }

  /* Take screenshot with custom name */
  static async takeScreenshot(name: string): Promise<void> {
    await device.takeScreenshot(name);
  }

  /* Reload React Native app */
  static async reloadApp(): Promise<void> {
    await device.reloadReactNative();
  }

  /* Launch app with specific URL (for deep linking tests) */
  static async launchWithUrl(url: string): Promise<void> {
    await device.launchApp({
      newInstance: true,
      url: url,
    });
  }

  /* Send app to background and bring back */
  static async backgroundAndResume(duration: number = 2000): Promise<void> {
    await device.sendToHome();
    await new Promise(resolve => setTimeout(resolve, duration));
    await device.launchApp({ newInstance: false });
  }

  /* Get current date in readable format */
  static getCurrentDate(): string {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }

  /* Generate random transaction data */
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

  /* Wait for database operations to complete */
  static async waitForDatabaseSync(delay: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export class Matchers {
  /* Check if balance is displayed correctly */
  static async expectBalanceToEqual(expectedBalance: string): Promise<void> {
    await expect(element(by.id('balance-amount'))).toHaveText(expectedBalance);
  }

  /* Check if income total is displayed correctly */
  static async expectIncomeToEqual(expectedIncome: string): Promise<void> {
    await expect(element(by.id('income-amount'))).toHaveText(expectedIncome);
  }

  /* Check if expense total is displayed correctly */
  static async expectExpenseToEqual(expectedExpense: string): Promise<void> {
    await expect(element(by.id('expense-amount'))).toHaveText(expectedExpense);
  }

  /* Verify transaction exists in list */
  static async expectTransactionToExist(
    description: string,
    amount: string
  ): Promise<void> {
    await expect(element(by.text(description))).toBeVisible();
    await expect(element(by.text(amount))).toBeVisible();
  }

  /* Verify app is on main screen */
  static async expectMainScreenVisible(): Promise<void> {
    await expect(element(by.id('app-title'))).toBeVisible();
    await expect(element(by.id('balance-card'))).toBeVisible();
  }
}
