/* E2E Tests: Performance and Battery Efficiency */
import { TestHelpers } from './helpers';

describe('Performance Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should render large transaction list efficiently', async () => {
    /* Create 50 transactions to test list performance */
    const startTime = Date.now();
    
    for (let i = 0; i < 50; i++) {
      const transaction = TestHelpers.generateTransaction(
        i % 2 === 0 ? 'expense' : 'income'
      );
      
      if (transaction.type === 'income') {
        await element(by.id('toggle-income')).tap();
      } else {
        await element(by.id('toggle-expense')).tap();
      }
      
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(
        `${transaction.description} ${i + 1}`
      );
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(transaction.amount);
      await element(by.id('button-add-transaction')).tap();
      
      /* Minimal wait to avoid overwhelming */
      if (i % 10 === 0) {
        await TestHelpers.waitForDatabaseSync(200);
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    /* Should complete in reasonable time (under 2 minutes) */
    expect(duration).toBeLessThan(120000);
    
    /* Verify list is scrollable and responsive */
    await expect(element(by.id('transaction-list'))).toBeVisible();
  });

  it('should scroll through large list smoothly', async () => {
    /* Create 30 transactions for scrolling test */
    for (let i = 0; i < 30; i++) {
      const transaction = TestHelpers.generateTransaction();
      
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(
        `${transaction.description} ${i + 1}`
      );
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(transaction.amount);
      await element(by.id('button-add-transaction')).tap();
      
      if (i % 10 === 0) {
        await TestHelpers.waitForDatabaseSync(200);
      }
    }

    /* Test scrolling performance */
    const listElement = element(by.id('transaction-list'));
    
    /* Scroll down */
    await listElement.scroll(500, 'down');
    await listElement.scroll(500, 'down');
    await listElement.scroll(500, 'down');
    
    /* Scroll up */
    await listElement.scroll(500, 'up');
    await listElement.scroll(500, 'up');
    
    /* List should still be responsive */
    await expect(listElement).toBeVisible();
  });

  it('should handle rapid form submissions', async () => {
    /* Test rapid transaction creation */
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Rapid ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }
    
    await TestHelpers.waitForDatabaseSync(1000);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    /* Should handle rapid submissions efficiently (under 30 seconds) */
    expect(duration).toBeLessThan(30000);
    
    /* Verify all transactions created */
    await expect(element(by.text('Rapid 1'))).toBeVisible();
    await expect(element(by.text('Rapid 10'))).toBeVisible();
  });

  it('should maintain performance after multiple app reloads', async () => {
    /* Create some transactions */
    for (let i = 0; i < 5; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Transaction ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }
    await TestHelpers.waitForDatabaseSync();

    /* Reload multiple times */
    const reloadTimes: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await TestHelpers.reloadApp();
      await expect(element(by.id('app-title'))).toBeVisible();
      const endTime = Date.now();
      
      reloadTimes.push(endTime - startTime);
    }

    /* Each reload should be reasonably fast (under 5 seconds) */
    reloadTimes.forEach(time => {
      expect(time).toBeLessThan(5000);
    });
  });

  it('should handle database queries efficiently', async () => {
    /* Create transactions with different amounts */
    const amounts = ['100.00', '50.00', '25.00', '10.00', '5.00'];
    
    for (const amount of amounts) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Amount ${amount}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(amount);
      await element(by.id('button-add-transaction')).tap();
    }
    
    await TestHelpers.waitForDatabaseSync();

    /* Reload to force database query */
    const startTime = Date.now();
    await TestHelpers.reloadApp();
    await expect(element(by.id('balance-card'))).toBeVisible();
    const endTime = Date.now();
    
    /* Database load should be fast (under 2 seconds) */
    expect(endTime - startTime).toBeLessThan(2000);
  });

  it('should not cause memory issues with many edit operations', async () => {
    /* Create a transaction */
    await element(by.id('input-description')).tap();
    await element(by.id('input-description')).typeText('Test Edit Performance');
    await element(by.id('input-amount')).tap();
    await element(by.id('input-amount')).typeText('10.00');
    await element(by.id('button-add-transaction')).tap();
    await TestHelpers.waitForDatabaseSync();

    /* Edit it multiple times */
    for (let i = 0; i < 10; i++) {
      await element(by.text('Test Edit Performance')).tap();
      await element(by.id('button-edit-transaction')).tap();
      await element(by.id('input-amount')).clearText();
      await element(by.id('input-amount')).typeText(`${10 + i}.00`);
      await element(by.id('button-add-transaction')).tap();
      await TestHelpers.waitForDatabaseSync(200);
    }

    /* App should still be responsive */
    await expect(element(by.id('app-title'))).toBeVisible();
  });

  it('should handle app state changes efficiently', async () => {
    /* Create transactions */
    for (let i = 0; i < 3; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`State Test ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }
    await TestHelpers.waitForDatabaseSync();

    /* Background and resume multiple times */
    for (let i = 0; i < 3; i++) {
      await TestHelpers.backgroundAndResume(1000);
      await expect(element(by.id('app-title'))).toBeVisible();
    }

    /* Data should remain intact */
    await expect(element(by.text('State Test 1'))).toBeVisible();
    await expect(element(by.text('State Test 3'))).toBeVisible();
  });
});
