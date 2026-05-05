# 🎯 E2E Testing Quick Reference Card

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Build test app
npm run test:e2e:build

# Start emulator
emulator -avd Pixel_7_API_34

# Run all tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- e2e/transactionCreation.e2e.ts

# Run with verbose logging
DETOX_LOGLEVEL=trace npm run test:e2e
```

## 📋 All TestIDs at a Glance

| Component | TestID | Element |
|-----------|--------|---------|
| **App.tsx** |
| | `app-title` | Main "Cashlog" title |
| | `transaction-list` | Transaction FlatList |
| **BalanceCard.tsx** |
| | `balance-card` | Card container |
| | `balance-amount` | Total balance text |
| | `income-amount` | Income total text |
| | `expense-amount` | Expense total text |
| **ExpenseForm.tsx** |
| | `expense-form` | Form container |
| | `toggle-expense` | Expense button |
| | `toggle-income` | Income button |
| | `input-description` | Description input |
| | `input-amount` | Amount input |
| | `button-add-transaction` | Submit button |
| **ExpenseItem.tsx** |
| | `transaction-item-{id}` | Transaction card (dynamic) |
| | `button-delete-{id}` | Delete button (dynamic) |

## 🧪 Test Files Overview

| File | Tests | What It Tests |
|------|-------|---------------|
| `transactionCreation.e2e.ts` | 8 | Creating transactions, validation |
| `transactionManagement.e2e.ts` | 7 | Editing, deleting transactions |
| `databasePersistence.e2e.ts` | 6 | Data persistence, app reload |
| `widgetDeepLinking.e2e.ts` | 8 | Widget integration, deep links |
| `performance.e2e.ts` | 7 | Performance, memory, scrolling |

## 🛠️ Helper Functions

```typescript
/* Import helpers */
import { TestHelpers, Matchers } from './helpers';

/* Common operations */
await TestHelpers.typeText(element(by.id('input')), 'text');
await TestHelpers.clearAndTypeText(element(by.id('input')), 'new');
await TestHelpers.launchWithUrl('cashlog://transaction?type=income');
await TestHelpers.reloadApp();
await TestHelpers.waitForDatabaseSync();

/* Assertions */
await Matchers.expectBalanceToEqual('$100.00');
await Matchers.expectTransactionToExist('Coffee', '-$5.50');
await Matchers.expectMainScreenVisible();
```

## 🔍 Common Test Patterns

### Create Transaction
```typescript
await element(by.id('input-description')).typeText('Coffee');
await element(by.id('input-amount')).typeText('5.50');
await element(by.id('button-add-transaction')).tap();
await TestHelpers.waitForDatabaseSync();
```

### Switch to Income
```typescript
await element(by.id('toggle-income')).tap();
```

### Delete Transaction
```typescript
await element(by.id('button-delete-1')).tap();
await TestHelpers.waitForDatabaseSync();
```

### Verify Balance
```typescript
await expect(element(by.id('balance-amount'))).toHaveText('$100.00');
```

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot find AVD" | Name must be exactly `Pixel_7_API_34` |
| "Element not found" | Add missing testID, rebuild app |
| "Tests timeout" | Increase timeout, add `waitFor()` |
| Build fails | Run `cd android && ./gradlew clean` |
| Java error | Use Java 17/21, not Java 24 |

## 📊 Performance Benchmarks

| Operation | Threshold |
|-----------|-----------|
| Create 50 transactions | < 120s |
| App reload | < 5s |
| Database query | < 2s |
| 10 rapid submissions | < 30s |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICKSTART_E2E.md` | Get started fast |
| `e2e/README.md` | Complete guide |
| `e2e/ADDING_TESTIDS.md` | TestID implementation |
| `TESTID_CHANGES.md` | What was changed |
| `E2E_IMPLEMENTATION_CHECKLIST.md` | Progress tracking |

## 🎯 CI/CD

Tests run automatically on:
- ✅ Push to `main` or `develop`
- ✅ Pull requests
- ✅ Manual workflow dispatch

Check: `.github/workflows/e2e-tests.yml`

## ✅ Pre-Test Checklist

- [ ] `npm install` completed
- [ ] `npm run test:e2e:build` successful
- [ ] Emulator `Pixel_7_API_34` created
- [ ] Emulator is running
- [ ] All testIDs added to components
- [ ] Metro bundler running (or will auto-start)

## 🆘 Need Help?

1. Check `QUICKSTART_E2E.md` for setup
2. Review `e2e/README.md` for detailed docs
3. See `TESTID_CHANGES.md` for what was modified
4. Check test examples in `e2e/*.e2e.ts` files

---

**Ready to test?** → `npm run test:e2e` 🚀

**Total Tests**: 36 | **Test Time**: ~10-15 min | **Coverage**: Complete
