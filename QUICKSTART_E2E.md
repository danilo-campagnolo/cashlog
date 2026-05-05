# 🚀 Quick Start: E2E Testing for Cashlog

Get your E2E tests running in 5 steps!

## Prerequisites

- ✅ Node.js 18+
- ✅ Android Studio with SDK
- ✅ Java 17 or 21 (not Java 24)
- ✅ macOS, Linux, or Windows with WSL2

## Step 1: Install Dependencies

```bash
# Run the automated setup script
chmod +x scripts/setup-e2e.sh
./scripts/setup-e2e.sh

# Or manually
npm install
npm install -g detox-cli
```

## Step 2: Create Android Emulator

**Option A: Via Android Studio (Recommended)**
1. Open Android Studio
2. Tools → Device Manager
3. Create Device
4. Select **Pixel 7**
5. Select **API Level 34** (Android 14)
6. Name it exactly: `Pixel_7_API_34`
7. Finish

**Option B: Via Command Line**
```bash
# Install system image
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create AVD
avdmanager create avd \
  --name Pixel_7_API_34 \
  --package "system-images;android-34;google_apis;x86_64" \
  --device "pixel_7"
```

## Step 3: Add TestIDs to Components

Add these `testID` props to your components (detailed guide: `e2e/ADDING_TESTIDS.md`):

### App.tsx
```tsx
<Text testID="app-title">Cashlog</Text>
<FlatList testID="transaction-list" ... />
```

### BalanceCard.tsx
```tsx
<View testID="balance-card">
  <Text testID="balance-amount">{balance}</Text>
  <Text testID="income-amount">{income}</Text>
  <Text testID="expense-amount">{expense}</Text>
</View>
```

### ExpenseForm.tsx
```tsx
<View testID="expense-form">
  <TouchableOpacity testID="toggle-expense" />
  <TouchableOpacity testID="toggle-income" />
  <TextInput testID="input-description" />
  <TextInput testID="input-amount" />
  <CustomButton testID="button-add-transaction" />
</View>
```

### ExpenseItem.tsx
```tsx
<View testID={`transaction-item-${id}`}>
  <TouchableOpacity testID={`button-edit-${id}`} />
  <TouchableOpacity testID={`button-delete-${id}`} />
</View>
```

## Step 4: Build Test App

```bash
npm run test:e2e:build
```

This will:
- Build Android debug APK
- Build Android test APK
- Configure Detox

⏱️ Takes ~2-5 minutes first time (cached after)

## Step 5: Run Tests

### Start Emulator
```bash
# Start emulator in terminal
emulator -avd Pixel_7_API_34

# Or use Android Studio Device Manager
```

### Run Tests
```bash
# Run all tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- e2e/transactionCreation.e2e.ts

# Run with verbose logging
DETOX_LOGLEVEL=trace npm run test:e2e
```

## Expected Output

```
✓ should display the main screen with all components
✓ should create a new expense transaction
✓ should create a new income transaction
✓ should not create transaction with empty description
✓ should not create transaction with empty amount
✓ should create multiple transactions and calculate correct balance
✓ should clear form fields after successful submission
✓ should handle decimal amounts correctly

36 tests passed
```

## Common Issues & Solutions

### ❌ "Cannot find AVD"
**Solution**: Make sure emulator name is exactly `Pixel_7_API_34`

### ❌ "Element not found"
**Solution**: Add missing `testID` props to components

### ❌ "Tests timeout"
**Solution**: 
- Increase timeout: `it('test', async () => {...}, 120000);`
- Check emulator is running
- Restart Metro bundler: `npm start -- --reset-cache`

### ❌ "Java version error"
**Solution**: 
```bash
# Install Java 17
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
```

### ❌ "Build failed"
**Solution**:
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run test:e2e:build
```

## What's Tested?

✅ **36 tests covering:**
- Transaction creation (expense/income)
- Transaction editing and deletion
- Database persistence
- Widget deep linking
- Balance calculations
- Form validation
- Performance (50+ transactions)
- App state management
- Memory efficiency

## CI/CD Integration

Tests run automatically on GitHub when you:
- Push to `main` or `develop`
- Open a pull request
- Manually trigger workflow

Check: `.github/workflows/e2e-tests.yml`

## Documentation

📖 **Full documentation**: `e2e/README.md`
📝 **TestID guide**: `e2e/ADDING_TESTIDS.md`
📊 **Implementation summary**: `E2E_TEST_SUITE_SUMMARY.md`

## Test Coverage

```
Transaction Creation ........... 8 tests
Transaction Management ......... 7 tests
Database Persistence ........... 6 tests
Widget Deep Linking ............ 8 tests
Performance .................... 7 tests
───────────────────────────────────────
Total ......................... 36 tests
```

## Performance Benchmarks

| Operation | Threshold |
|-----------|-----------|
| Create 50 transactions | < 120s |
| App reload with data | < 5s |
| Database query | < 2s |
| 10 rapid submissions | < 30s |

## Helper Utilities

```typescript
/* Available in all tests */
import { TestHelpers, Matchers } from './helpers';

/* Examples */
await TestHelpers.typeText(element(by.id('input')), 'text');
await TestHelpers.launchWithUrl('cashlog://transaction?type=income');
await Matchers.expectBalanceToEqual('$100.00');
await Matchers.expectTransactionToExist('Coffee', '-$5.50');
```

## Next Steps After Setup

1. ✅ Run all tests: `npm run test:e2e`
2. ✅ Fix any failing tests
3. ✅ Commit changes
4. ✅ Push and verify CI passes
5. ✅ Add more tests as you add features

## Need Help?

1. Check `e2e/README.md` for detailed documentation
2. Review test examples in `e2e/` folder
3. Check Detox docs: https://wix.github.io/Detox/
4. Open an issue on GitHub

---

**🎉 You're ready to test!**

Start emulator → Run `npm run test:e2e` → Watch tests pass! ✨
