/* E2E Tests: Description Suggestions */
import { TestHelpers, Matchers } from './helpers';

describe('Description Suggestions', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show expense suggestions after adding an expense', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Morning Coffee');
    await TestHelpers.typeText(element(by.id('input-amount')), '3.50');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await device.reloadReactNative();

    /* Expense form is default — Morning Coffee should appear as a suggestion */
    await Matchers.expectSuggestionChipVisible('Morning Coffee');
  });

  it('should show income suggestions after adding an income transaction', async () => {
    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Monthly Salary');
    await TestHelpers.typeText(element(by.id('input-amount')), '2000.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await device.reloadReactNative();

    /* Switch to income form — Monthly Salary should appear */
    await element(by.id('toggle-income')).tap();
    await Matchers.expectSuggestionChipVisible('Monthly Salary');
  });

  it('should scope suggestions by transaction type', async () => {
    /* Add expense "Groceries" */
    await element(by.id('toggle-expense')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Groceries');
    await TestHelpers.typeText(element(by.id('input-amount')), '40.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Add income "Bonus" */
    await element(by.id('toggle-income')).tap();
    await TestHelpers.typeText(element(by.id('input-description')), 'Bonus');
    await TestHelpers.typeText(element(by.id('input-amount')), '500.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await device.reloadReactNative();

    /* Expense form: Groceries visible, Bonus not visible */
    await element(by.id('toggle-expense')).tap();
    await Matchers.expectSuggestionChipVisible('Groceries');
    await Matchers.expectSuggestionChipNotVisible('Bonus');

    /* Income form: Bonus visible, Groceries not visible */
    await element(by.id('toggle-income')).tap();
    await Matchers.expectSuggestionChipVisible('Bonus');
    await Matchers.expectSuggestionChipNotVisible('Groceries');
  });

  it('should fill description field when tapping a suggestion', async () => {
    /* Add an expense to create a suggestion */
    await TestHelpers.typeText(element(by.id('input-description')), 'Tap Me');
    await TestHelpers.typeText(element(by.id('input-amount')), '5.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    await device.reloadReactNative();

    /* Tap the suggestion chip */
    await element(by.id('suggestion-chip').and(by.text('Tap Me'))).tap();

    /* Description field should be filled */
    await expect(element(by.id('input-description'))).toHaveText('Tap Me');
  });

  it('should filter suggestions as user types', async () => {
    /* Seed two suggestions */
    for (const desc of ['Transport Bus', 'Transport Taxi']) {
      await TestHelpers.typeText(element(by.id('input-description')), desc);
      await TestHelpers.typeText(element(by.id('input-amount')), '5.00');
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync();
    }

    await device.reloadReactNative();

    /* Both suggestions appear when field is empty */
    await Matchers.expectSuggestionChipVisible('Transport Bus');
    await Matchers.expectSuggestionChipVisible('Transport Taxi');

    /* Type "Bus" — only Transport Bus should remain */
    await element(by.id('input-description')).tap();
    await element(by.id('input-description')).typeText('Bus');

    await Matchers.expectSuggestionChipVisible('Transport Bus');
    await Matchers.expectSuggestionChipNotVisible('Transport Taxi');
  });

  it('should persist suggestions after clearing all transactions', async () => {
    await TestHelpers.typeText(element(by.id('input-description')), 'Persist Me');
    await TestHelpers.typeText(element(by.id('input-amount')), '10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Clear all transactions */
    await element(by.id('button-clear-all')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Suggestion should still be visible after clearing */
    await Matchers.expectSuggestionChipVisible('Persist Me');
  });
});
