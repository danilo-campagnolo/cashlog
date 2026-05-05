/* E2E Tests: Transaction Deletion and Clear All */
import { TestHelpers, Matchers } from './helpers';

describe('Transaction Management', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should delete a transaction using the delete button', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'To Delete');
    await TestHelpers.typeText(element(by.id('input-amount')), '25.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectTransactionToExist('To Delete', '-25.00€');
    await Matchers.expectBalanceToEqual('25.00€');

    await element(by.id('button-delete')).atIndex(0).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectTransactionNotToExist('To Delete');
    await Matchers.expectBalanceToEqual('0.00€');
  });

  it('should delete the correct transaction when multiple exist', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Keep Me');
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.typeText(element(by.id('input-description')), 'Delete Me');
    await TestHelpers.typeText(element(by.id('input-amount')), '5.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Delete Me is the most recent — index 0 in the list */
    await element(by.id('button-delete')).atIndex(0).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectTransactionToExist('Keep Me', '-10.00€');
    await Matchers.expectTransactionNotToExist('Delete Me');
    await Matchers.expectBalanceToEqual('10.00€');
  });

  it('should show clear all button only when transactions exist', async () => {
    await expect(element(by.id('button-clear-all'))).not.toBeVisible();

    await TestHelpers.typeText(element(by.id('input-description')), 'Any Transaction');
    await TestHelpers.typeText(element(by.id('input-amount')), '1.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await expect(element(by.id('button-clear-all'))).toBeVisible();
  });

  it('should clear all transactions and show empty state', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'First');
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await TestHelpers.typeText(element(by.id('input-description')), 'Second');
    await TestHelpers.typeText(element(by.id('input-amount')), '20.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await element(by.id('button-clear-all')).tap();
    await TestHelpers.waitForDatabaseSync();

    await Matchers.expectEmptyState();
    await expect(element(by.id('button-clear-all'))).not.toBeVisible();
    await Matchers.expectBalanceToEqual('0.00€');
  });

  it('should update balance correctly after deleting income transaction', async () => {
    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'My Income');
    await TestHelpers.typeText(element(by.id('input-amount')), '500.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await element(by.id('toggle-expense')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'My Expense');
    await TestHelpers.typeText(element(by.id('input-amount')), '100.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Balance: 500 - 100 = 400 */
    await Matchers.expectBalanceToEqual('400.00€');

    /* Delete My Expense (most recent, index 0) */
    await element(by.id('button-delete')).atIndex(0).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Balance: 500 */
    await Matchers.expectBalanceToEqual('500.00€');
  });
});
