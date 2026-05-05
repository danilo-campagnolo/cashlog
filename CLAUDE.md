# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                  # Start Metro bundler
npm run android            # Run on Android device/emulator
npm run ios                # Run on iOS device/emulator
npm run lint               # ESLint
npm test                   # Jest unit tests

# E2E (Detox, Android only — requires Pixel_7_API_34 AVD)
npm run test:e2e:build     # Build APK for E2E
npm run test:e2e           # Run E2E tests (debug config)
npm run test:e2e:ci        # Run E2E tests + cleanup (release config)

# Android release builds
npm run build:android      # Release APK via Gradle
npm run build:android:clean # Clean + release APK
```

Node >= 18 required. Java 17 required for Gradle 8.6 (E2E / release builds).

## Architecture

Single-screen React Native app. No navigation library — `App.tsx` is the only screen and owns all state via `useState` hooks.

**Data flow:** `App.tsx` (state) → components (display/input) → `database/database.ts` (SQLite CRUD)

**State in App.tsx:**
- `expenses: Expense[]` — full transaction list, reloaded on mount and app resume
- `editId: number | null` — which transaction is being edited
- `defaultType: 'income' | 'expense'` — preset from deep link (`cashlog://add?type=income`)

**Persistence:** `database/database.ts` — SQLite via `react-native-sqlite-storage`. Singleton connection, never closed. Table: `Expenses (id, description, amount, date, type)`. Includes a runtime migration that adds `type` column for backward compatibility.

**Deep linking:** URL query strings parsed manually — `URLSearchParams` does not work on Hermes. Used by the native Android widget (Kotlin) at `android/app/src/main/java/.../widget/`.

**Theme:** `src/constants/theme.ts` — centralised colors and `getColor()` helper for dark/light mode. Dark mode via `useColorScheme()`.

**Performance:** `FlatList` in `App.tsx` is tuned with `maxToRenderPerBatch`, `windowSize`, and `removeClippedSubviews`. All callbacks and derived values in `App.tsx` are memoised with `useCallback`/`useMemo`.

## E2E Tests

Framework: Detox 20.x + Jest runner. Android only. Target AVD: `Pixel_7_API_34`.

Test files live in `e2e/` and follow the pattern `*.e2e.ts`. The `e2e/helpers.ts` `TestHelpers` class wraps all Detox interactions — use it rather than calling Detox APIs directly.

Detox element selection relies on `testID` props. Required testIDs are documented in `e2e/ADDING_TESTIDS.md`. When adding new UI elements that need to be tested, add a `testID` following the naming conventions in that file.

Run `scripts/setup-e2e.sh` for first-time E2E environment setup.

## Types

`src/types/expense.ts` defines the `Expense` interface — the only domain type. Pass it explicitly; never use plain objects or `any` across the component/database boundary.
