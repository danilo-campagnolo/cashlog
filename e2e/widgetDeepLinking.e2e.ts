/* E2E Tests: Widget Deep Linking */
import { TestHelpers, Matchers } from './helpers';

describe('Widget Deep Linking', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should open app with expense form when launched from expense widget', async () => {
    /* Launch app with expense deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=expense');

    /* Verify app opened */
    await Matchers.expectMainScreenVisible();

    /* Verify expense toggle is selected */
    await expect(element(by.id('toggle-expense'))).toBeVisible();
    
    /* Verify form is focused on expense type */
    await expect(element(by.id('expense-form'))).toBeVisible();
  });

  it('should open app with income form when launched from income widget', async () => {
    /* Launch app with income deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=income');

    /* Verify app opened */
    await Matchers.expectMainScreenVisible();

    /* Verify income toggle is selected */
    await expect(element(by.id('toggle-income'))).toBeVisible();
    
    /* Verify form is focused on income type */
    await expect(element(by.id('expense-form'))).toBeVisible();
  });

  it('should allow adding expense after deep link from widget', async () => {
    /* Launch with expense deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=expense');

    /* Fill form */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Widget Expense'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '15.00'
    );
    
    /* Submit */
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction created */
    await Matchers.expectTransactionToExist('Widget Expense', '-15.00€');
  });

  it('should allow adding income after deep link from widget', async () => {
    /* Launch with income deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=income');

    /* Fill form */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Widget Income'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '100.00'
    );
    
    /* Submit */
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify transaction created */
    await Matchers.expectTransactionToExist('Widget Income', '+100.00€');
  });

  it('should handle invalid deep link gracefully', async () => {
    /* Launch with invalid deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=invalid');

    /* Should still open app normally */
    await Matchers.expectMainScreenVisible();
    
    /* Should default to expense */
    await expect(element(by.id('expense-form'))).toBeVisible();
  });

  it('should handle deep link without type parameter', async () => {
    /* Launch with deep link missing type */
    await TestHelpers.launchWithUrl('cashlog://transaction');

    /* Should open app normally */
    await Matchers.expectMainScreenVisible();
    
    /* Should default to expense */
    await expect(element(by.id('expense-form'))).toBeVisible();
  });

  it('should maintain widget-selected type after form submission', async () => {
    /* Launch with income deep link */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=income');

    /* Add income transaction */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'First Income'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '50.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Verify form reset to income (not expense) */
    await expect(element(by.id('toggle-income'))).toBeVisible();
    
    /* Add another income to confirm */
    await TestHelpers.typeText(
      element(by.id('input-description')),
      'Second Income'
    );
    await TestHelpers.typeText(
      element(by.id('input-amount')),
      '25.00'
    );
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Both should be income */
    await Matchers.expectTransactionToExist('First Income', '+50.00€');
    await Matchers.expectTransactionToExist('Second Income', '+25.00€');
  });

  it('should handle rapid widget button presses', async () => {
    /* Simulate rapid widget usage */
    await TestHelpers.launchWithUrl('cashlog://transaction?type=expense');
    await TestHelpers.waitForDatabaseSync(500);
    
    await TestHelpers.launchWithUrl('cashlog://transaction?type=income');
    await TestHelpers.waitForDatabaseSync(500);
    
    await TestHelpers.launchWithUrl('cashlog://transaction?type=expense');

    /* App should still work normally */
    await Matchers.expectMainScreenVisible();
    await expect(element(by.id('expense-form'))).toBeVisible();
  });
});
