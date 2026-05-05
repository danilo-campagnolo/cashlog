# Cashlog E2E Testing Suite

## Overview

This directory contains comprehensive End-to-End (E2E) tests for the Cashlog expense tracking application using Detox testing framework.

## Test Coverage

### 1. Transaction Creation (`transactionCreation.e2e.ts`)
- ✅ Display main screen components
- ✅ Create expense transactions
- ✅ Create income transactions
- ✅ Validation (empty fields)
- ✅ Multiple transactions with balance calculation
- ✅ Form field clearing after submission
- ✅ Decimal amount handling

### 2. Transaction Management (`transactionManagement.e2e.ts`)
- ✅ Display transaction details
- ✅ Edit transaction description
- ✅ Edit transaction amount
- ✅ Change transaction type (expense ↔ income)
- ✅ Delete transactions
- ✅ Cancel edit operations
- ✅ Edit multiple transactions

### 3. Database Persistence (`databasePersistence.e2e.ts`)
- ✅ Persist transactions after app reload
- ✅ Persist balance calculations
- ✅ Persist transaction edits
- ✅ Persist transaction deletions
- ✅ Handle app backgrounding/resuming
- ✅ Maintain transaction order

### 4. Widget Deep Linking (`widgetDeepLinking.e2e.ts`)
- ✅ Open with expense type from widget
- ✅ Open with income type from widget
- ✅ Add transactions after deep link
- ✅ Handle invalid deep links
- ✅ Maintain widget-selected type after submission
- ✅ Handle rapid widget button presses

### 5. Performance Tests (`performance.e2e.ts`)
- ✅ Render large transaction lists (50+ items)
- ✅ Smooth scrolling performance
- ✅ Rapid form submissions
- ✅ Performance after multiple app reloads
- ✅ Efficient database queries
- ✅ Memory management during edits
- ✅ App state change efficiency

## Prerequisites

### 1. Install Dependencies

```bash
npm install
```

### 2. Android Emulator Setup

You need an Android emulator configured with the following specifications:
- **AVD Name**: `Pixel_7_API_34`
- **API Level**: 34
- **Profile**: Pixel 7
- **Target**: google_apis

To create the emulator:

```bash
# List available system images
sdkmanager --list

# Install system image
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create AVD
avdmanager create avd \
  --name Pixel_7_API_34 \
  --package "system-images;android-34;google_apis;x86_64" \
  --device "pixel_7"
```

Or use Android Studio:
1. Tools → Device Manager
2. Create Device
3. Select Pixel 7
4. Select API 34 (Android 14)
5. Name it `Pixel_7_API_34`

## Running Tests

### Local Development

#### 1. Build the app for testing:

```bash
npm run test:e2e:build
```

#### 2. Start Android emulator:

```bash
# Start emulator
emulator -avd Pixel_7_API_34

# Or use Android Studio Device Manager
```

#### 3. Run E2E tests:

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- e2e/transactionCreation.e2e.ts

# Run with specific configuration
npm run test:e2e -- --configuration android.emu.debug
```

### CI/CD (GitHub Actions)

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

```bash
# Manually trigger from GitHub UI:
# Actions → E2E Tests → Run workflow
```

## Test Structure

```
e2e/
├── config.json                    # Jest configuration for Detox
├── setup.ts                       # Global test setup
├── helpers.ts                     # Test utilities and matchers
├── transactionCreation.e2e.ts     # Transaction creation tests
├── transactionManagement.e2e.ts   # Edit/delete tests
├── databasePersistence.e2e.ts     # Data persistence tests
├── widgetDeepLinking.e2e.ts       # Widget integration tests
└── performance.e2e.ts             # Performance benchmarks
```

## Helper Utilities

### TestHelpers

Utility functions for common test operations:

```typescript
/* Wait for element with timeout */
await TestHelpers.waitForElement(element(by.id('my-element')), 10000);

/* Type text into input */
await TestHelpers.typeText(element(by.id('input')), 'Hello');

/* Clear and type new text */
await TestHelpers.clearAndTypeText(element(by.id('input')), 'New text');

/* Take screenshot */
await TestHelpers.takeScreenshot('test-scenario');

/* Reload app */
await TestHelpers.reloadApp();

/* Launch with deep link */
await TestHelpers.launchWithUrl('cashlog://transaction?type=income');

/* Background and resume */
await TestHelpers.backgroundAndResume(2000);

/* Generate random transaction data */
const transaction = TestHelpers.generateTransaction('expense');

/* Wait for database sync */
await TestHelpers.waitForDatabaseSync(500);
```

### Matchers

Custom matchers for common assertions:

```typescript
/* Check balance */
await Matchers.expectBalanceToEqual('$100.00');

/* Check income total */
await Matchers.expectIncomeToEqual('$500.00');

/* Check expense total */
await Matchers.expectExpenseToEqual('$50.00');

/* Verify transaction exists */
await Matchers.expectTransactionToExist('Coffee', '-$5.50');

/* Verify main screen */
await Matchers.expectMainScreenVisible();
```

## Test IDs

All interactive elements must have `testID` props for Detox to interact with them:

### Required TestIDs

```typescript
/* App */
testID="app-title"              // Main app title
testID="transaction-list"       // Transaction FlatList

