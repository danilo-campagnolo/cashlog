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
    /* Create transaction */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Persistent Transaction'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '100.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Reload app */
    await TestHelpers.reloadApp();

    /* Verify transaction still exists */
    await Matchers.expectTransactionToExist('Persistent Transaction', '-$100.00');
    await Matchers.expectBalanceToEqual('-$100.00');
  });

  it('should persist balance calculations after app reload', async () => {
    /* Create multiple transactions */
    const transactions = [
      { description: 'Expense 1', amount: '50.00', type: 'expense' },
      { description: 'Income 1', amount: '200.00', type: 'income' },
      { description: 'Expense 2', amount: '30.00', type: 'expense' },
    ];

    for (const tx of transactions) {
      if (tx.type === 'income') {
        await element(by.id('toggle-income')).tap();
      } else {
        await element(by.id('toggle-expense')).tap();
      }
      
      await TestHelpers.typeText(
        element(by.id('input-description')),
        tx.description
      );
      await TestHelpers.typeText(
        element(by.id('input-amount')),
        tx.amount
      );
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync();
    }

    /* Verify initial balance: 200 - 50 - 30 = 120 */
    await Matchers.expectBalanceToEqual('$120.00');

    /* Reload app */
    await TestHelpers.reloadApp();

    /* Verify balance persists correctly */
    await Matchers.expectBalanceToEqual('$120.00');
    await Matchers.expectIncomeToEqual('$200.00');
    await Matchers.expectExpenseToEqual('$80.00');
  });

  it('should persist transaction edits after app reload', async () => {
    /* Create transaction */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Original'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '10.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Edit transaction */
    await element(by.text('Original')).tap();
    await element(by.id('button-edit-transaction')).tap();
    await TestHelpers.clearAndTypeText(
      element(by.id('input-description')),
      'Edited'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Reload app */
    await TestHelpers.reloadApp();

    /* Verify edit persists */
    await Matchers.expectTransactionToExist('Edited', '-$10.00');
    await expect(element(by.text('Original'))).not.toBeVisible();
  });

  it('should persist transaction deletions after app reload', async () => {
    /* Create two transactions */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Keep This'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '10.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Delete This'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '5.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Delete second transaction */
    await element(by.text('Delete This')).tap();
    await element(by.id('button-delete-transaction')).tap();
    try {
      await element(by.text('Delete')).tap();
    } catch (e) {
      /* No confirmation dialog */
    }
    await TestHelpers.waitForDatabaseSync();

    /* Reload app */
    await TestHelpers.reloadApp();

    /* Verify deletion persists */
    await Matchers.expectTransactionToExist('Keep This', '-$10.00');
    await expect(element(by.text('Delete This'))).not.toBeVisible();
    await Matchers.expectBalanceToEqual('-$10.00');
  });

  it('should handle app backgrounding and resuming', async () => {
    /* Create transaction */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Background Test'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '25.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Background and resume app */
    await TestHelpers.backgroundAndResume(3000);

    /* Verify transaction still exists */
    await Matchers.expectTransactionToExist('Background Test', '-$25.00');
    await Matchers.expectBalanceToEqual('-$25.00');
  });

  it('should maintain transaction order after reload', async () => {
    /* Create transactions in specific order */
    const transactions = ['First', 'Second', 'Third'];
    
    for (const description of transactions) {
      await TestHelpers.typeText(
        element(by.id('input-description')),
        description
      );
      await TestHelpers.typeText(
        element(by.id('input-amount')),
        '10.00'
      );
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync(300);
    }

    /* Reload app */
    await TestHelpers.reloadApp();

    /* Verify order is maintained (newest first) */
    await expect(element(by.text('Third'))).toBeVisible();
    await expect(element(by.text('Second'))).toBeVisible();
    await expect(element(by.text('First'))).toBeVisible();
  });
});
