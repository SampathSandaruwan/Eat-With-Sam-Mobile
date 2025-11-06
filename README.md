# EatWithSam Mobile

A React Native mobile application for food ordering and delivery, built with TypeScript and modern React Native tooling.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Additional Resources](#additional-resources)

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

- **Node.js**: Version 20 or higher (see `package.json` engines field)
- **npm** or **yarn**: Package manager
- **Ruby**: Version 2.6.10 or higher (for CocoaPods on iOS)
- **React Native CLI**: Follow the [official React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment)

### Platform-Specific Requirements

#### iOS Development (macOS only)

- **Xcode**: Latest stable version
- **CocoaPods**: Managed via Gemfile (installed automatically)
- **iOS Simulator**: Included with Xcode

#### Android Development

- **Java Development Kit (JDK)**: Version 17 or higher
- **Android Studio**: Latest stable version
- **Android SDK**: Installed via Android Studio
- **Android Emulator**: Configured in Android Studio

> **Note**: For detailed environment setup instructions, refer to the [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment).

## Project Setup

### 1. Clone the Repository

```sh
git clone <repository-url>
cd Eat-With-Sam-Mobile
```

### 2. Install Dependencies

Install JavaScript/TypeScript dependencies:

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

### 3. Install iOS Dependencies (iOS only)

If you plan to develop for iOS, install CocoaPods dependencies:

```sh
# Install Ruby gems (first time only)
bundle install

# Install CocoaPods dependencies
cd ios && bundle exec pod install && cd ..
```

> **Note**: Run `bundle exec pod install` whenever you update native dependencies or add new pods.

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```sh
cp .env.example .env  # If an example file exists
# OR create .env manually
```

Required environment variables:

```env
API_URL=your_backend_api_url
RETRY_ATTEMPTS=3
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
```

**Environment Variables Reference:**

- `API_URL`: Backend API base URL (e.g., `https://api.example.com`)
- `RETRY_ATTEMPTS`: Number of retry attempts for failed API requests (default: 3)
- `GOOGLE_WEB_CLIENT_ID`: Google OAuth 2.0 Web Client ID (for Google Sign-In)
- `GOOGLE_IOS_CLIENT_ID`: Google OAuth 2.0 iOS Client ID (for Google Sign-In)

> **Note**: For detailed Google Sign-In setup instructions, see [Google Sign-In Setup Guide](./documentation/Google-SignIn-Setup.md).

## Environment Configuration

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`. Import paths are resolved automatically:

- `@components` → `src/components`
- `@constants` → `src/constants`
- `@contexts` → `src/contexts`
- `@hooks` → `src/hooks`
- `@lib` → `src/lib`
- `@navigation` → `src/navigation`
- `@screens` → `src/screens`
- `@services` → `src/services`
- `@store` → `src/store`
- `@theme` → `src/theme`
- `@types` → `src/types`
- `@utils` → `src/utils`

Example usage:

```typescript
import { Button } from '@components';
import { useRestaurants } from '@hooks';
import { authStore } from '@store';
```

## Running the Application

### Start Metro Bundler

Start the Metro JavaScript bundler in one terminal:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Run on iOS

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

This command:
- Starts Metro bundler (if not already running)
- Builds the iOS app
- Launches the app in the iOS Simulator (iPhone 16 Pro by default)

**Alternative**: Open `ios/EatWithSam.xcworkspace` in Xcode and run from there.

### Run on Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

This command:
- Starts Metro bundler (if not already running)
- Builds the Android app
- Launches the app on an Android emulator or connected device

**Prerequisites**: Ensure an Android emulator is running or a device is connected via USB with USB debugging enabled.

**Alternative**: Open the `android` folder in Android Studio and run from there.

## Development Workflow

### Available Scripts

```sh
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run tests
npm test
```

### Hot Reloading

The app supports Fast Refresh for instant updates during development:

- **Save changes**: React components automatically update
- **Full reload**:
  - **Android**: Press <kbd>R</kbd> twice or <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) / <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) → Select "Reload"
  - **iOS**: Press <kbd>R</kbd> in iOS Simulator

### TypeScript Path Aliases

The project uses `babel-plugin-module-resolver` and TypeScript path aliases for cleaner imports. All aliases are configured in:
- `tsconfig.json` (TypeScript)
- `babel.config.js` (Babel/JavaScript)

### Testing

Run the test suite:

```sh
npm test
```

## Additional Resources

### Project Documentation

- **[Documentation Folder](./documentation/README.md)**: Comprehensive project documentation, implementation plans, and guidelines
- **[Google Sign-In Setup](./documentation/Google-SignIn-Setup.md)**: Detailed guide for configuring Google authentication

### Tech Stack

- **Framework**: React Native 0.82.1 (CLI)
- **Language**: TypeScript 5.8.3
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query 5.90.6 + Axios 1.13.1
- **Navigation**: React Navigation 7.x
- **Testing**: Jest 29.6.3

### External Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [React Native Integration Guide](https://reactnative.dev/docs/integration-with-existing-apps)
