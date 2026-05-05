/* E2E Tests: Transaction Editing and Deletion */
import { TestHelpers, Matchers } from './helpers';

describe('Transaction Management', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    
    /* Create a test transaction for each test */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Test Transaction'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '25.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();
  });

  it('should display transaction details when tapped', async () => {
    /* Tap on transaction */
    await element(by.text('Test Transaction')).tap();

    /* Verify transaction details are visible */
    await expect(element(by.id('transaction-details-modal'))).toBeVisible();
    await expect(element(by.text('Test Transaction'))).toBeVisible();
    await expect(element(by.text('-$25.00'))).toBeVisible();
  });

  it('should edit transaction description', async () => {
    /* Tap on transaction to open details */
    await element(by.text('Test Transaction')).tap();
    
    /* Tap edit button */
    await element(by.id('button-edit-transaction')).tap();
    
    /* Clear and update description */
    await TestHelpers.clearAndTypeText(
      element(by.id('input-description')),
      'Updated Transaction'
    );
    
    /* Save changes */
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify updated transaction appears */
    await Matchers.expectTransactionToExist('Updated Transaction', '-$25.00');
    
    /* Verify old description is gone */
    await expect(element(by.text('Test Transaction'))).not.toBeVisible();
  });

  it('should edit transaction amount', async () => {
    /* Tap on transaction to open details */
    await element(by.text('Test Transaction')).tap();
    
    /* Tap edit button */
    await element(by.id('button-edit-transaction')).tap();
    
    /* Clear and update amount */
    await TestHelpers.clearAndTypeText(
      element(by.id('input-amount')),
      '50.00'
    );
    
    /* Save changes */
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify updated amount appears */
    await Matchers.expectTransactionToExist('Test Transaction', '-$50.00');
    
    /* Verify balance is updated */
    await Matchers.expectBalanceToEqual('-$50.00');
  });

  it('should change transaction type from expense to income', async () => {
    /* Tap on transaction to open details */
    await element(by.text('Test Transaction')).tap();
    
    /* Tap edit button */
    await element(by.id('button-edit-transaction')).tap();
    
    /* Switch to income */
    await element(by.id('toggle-income')).tap();
    
    /* Save changes */
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction is now income */
    await Matchers.expectTransactionToExist('Test Transaction', '+$25.00');
    
    /* Verify balance is updated to positive */
    await Matchers.expectBalanceToEqual('$25.00');
  });

  it('should delete transaction', async () => {
    /* Verify initial balance */
    await Matchers.expectBalanceToEqual('-$25.00');

    /* Tap on transaction to open details */
    await element(by.text('Test Transaction')).tap();
    
    /* Tap delete button */
    await element(by.id('button-delete-transaction')).tap();
    
    /* Confirm deletion if there's a confirmation dialog */
    try {
      await element(by.text('Delete')).tap();
    } catch (e) {
      /* No confirmation dialog, deletion happened immediately */
    }
    
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction is removed */
    await expect(element(by.text('Test Transaction'))).not.toBeVisible();
    
    /* Verify balance is reset to 0 */
    await Matchers.expectBalanceToEqual('$0.00');
  });

  it('should cancel transaction edit', async () => {
    /* Tap on transaction to open details */
    await element(by.text('Test Transaction')).tap();
    
    /* Tap edit button */
    await element(by.id('button-edit-transaction')).tap();
    
    /* Change description */
    await TestHelpers.clearAndTypeText(
      element(by.id('input-description')),
      'Should Not Save'
    );
    
    /* Close modal/cancel edit */
    await element(by.id('button-cancel-edit')).tap();
    
    await TestHelpers.waitForDatabaseSync();

    /* Verify original transaction is still there */
    await Matchers.expectTransactionToExist('Test Transaction', '-$25.00');
    
    /* Verify edited text was not saved */
    await expect(element(by.text('Should Not Save'))).not.toBeVisible();
  });

  it('should handle editing multiple transactions', async () => {
    /* Create second transaction */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Second Transaction'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '15.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Edit first transaction */
    await element(by.text('Test Transaction')).tap();
    await element(by.id('button-edit-transaction')).tap();
    await TestHelpers.clearAndTypeText(
      element(by.id('input-amount')),
      '30.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Edit second transaction */
    await element(by.text('Second Transaction')).tap();
    await element(by.id('button-edit-transaction')).tap();
    await TestHelpers.clearAndTypeText(
      element(by.id('input-amount')),
      '20.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify both are updated correctly */
    await Matchers.expectTransactionToExist('Test Transaction', '-$30.00');
    await Matchers.expectTransactionToExist('Second Transaction', '-$20.00');
    
    /* Verify balance is correct: -30 + -20 = -50 */
    await Matchers.expectBalanceToEqual('-$50.00');
  });
});
