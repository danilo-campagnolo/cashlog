/* E2E Tests: Transaction Creation and Management */
import { TestHelpers, Matchers } from './helpers';

describe('Transaction Creation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the main screen with all components', async () => {
    /* Verify main UI elements are visible */
    await Matchers.expectMainScreenVisible();
    await expect(element(by.id('expense-form'))).toBeVisible();
    await expect(element(by.id('transaction-list'))).toBeVisible();
  });

  it('should create a new expense transaction', async () => {
    /* Fill expense form */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Coffee'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '5.50'
    );

    /* Submit the form */
    await element(by.id('button-add-transaction')).tap();
    
    /* Wait for database sync */
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction appears in list */
    await Matchers.expectTransactionToExist('Coffee', '-$5.50');
    
    /* Verify balance is updated */
    await Matchers.expectBalanceToEqual('-$5.50');
  });

  it('should create a new income transaction', async () => {
    /* Switch to income type */
    await element(by.id('toggle-income')).tap();

    /* Fill income form */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Freelance Payment'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '500.00'
    );

    /* Submit the form */
    await element(by.id('button-add-transaction')).tap();
    
    /* Wait for database sync */
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction appears in list */
    await Matchers.expectTransactionToExist('Freelance Payment', '+$500.00');
    
    /* Verify balance is updated */
    await Matchers.expectBalanceToEqual('$500.00');
  });

  it('should not create transaction with empty description', async () => {
    /* Try to submit with only amount */
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '10.00'
    );

    await element(by.id('button-add-transaction')).tap();
    
    /* Form should remain visible (transaction not created) */
    await expect(element(by.id('input-description'))).toBeVisible();
  });

  it('should not create transaction with empty amount', async () => {
    /* Try to submit with only description */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Test Transaction'
    );

    await element(by.id('button-add-transaction')).tap();
    
    /* Form should remain visible (transaction not created) */
    await expect(element(by.id('input-amount'))).toBeVisible();
  });

  it('should create multiple transactions and calculate correct balance', async () => {
    /* Create first expense */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Groceries'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '50.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Create income */
    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Salary'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '1000.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Create second expense */
    await element(by.id('toggle-expense')).tap();
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Gas'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '30.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify final balance: 1000 - 50 - 30 = 920 */
    await Matchers.expectBalanceToEqual('$920.00');
    await Matchers.expectIncomeToEqual('$1000.00');
    await Matchers.expectExpenseToEqual('$80.00');
  });

  it('should clear form fields after successful submission', async () => {
    /* Fill and submit form */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Test'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '10.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify form is cleared */
    await expect(element(by.id('input-description'))).toHaveText('');
    await expect(element(by.id('input-amount'))).toHaveText('');
  });

  it('should handle decimal amounts correctly', async () => {
    const testCases = ['10.50', '0.99', '100.00', '1234.56'];

    for (const amount of testCases) {
      await TestHelpers.typeText(
        element(by.id('input-description')),
        `Test ${amount}`
      );
      await TestHelpers.typeText(
        element(by.id('input-amount')),
        amount
      );
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync();

      /* Verify transaction with correct amount format */
      await Matchers.expectTransactionToExist(
        `Test ${amount}`,
        `-$${amount}`
      );
    }
  });
});
