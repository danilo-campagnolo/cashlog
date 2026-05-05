/* E2E Tests: Database Persistence */
import { TestHelpers, Matchers } from './helpers';

describe('Database Persistence', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should persist transactions after app reload', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Persistent Transaction');
    await TestHelpers.typeText(element(by.id('input-amount')), '100.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.reloadApp();

    await Matchers.expectTransactionToExist('Persistent Transaction', '-100.00€');
    await Matchers.expectBalanceToEqual('100.00€');
  });

  it('should persist balance calculations after app reload', async () => {
    const transactions = [
      { description: 'Expense 1', amount: '50.00', type: 'expense' as const },
      { description: 'Income 1', amount: '200.00', type: 'income' as const },
      { description: 'Expense 2', amount: '30.00', type: 'expense' as const },
    ];

    for (const tx of transactions) {
      await element(by.id(tx.type === 'income' ? 'toggle-income' : 'toggle-expense')).tap();
      await TestHelpers.typeText(element(by.id('input-description')), tx.description);
      await TestHelpers.typeText(element(by.id('input-amount')), tx.amount);
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync();
    }

    /* 200 - 50 - 30 = 120 */
    await Matchers.expectBalanceToEqual('120.00€');

    await TestHelpers.reloadApp();

    await Matchers.expectBalanceToEqual('120.00€');
    await Matchers.expectIncomeToEqual('200.00€');
    await Matchers.expectExpenseToEqual('80.00€');
  });

  it('should persist transaction deletions after app reload', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Keep This');
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.typeText(element(by.id('input-description')), 'Delete This');
    await TestHelpers.typeText(element(by.id('input-amount')), '5.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Delete This is most recent — index 0 */
    await element(by.id('button-delete')).atIndex(0).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.reloadApp();

    await Matchers.expectTransactionToExist('Keep This', '-10.00€');
    await Matchers.expectTransactionNotToExist('Delete This');
    await Matchers.expectBalanceToEqual('10.00€');
  });

  it('should handle app backgrounding and resuming', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Background Test');
    await TestHelpers.typeText(element(by.id('input-amount')), '25.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.backgroundAndResume(3000);

    await Matchers.expectTransactionToExist('Background Test', '-25.00€');
    await Matchers.expectBalanceToEqual('25.00€');
  });

  it('should maintain transaction order after reload', async () => {
    const descriptions = ['First', 'Second', 'Third'];

    for (const description of descriptions) {
      await TestHelpers.typeText(element(by.id('input-description')), description);
      await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync(300);
    }

    await TestHelpers.reloadApp();

    await expect(
      element(by.id('transaction-item-description').and(by.text('Third')))
    ).toBeVisible();
    await expect(
      element(by.id('transaction-item-description').and(by.text('Second')))
    ).toBeVisible();
    await expect(
      element(by.id('transaction-item-description').and(by.text('First')))
    ).toBeVisible();
  });
});
