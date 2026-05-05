# E2E Testing Implementation Checklist

Track your progress in implementing the E2E test suite for Cashlog.

## Phase 1: Setup & Installation

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Android Studio installed
- [ ] Android SDK configured (ANDROID_HOME set)
- [ ] Java 17 or 21 installed (verify with `java -version`)
- [ ] Git repository is up to date

### Install Dependencies
- [ ] Run `npm install` to install Detox
- [ ] Install Detox CLI: `npm install -g detox-cli`
- [ ] Verify installation: `detox --version`

### Android Emulator Setup
- [ ] Create AVD named exactly `Pixel_7_API_34`
- [ ] AVD uses API Level 34 (Android 14)
- [ ] AVD uses Pixel 7 device profile
- [ ] AVD uses Google APIs (not AOSP)
- [ ] Test emulator starts: `emulator -avd Pixel_7_API_34`

## Phase 2: Add TestIDs to Components

### App.tsx
- [ ] Add `testID="app-title"` to main title Text
- [ ] Add `testID="transaction-list"` to FlatList

### BalanceCard.tsx
- [ ] Add `testID="balance-card"` to container View
- [ ] Add `testID="balance-amount"` to balance Text
- [ ] Add `testID="income-amount"` to income Text
- [ ] Add `testID="expense-amount"` to expense Text

### ExpenseForm.tsx
- [ ] Add `testID="expense-form"` to container View
- [ ] Add `testID="toggle-expense"` to expense TouchableOpacity
- [ ] Add `testID="toggle-income"` to income TouchableOpacity
- [ ] Add `testID="input-description"` to description TextInput
- [ ] Add `testID="input-amount"` to amount TextInput
- [ ] Add `testID="button-add-transaction"` to submit button

### ExpenseItem.tsx
- [ ] Add `testID={`transaction-item-${id}`}` to container View
- [ ] Add edit button testID (if exists)
- [ ] Add delete button testID (if exists)

### CustomButton.tsx
- [ ] Add `testID?: string` to props interface
- [ ] Pass testID prop to TouchableOpacity
- [ ] Update all CustomButton usages to accept testID

### Transaction Details Modal (if exists)
- [ ] Add `testID="transaction-details-modal"` to Modal
- [ ] Add `testID="button-edit-transaction"` to edit button
- [ ] Add `testID="button-delete-transaction"` to delete button
- [ ] Add `testID="button-cancel-edit"` to cancel button

## Phase 3: Build & Initial Test

### Build Test App
- [ ] Run `npm run test:e2e:build`
- [ ] Verify APKs are created in `android/app/build/outputs/apk/`
- [ ] No build errors occur

### Run First Test
- [ ] Start emulator: `emulator -avd Pixel_7_API_34`
- [ ] Run single test: `npm run test:e2e -- e2e/transactionCreation.e2e.ts`
- [ ] Verify test launches app on emulator
- [ ] Fix any "Element not found" errors by adding missing testIDs

## Phase 4: Test Suite Validation

### Transaction Creation Tests
- [ ] Run: `npm run test:e2e -- e2e/transactionCreation.e2e.ts`
- [ ] All 8 tests pass
- [ ] No timeout errors
- [ ] Screenshot artifacts saved on failures

### Transaction Management Tests
- [ ] Run: `npm run test:e2e -- e2e/transactionManagement.e2e.ts`
- [ ] All 7 tests pass
- [ ] Edit operations work correctly
- [ ] Delete operations work correctly

### Database Persistence Tests
- [ ] Run: `npm run test:e2e -- e2e/databasePersistence.e2e.ts`
- [ ] All 6 tests pass
- [ ] Data persists after reload
- [ ] Background/resume works

### Widget Deep Linking Tests
- [ ] Run: `npm run test:e2e -- e2e/widgetDeepLinking.e2e.ts`
- [ ] All 8 tests pass
- [ ] Deep links open correctly
- [ ] Type is maintained

### Performance Tests
- [ ] Run: `npm run test:e2e -- e2e/performance.e2e.ts`
- [ ] All 7 tests pass
- [ ] Performance thresholds met
- [ ] No memory issues

### Full Suite
- [ ] Run: `npm run test:e2e`
- [ ] All 36 tests pass
- [ ] Total time under 20 minutes
- [ ] No flaky tests

## Phase 5: CI/CD Integration

### GitHub Actions Setup
- [ ] Workflow file exists: `.github/workflows/e2e-tests.yml`
- [ ] Workflow is enabled
- [ ] Required secrets are set (if any)

### First CI Run
- [ ] Push changes to branch
- [ ] CI workflow triggers
- [ ] Emulator starts successfully
- [ ] Tests run on CI
- [ ] All tests pass
- [ ] Artifacts uploaded on success

### CI Verification
- [ ] Tests pass on `main` branch
- [ ] Tests pass on `develop` branch
- [ ] Tests pass on pull requests
- [ ] Test duration is reasonable (< 60 min)

## Phase 6: Documentation Review

### Read Documentation
- [ ] Read `e2e/README.md` fully
- [ ] Read `e2e/ADDING_TESTIDS.md`
- [ ] Read `QUICKSTART_E2E.md`
- [ ] Read `E2E_TEST_SUITE_SUMMARY.md`

### Update Project README
- [ ] Add E2E testing section to main README.md
- [ ] Link to test documentation
- [ ] Add CI badge for E2E tests
- [ ] Document test commands

## Phase 7: Team Onboarding

### Share with Team
- [ ] Demonstrate running tests locally
- [ ] Show CI integration
- [ ] Explain testID conventions
- [ ] Share documentation links

### Team Training
- [ ] Show how to run specific test suites
- [ ] Demonstrate debugging failing tests
- [ ] Explain helper utilities usage
- [ ] Show how to add new tests

## Phase 8: Maintenance Setup

### Regular Checks
- [ ] Schedule weekly test runs
- [ ] Monitor CI test duration
- [ ] Review test coverage
- [ ] Update performance benchmarks

### Future Improvements
- [ ] Plan for iOS testing (optional)
- [ ] Consider visual regression testing
- [ ] Add integration with test reporting tools
- [ ] Set up test result dashboards

## Troubleshooting Completed

Document any issues you encountered and how you solved them:

### Issue 1:
**Problem**: _______________________________
**Solution**: _______________________________

### Issue 2:
**Problem**: _______________________________
**Solution**: _______________________________

### Issue 3:
**Problem**: _______________________________
**Solution**: _______________________________

## Verification Checklist

Final verification before marking as complete:

- [ ] All 36 tests pass locally
- [ ] All tests pass on CI
- [ ] No flaky tests (run 3 times to verify)
- [ ] Documentation is accurate
- [ ] Team is trained
- [ ] TestIDs are consistent
- [ ] Performance benchmarks met
- [ ] No security issues introduced
- [ ] Code review completed
- [ ] Changes merged to main

## Notes

Add any additional notes, observations, or recommendations:

---
---
---

## Completion Status

**Start Date**: _____________
**Completion Date**: _____________
**Total Time**: _____________

**Completed by**: _____________

**Sign-off**: ☐ Developer  ☐ QA  ☐ Team Lead

---

🎉 **Congratulations on implementing comprehensive E2E testing for Cashlog!**