/* Balance Card */
testID="balance-card"           // Balance card container
testID="balance-amount"         // Total balance text
testID="income-amount"          // Total income text
testID="expense-amount"         // Total expense text

/* Expense Form */
testID="expense-form"           // Form container
testID="toggle-expense"         // Expense toggle button
testID="toggle-income"          // Income toggle button
testID="input-description"      // Description TextInput
testID="input-amount"           // Amount TextInput
testID="button-add-transaction" // Submit button

/* Transaction Item */
testID="transaction-item-{id}"  // Individual transaction
testID="button-edit-{id}"       // Edit button
testID="button-delete-{id}"     // Delete button

/* Transaction Details */
testID="transaction-details-modal" // Details modal
testID="button-edit-transaction"   // Edit in modal
testID="button-delete-transaction" // Delete in modal
testID="button-cancel-edit"        // Cancel button
```

## Adding TestIDs to Components

### Example: TextInput

```tsx
<TextInput
  testID="input-description"
  value={description}
  placeholder="What is this for?"
  onChangeText={setDescription}
/>
```

### Example: Button

```tsx
<TouchableOpacity
  testID="toggle-expense"
  onPress={handleSetExpense}
>
  <Text>Expense</Text>
</TouchableOpacity>
```

### Example: List Item

```tsx
<View testID={`transaction-item-${item.id}`}>
  <Text>{item.description}</Text>
</View>
```

## Debugging Tests

### 1. View Detox logs

```bash
# Enable verbose logging
DETOX_LOGLEVEL=trace npm run test:e2e
```

### 2. Take screenshots on failure

Screenshots are automatically taken on test failures and saved to `artifacts/`.

### 3. Inspect element hierarchy

```bash
# Add to test to see element tree
await element(by.id('app-title')).tap();
```

### 4. Slow down tests for debugging

```typescript
/* Add delays to see what's happening */
await new Promise(resolve => setTimeout(resolve, 2000));
```

## Common Issues

### Issue: "Cannot find AVD"
**Solution**: Ensure emulator name matches exactly: `Pixel_7_API_34`

### Issue: "App installation failed"
**Solution**: 
```bash
# Clean and rebuild
npm run build:android:clean
npm run test:e2e:build
```

### Issue: "Element not found"
**Solution**: 
- Verify `testID` is set on component
- Use `waitFor()` to handle async rendering
- Check element is actually visible on screen

### Issue: "Tests timeout"
**Solution**:
- Increase timeout in test: `it('test', async () => {...}, 120000);`
- Check emulator performance
- Verify app is responding

### Issue: "Database not persisting"
**Solution**:
- Add `waitForDatabaseSync()` after operations
- Verify SQLite is properly configured
- Check file permissions in Android

## Performance Benchmarks

Expected performance thresholds:

| Operation | Maximum Time |
|-----------|-------------|
| Create 50 transactions | 120 seconds |
| App reload with data | 5 seconds |
| Database query load | 2 seconds |
| Single transaction creation | 3 seconds |
| Rapid form submissions (10x) | 30 seconds |

## CI/CD Configuration

### GitHub Actions Workflow

The workflow (`e2e-tests.yml`) includes:

1. ✅ Node.js 18 setup
2. ✅ Java 17 setup (required for Gradle 8.6)
3. ✅ Gradle caching
4. ✅ AVD caching
5. ✅ Emulator optimization (no window, no audio)
6. ✅ Test artifact upload on failure
7. ✅ Screenshot capture

### Workflow triggers:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Manual dispatch

## Best Practices

### 1. Test Isolation
Each test should be independent and not rely on state from other tests.

```typescript
beforeEach(async () => {
  await device.reloadReactNative(); // Reset state
});
```

### 2. Use Descriptive Test Names
```typescript
it('should create expense transaction and update balance', async () => {
  // Test implementation
});
```

### 3. Add Proper Wait Conditions
```typescript
/* Bad */
await element(by.id('button')).tap();
await element(by.text('Result')).tap(); // May fail if slow

/* Good */
await element(by.id('button')).tap();
await waitFor(element(by.text('Result')))
  .toBeVisible()
  .withTimeout(5000);
```

### 4. Clean Up After Tests
```typescript
afterAll(async () => {
  await detox.cleanup();
});
```

### 5. Use Helper Functions
Reuse helper utilities instead of duplicating test code.

## Extending Tests

### Adding New Test File

1. Create file: `e2e/myFeature.e2e.ts`
2. Import helpers:
```typescript
import { TestHelpers, Matchers } from './helpers';
```
3. Write tests with proper setup:
```typescript
describe('My Feature', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should do something', async () => {
    // Test implementation
  });
});
```

### Adding New Helper Function

Add to `e2e/helpers.ts`:
```typescript
export class TestHelpers {
  static async myHelper(): Promise<void> {
    // Implementation
  }
}
```

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Detox API Reference](https://wix.github.io/Detox/docs/api/actions)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Jest Expect](https://jestjs.io/docs/expect)

## Support

For issues or questions:
1. Check this README
2. Review Detox documentation
3. Check existing test examples
4. Open an issue on GitHub
