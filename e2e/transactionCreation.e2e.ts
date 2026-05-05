/* E2E Tests: Transaction Creation */
import { TestHelpers, Matchers } from './helpers';

describe('Transaction Creation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the main screen with all components', async () => {
    await Matchers.expectMainScreenVisible();
    await expect(element(by.id('expense-form'))).toBeVisible();
    await expect(element(by.id('transaction-list'))).toBeVisible();
  });

  it('should create a new expense transaction', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Coffee');
    await TestHelpers.typeText(element(by.id('input-amount')), '5.50');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectTransactionToExist('Coffee', '-5.50€');
    await Matchers.expectBalanceToEqual('5.50€');
  });

  it('should create a new income transaction', async () => {
    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Freelance Payment');
    await TestHelpers.typeText(element(by.id('input-amount')), '500.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectTransactionToExist('Freelance Payment', '+500.00€');
    await Matchers.expectBalanceToEqual('500.00€');
  });

  it('should not create transaction with empty description', async () => {
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await expect(element(by.id('input-description'))).toBeVisible();
  });

  it('should not create transaction with empty amount', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Test Transaction');
    await element(by.id('button-add-transaction')).tap();
    await expect(element(by.id('input-amount'))).toBeVisible();
  });

  it('should create multiple transactions and calculate correct balance', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Groceries');
    await TestHelpers.typeText(element(by.id('input-amount')), '50.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Salary');
    await TestHelpers.typeText(element(by.id('input-amount')), '1000.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await element(by.id('toggle-expense')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Gas');
    await TestHelpers.typeText(element(by.id('input-amount')), '30.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* 1000 - 50 - 30 = 920 */
    await Matchers.expectBalanceToEqual('920.00€');
    await Matchers.expectIncomeToEqual('1000.00€');
    await Matchers.expectExpenseToEqual('80.00€');
  });

  it('should clear form fields after successful submission', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Test');
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await expect(element(by.id('input-description'))).toHaveText('');
    await expect(element(by.id('input-amount'))).toHaveText('');
  });

  it('should handle decimal amounts correctly', async () => {
    const testCases = [
      { desc: 'Decimal 10.50', amount: '10.50', display: '-10.50€' },
      { desc: 'Decimal 0.99', amount: '0.99', display: '-0.99€' },
      { desc: 'Decimal 1234.56', amount: '1234.56', display: '-1234.56€' },
    ];

    for (const tc of testCases) {
      await TestHelpers.typeText(element(by.id('input-description')), tc.desc);
      await TestHelpers.typeText(element(by.id('input-amount')), tc.amount);
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync();
      await Matchers.expectTransactionToExist(tc.desc, tc.display);
    }
  });
});
