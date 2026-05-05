/* E2E Tests: Performance */
import { TestHelpers } from './helpers';

describe('Performance Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should render large transaction list efficiently', async () => {
    const startTime = Date.now();

    for (let i = 0; i < 50; i++) {
      const transaction = TestHelpers.generateTransaction(i % 2 === 0 ? 'expense' : 'income');

      await element(by.id(transaction.type === 'income' ? 'toggle-income' : 'toggle-expense')).tap();
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`${transaction.description} ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(transaction.amount);
      await element(by.id('button-add-transaction')).tap();

      if (i % 10 === 0) {
        await TestHelpers.waitForDatabaseSync(200);
      }
    }

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(120000);

    await expect(element(by.id('transaction-list'))).toBeVisible();
  });

  it('should scroll through large list smoothly', async () => {
    for (let i = 0; i < 30; i++) {
      const transaction = TestHelpers.generateTransaction();
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`${transaction.description} ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(transaction.amount);
      await element(by.id('button-add-transaction')).tap();

      if (i % 10 === 0) {
        await TestHelpers.waitForDatabaseSync(200);
      }
    }

    const list = element(by.id('transaction-list'));
    await list.scroll(500, 'down');
    await list.scroll(500, 'down');
    await list.scroll(500, 'down');
    await list.scroll(500, 'up');
    await list.scroll(500, 'up');
    await expect(list).toBeVisible();
  });

  it('should handle rapid form submissions', async () => {
    const startTime = Date.now();

    for (let i = 0; i < 10; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Rapid ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }

    await TestHelpers.waitForDatabaseSync(1000);
    expect(Date.now() - startTime).toBeLessThan(30000);

    await expect(
      element(by.id('transaction-item-description').and(by.text('Rapid 1')))
    ).toBeVisible();
    await expect(
      element(by.id('transaction-item-description').and(by.text('Rapid 10')))
    ).toBeVisible();
  });

  it('should maintain performance after multiple app reloads', async () => {
    for (let i = 0; i < 5; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Transaction ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }
    await TestHelpers.waitForDatabaseSync();

    const reloadTimes: number[] = [];
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await TestHelpers.reloadApp();
      await expect(element(by.id('app-title'))).toBeVisible();
      reloadTimes.push(Date.now() - startTime);
    }

    reloadTimes.forEach(time => {
      expect(time).toBeLessThan(5000);
    });
  });

  it('should handle database queries efficiently', async () => {
    for (const amount of ['100.00', '50.00', '25.00', '10.00', '5.00']) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`Amount ${amount}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText(amount);
      await element(by.id('button-add-transaction')).tap();
    }
    await TestHelpers.waitForDatabaseSync();

    const startTime = Date.now();
    await TestHelpers.reloadApp();
    await expect(element(by.id('balance-card'))).toBeVisible();
    expect(Date.now() - startTime).toBeLessThan(2000);
  });

  it('should handle app state changes efficiently', async () => {
    for (let i = 0; i < 3; i++) {
      await element(by.id('input-description')).tap();
      await element(by.id('input-description')).typeText(`State Test ${i + 1}`);
      await element(by.id('input-amount')).tap();
      await element(by.id('input-amount')).typeText('10.00');
      await element(by.id('button-add-transaction')).tap();
    }
    await TestHelpers.waitForDatabaseSync();

    for (let i = 0; i < 3; i++) {
      await TestHelpers.backgroundAndResume(1000);
      await expect(element(by.id('app-title'))).toBeVisible();
    }

    await expect(
      element(by.id('transaction-item-description').and(by.text('State Test 1')))
    ).toBeVisible();
    await expect(
      element(by.id('transaction-item-description').and(by.text('State Test 3')))
    ).toBeVisible();
  });
});
