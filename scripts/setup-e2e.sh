#!/bin/bash

# Cashlog E2E Testing Setup Script
# This script installs and configures Detox for E2E testing

set -e  # Exit on error

echo "🚀 Setting up Cashlog E2E Testing Environment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_success "Node.js is installed ($(node --version))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm is installed ($(npm --version))"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    print_warning "Java is not installed. You'll need Java 17 or 21 for Gradle 8.6."
    print_info "Install Java: brew install openjdk@17"
else
    java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$java_version" -ge 17 ]; then
        print_success "Java is installed (version $java_version)"
    else
        print_warning "Java version $java_version is installed, but Java 17+ is recommended."
    fi
fi

# Check if Android SDK is installed
if ! command -v adb &> /dev/null; then
    print_warning "Android SDK is not found. Make sure ANDROID_HOME is set."
    print_info "Set ANDROID_HOME in your ~/.zshrc or ~/.bashrc:"
    print_info "export ANDROID_HOME=\$HOME/Library/Android/sdk"
    print_info "export PATH=\$PATH:\$ANDROID_HOME/emulator:\$ANDROID_HOME/platform-tools"
else
    print_success "Android SDK is installed"
fi

echo ""
echo "📦 Installing dependencies..."

# Install project dependencies
npm install

# Install Detox CLI globally (optional but recommended)
if ! command -v detox &> /dev/null; then
    print_info "Installing Detox CLI globally..."
    npm install -g detox-cli
    print_success "Detox CLI installed"
else
    print_success "Detox CLI is already installed"
fi

echo ""
echo "🔧 Building Android app for testing..."

# Build debug APK
cd android
./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug
cd ..

print_success "Android app built successfully"

echo ""
echo "📱 Checking for Android Emulator..."

# Check if required AVD exists
if command -v emulator &> /dev/null; then
    if emulator -list-avds | grep -q "Pixel_7_API_34"; then
        print_success "Required AVD 'Pixel_7_API_34' exists"
    else
        print_warning "Required AVD 'Pixel_7_API_34' not found"
        print_info "Create it with:"
        print_info "  sdkmanager 'system-images;android-34;google_apis;x86_64'"
        print_info "  avdmanager create avd --name Pixel_7_API_34 \\"
        print_info "    --package 'system-images;android-34;google_apis;x86_64' \\"
        print_info "    --device pixel_7"
        print_info ""
        print_info "Or create it via Android Studio: Tools → Device Manager"
    fi
else
    print_warning "Emulator command not found. Make sure Android SDK is properly configured."
fi

echo ""
echo "🎯 Setup complete!"
echo ""
print_info "Next steps:"
echo "  1. Ensure AVD 'Pixel_7_API_34' exists (see above if missing)"
echo "  2. Add testIDs to components (see e2e/ADDING_TESTIDS.md)"
echo "  3. Start emulator: emulator -avd Pixel_7_API_34"
echo "  4. Run tests: npm run test:e2e"
echo ""
print_info "Documentation:"
echo "  • Full guide: e2e/README.md"
echo "  • TestID guide: e2e/ADDING_TESTIDS.md"
echo ""
print_success "Happy testing! 🎉"
