# Cashlog

A simple and elegant expense tracker app built with React Native. Track your income and expenses with ease, view your balance at a glance, and quickly add transactions via the home screen widget.

## Features

- **Track Income & Expenses** - Easily log your financial transactions with description and amount
- **Balance Overview** - View your total balance, income, and expenses in a beautiful card interface
- **Dark Mode Support** - Automatic theme switching based on system preferences
- **Home Screen Widget** - Quickly add expenses or income directly from your Android home screen without opening the app
- **Deep Linking** - Widget buttons open the app with the transaction type pre-selected
- **Offline First** - All data is stored locally using SQLite, no internet connection required
- **Optimized Performance** - Built with performance in mind using React memoization and efficient database queries

## Screenshots

<!-- Add screenshots here -->

## Requirements

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 17

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cashlog.git
cd cashlog
```

2. Install dependencies:

```bash
npm install
```

3. Install iOS dependencies (macOS only):

```bash
cd ios && pod install && cd ..
```

4. Start the Metro bundler:

```bash
npm start
```

5. Run the app:

```bash
# Android
npm run android

# iOS
npm run ios
```

## Usage

### Adding a Transaction

1. Open the app
2. Select transaction type (Expense or Income)
3. Enter a description
4. Enter the amount
5. Tap "Add Transaction"

### Using the Widget (Android)

1. Long press on your home screen
2. Select "Widgets"
3. Find "Cashlog" and drag it to your home screen
4. Tap the red button to add an expense or the green button to add income
5. The app will open with the transaction type pre-selected

### Deleting a Transaction

Tap the "Delete" button next to any transaction in the list to remove it.

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **SQLite** - Local database storage
- **Android Widget** - Native Android widget using Kotlin

## Project Structure

```
cashlog/
├── android/                 # Android native code
│   └── app/src/main/
│       ├── java/.../widget/ # Widget implementation
│       └── res/             # Android resources
├── database/                # Database layer
│   └── database.ts          # SQLite operations
├── src/
│   ├── components/          # React components
│   │   ├── BalanceCard.tsx
│   │   ├── CustomButton.tsx
│   │   ├── ExpenseForm.tsx
│   │   └── ExpenseItem.tsx
│   └── types/               # TypeScript types
│       └── expense.ts
├── App.tsx                  # Main app component
└── package.json
```

## Building a Release

To build a release APK:

```bash
npm run build:android
```

Or with a clean build:

```bash
npm run build:android:clean
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/cashlog-{version}.apk
```

For example, version 0.0.1 will produce `cashlog-0.0.1.apk`.

### Versioning

The app version is managed in `package.json`. To release a new version:

1. Update the `version` field in `package.json`
2. Run the build command
3. The APK will be automatically named with the new version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
