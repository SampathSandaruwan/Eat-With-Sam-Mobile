# EatWithSam Mobile - Comprehensive Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for the EatWithSam mobile application, organized into three main modules to support incremental commits and module-by-module development.

**Implementation Order:**
1. **Module 1: Menu & Order** (Frontend + Backend APIs)
2. **Module 2: Authentication** (Frontend + Backend APIs)
3. **Module 3: Reporting** (Backend APIs)

---

## ✅ Currently Completed

The following components and features are already implemented:

### Infrastructure & Setup
- ✅ **API Client**: Axios client with interceptors and automatic token injection (`src/lib/api-client.ts`)
- ✅ **TanStack Query**: QueryClient configured with retry and exponential backoff (`src/lib/query-client.ts`)
- ✅ **Environment Config**: react-native-dotenv setup for API configuration
- ✅ **Service Layer**: 
  - Menu API service functions (`src/services/menu.ts`)
  - Restaurant API service functions (`src/services/restaurants.ts`)
  - Auth API service functions (`src/services/auth.ts` - login, signup, refreshAccessToken, logout)
- ✅ **State Management**: 
  - Zustand store with persistence (`src/store/cart-store.ts`)
  - Auth store with Zustand and secure token storage (`src/store/auth-store.ts`)
- ✅ **Contexts**: 
  - Drawer context for global drawer state management (`src/contexts/drawer-context.tsx`)
- ✅ **Token Storage**: Secure token storage using react-native-keychain (`src/lib/token-storage.ts`)
- ✅ **Custom Hooks**: 
  - `useMenuCategories` - Menu categories hook
  - `useMenuItems` - Menu items hook  
  - `useMenuItem` - Single menu item hook
  - `useRestaurant` - Single restaurant hook
  - `useRestaurants` - Restaurants list hook

### UI Components
- ✅ **Menu Screen**: Fully integrated with API (`src/screens/Menu/index.tsx`)
  - Menu categories with bidirectional scroll synchronization
  - Auto-scrolling category tabs with ref-based control
  - Optimized FlatList rendering with getItemLayout and measured heights
  - Top-rated items section
  - Discounted items section with promotional text
  - Category-wise menu items display with centralized layout constants
- ✅ **Cart Screen**: Complete cart UI with item list, quantity controls, and summary (`src/screens/Cart/index.tsx`)
  - Dynamic fee calculation using restaurant properties (deliveryFee, taxRate)
  - Service fee calculated as 5% of subtotal
  - Rider tip section with improved UI
  - "People also added" section with top-rated items
  - Enhanced layout and styling
- ✅ **Menu Item Card Components**: 
  - `CategoryWiseMenuItemCard` - Horizontal card for category listings (`src/screens/Menu/sections/CategoryWiseMenuItemCard.tsx`)
  - `DiscountedMenuItemCard` - Vertical card for discounted items (`src/screens/Menu/sections/DiscountedMenuItemCard.tsx`)
  - `TopRatedMenuItemCard` - Vertical card for top-rated items (`src/screens/Menu/sections/TopRatedMenuItemCard.tsx` and `src/screens/Cart/Sections/TopRatedMenuItemCard.tsx`)
- ✅ **Menu Components**: 
  - CategoryTabs component with auto-scroll functionality and ref support (`src/screens/Menu/sections/CategoryTabs.tsx`)
  - TopNavBar component (`src/components/TopNavBar.tsx`) - moved to shared components
  - RestaurantInfo component (`src/screens/Menu/sections/RestaurantInfo.tsx`)
  - SelectedMenuItem component (`src/screens/Menu/sections/SelectedMenuItem.tsx`)
- ✅ **Menu Item Modal**: Full-screen modal with item details, image, price, rating, tags, availability, and add to cart functionality
- ✅ **UI Components**: 
  - Text component (`src/components/Text.tsx`)
  - Icon component (`src/components/Icon.tsx`) using Phosphor icons with Icon suffix
  - FloatingActionButton component (`src/components/FloatingActionButton.tsx`)
  - RightDrawer component (`src/components/RightDrawer.tsx`) - slide-out drawer for authenticated user menu
- ✅ **Theme System**: 
  - Basic color palette (`src/theme/colors.ts`)
  - Layout constants (`src/theme/layout.ts`) - including TOP_NAV_HEIGHT, TOP_CATEGORY_HEADER_HEIGHT, CATEGORY_WISE_MENU_ITEM_CARD_HEIGHT, CATEGORY_WISE_MENU_ITEM_CARD_MARGIN_VERTICAL
  - Shadow utilities for card components

### Types & Data
- ✅ **Type Definitions**: 
  - Menu types (`src/types/menu.types.ts` - MenuCategory, MenuItem)
  - Restaurant types (`src/types/restaurant.types.ts`)
  - Cart types (`src/types/cart.types.ts` - CartItem, CartSummary with serviceFee)
  - Auth types (`src/types/auth.types.ts` - UserResponse, LoginRequest, AuthResponse, TokenPair, etc.)
  - Environment variable types (`src/types/env.d.ts`)

### Features
- ✅ **Loading States**: ActivityIndicator for main item and selected item
- ✅ **Restaurant Info**: Fetched from API via useRestaurant hook, displayed in RestaurantInfo component
- ✅ **Category Navigation**: Category tabs with sticky animation on scroll
- ✅ **Shopping Cart**: 
  - Cart state management with Zustand and AsyncStorage persistence
  - Cart screen with item list, quantity controls, and summary calculations
  - Dynamic fee calculation using restaurant properties (deliveryFee, taxRate)
  - Service fee calculated as 5% of subtotal (configurable percentage)
  - FloatingActionButton with dynamic item count badge
  - Add to cart functionality integrated in SelectedMenuItem modal
  - Cart integration in Menu screen
  - "People also added" section with top-rated menu items
  - Enhanced cart UI with improved tip section and layout
- ✅ **Utilities**: 
  - Delivery time calculation utility (`src/utils/calculate-delivery-time.ts`)
  - Currency formatting utility (`src/utils/format-currency.ts`) - formats numbers as UK currency (£)
- ✅ **Constants**: 
  - Promotional text constants (`src/constants/promotions.ts`)
  - Dietary tag validation constants (`src/constants/dietary.ts`)
  - Constants exported via barrel file (`src/constants/index.ts`)
- ✅ **Assets**: 
  - Logo image (`src/assets/images/Logo.png`)
  - FoodItemsPlaceholder SVG component (`src/assets/images/FoodItemsPlaceholder.tsx`)
- ✅ **App Branding**: App icons, bundle IDs, and splash screen configured
- ✅ **Network Security**: Android network security configuration for API access

### Authentication Features
- ✅ **Auth API Integration**: Complete authentication service with login, signup, token refresh, and logout endpoints
- ✅ **Secure Token Storage**: Token storage using react-native-keychain for iOS Keychain and Android EncryptedSharedPreferences
- ✅ **Auth State Management**: Zustand auth store with login, signup, logout, token refresh, and session initialization
- ✅ **Login Modal**: Complete login screen with email/password validation, error handling, and loading states (`src/screens/Auth/LoginModal.tsx`)
- ✅ **Signup Modal**: Complete signup screen with comprehensive form validation, password policy, and terms acceptance (`src/screens/Auth/SignupModal.tsx`)
- ✅ **Auth UI Integration**: Login and signup modals integrated into App.tsx with navigation between auth screens
- ✅ **User Menu**: RightDrawer component for authenticated user menu with logout functionality
- ✅ **API Token Interceptor**: Automatic token injection in API client request interceptor
- ✅ **Cart Integration**: Cart cleared on logout

**Next Steps**: 
- Implement session persistence and auto-refresh on app startup
- Add route protection (if navigation structure is added)
- Add social login integration (Google, Apple)
- Add error state handling with retry buttons
- Implement network awareness and offline indicators
- Complete order placement API integration
- Add order history and status tracking
- Implement navigation structure (if needed)
- Add dark mode theme support

---

## Module 1: Menu & Order

> **Status Note**: Phase 1.4 (Shopping Cart & Order Management) - Steps 1.4.1 and 1.4.2 are completed with enhancements. Cart functionality with Zustand state management and UI components are fully implemented. Cart now uses dynamic fee calculation from restaurant properties, service fee calculation (5% of subtotal), and improved UI. Code quality improvements include extracted utilities (formatCurrency), constants (promotions, dietary tags), and standardized imports. Multiple menu item card components implemented (CategoryWiseMenuItemCard, DiscountedMenuItemCard, TopRatedMenuItemCard). Category navigation with bidirectional scroll synchronization implemented. Remaining work: Order Placement API (Phase 1.4.3), Order History (Phase 1.4.4), Error Handling (Phase 1.5), and Testing (Phase 1.6). Ready to proceed with Module 2: Authentication.

### Phase 1.1: Foundation Setup (Tech Stack)

#### Step 1.1.1: Install Core Dependencies
- [x] Install Zustand for state management: `npm install zustand` ✅
- [x] Install TanStack Query (React Query): `npm install @tanstack/react-query` ✅
- [x] Install Axios: `npm install axios` ✅
- [x] Install react-native-dotenv: `npm install react-native-dotenv` ✅
- [ ] Install Expo Router OR React Navigation (based on preference):
  - Option A: `npx expo install expo-router` (Expo Router)
  - Option B: `npm install @react-navigation/native @react-navigation/native-stack` (React Navigation)
- [x] Install React Native AsyncStorage: `npm install @react-native-async-storage/async-storage` ✅
- [ ] Install Network info library: `npm install @react-native-community/netinfo`

**Commit**: `feat(setup): :package: add core dependencies (zustand, tanstack-query, axios, navigation)` *(Partially completed - Zustand, TanStack Query, Axios, dotenv, AsyncStorage installed)*

#### Step 1.1.2: Configure TanStack Query Provider
- [x] Create `src/lib/query-client.ts` - Setup QueryClient with retry and caching config ✅
- [x] Wrap App with QueryClientProvider in `App.tsx` ✅
- [x] Configure default retry logic with exponential backoff ✅

**Commit**: `feat(setup): :sparkles: configure TanStack Query with retry and caching` *(Completed)*

#### Step 1.1.3: Setup API Client Infrastructure
- [x] Create `src/lib/api-client.ts` - Axios instance with base URL and interceptors ✅
- [x] Create `src/lib/index.ts` - Export barrel file ✅
- [x] Environment-based API configuration (using react-native-dotenv) ✅
- [x] Setup response interceptors for error handling ✅
- [x] Implement timeout configuration (5000ms) ✅
- [x] Create `src/types/env.d.ts` - Type definitions for environment variables ✅

**Commit**: `feat(api): :sparkles: setup axios client with interceptors and error handling` *(Completed)*

#### Step 1.1.4: Setup Navigation Structure
- [ ] If using Expo Router: Setup app directory structure (`app/` or `src/app/`)
- [ ] If using React Navigation: Create navigation stack and types
- [ ] Define route types and navigation helpers
- [ ] Create placeholder screens: Menu, Order, Cart, Profile (if needed later)

**Commit**: `feat(navigation): :sparkles: setup navigation structure`

---

### Phase 1.2: Theme & UI Foundation

> **Status Note**: Basic theme colors, Text component, Icon component, and layout constants are already implemented. Dark mode and IBM Plex Sans font still need to be added.

#### Step 1.2.1: Enhanced Theme System with Dark Mode
- [ ] Install Zustand for theme state: Create `src/store/theme-store.ts`
- [ ] Extend `src/theme/colors.ts` with dark mode color palette
- [ ] Create `src/theme/dark-colors.ts` - Dark mode color definitions
- [ ] Update theme index to export theme based on mode
- [ ] Add theme provider/hook to access theme state

**Commit**: `feat(theme): :art: implement dark/light mode theme system`

#### Step 1.2.2: Typography Setup (IBM Plex Sans)
- [ ] Download and add IBM Plex Sans font files to `src/assets/fonts/`
- [ ] Configure font loading in app (link fonts)
- [x] `Text` component created (`src/components/Text.tsx`) - currently uses system fonts, needs font family update
- [ ] Update `Text` component to support custom font family (IBM Plex Sans)
- [ ] Create typography scale constants in `src/theme/typography.ts`
- [ ] Test font rendering on iOS and Android

**Commit**: `feat(ui): :sparkles: add IBM Plex Sans font and typography system` *(Partially completed - Text component exists)*

#### Step 1.2.3: App Branding Setup
- [x] Update app icons (if not already done)
- [x] Configure bundle IDs (iOS/Android)
- [x] Setup splash screen (already exists, verify it's correct)
- [x] Verify app name and display name
- [x] Logo image asset created (`src/assets/images/Logo.png`)

**Commit**: `feat(branding): :sparkles: finalize app icons, bundle IDs, and splash screen` *(Already completed)*

---

### Phase 1.3: Menu Screen Enhancement (Deliveroo-like UX)

> **Status Note**: Basic menu screen with sample data, MenuItemCard, CategoryTabs, TopNavBar components, and restaurant information section are already implemented. Remaining work focuses on API integration, network awareness, and enhancements.

#### Step 1.3.1: Network State & Offline Awareness
- [ ] Create `src/hooks/useNetworkStatus.ts` - Network connectivity hook
- [ ] Create `src/components/NetworkStatus.tsx` - Offline indicator component
- [ ] Add network status banner to Menu screen
- [ ] Implement network-aware query configuration

**Commit**: `feat(menu): :sparkles: add network status detection and offline indicators`

#### Step 1.3.2: Menu Data Integration (Backend API)
- [x] Create `src/services/menu.ts` - Menu API service functions ✅
- [x] Create `src/services/index.ts` - Service exports ✅
- [x] Define `src/types/menu.types.ts` - Basic menu types already exist (MenuCategory, MenuItem) ✅
- [x] Create `src/types/restaurant.types.ts` - Restaurant type definitions ✅
- [x] Create `src/hooks/use-menu-categories.ts` - Custom hook for menu categories ✅
- [x] Create `src/hooks/use-menu-items.ts` - Custom hooks for menu items (useMenuItems, useMenuItem) ✅
- [x] Create `src/hooks/index.ts` - Hook exports ✅
- [x] Update Menu screen to fetch from API instead of sample data ✅
- [x] Add loading state UI (ActivityIndicator for main item and selected item) ✅
- [x] Implement multiple menu item card components:
  - CategoryWiseMenuItemCard for category listings ✅
  - DiscountedMenuItemCard for discounted items ✅
  - TopRatedMenuItemCard for top-rated items ✅
- [x] Add top-rated items section with horizontal scrolling ✅
- [x] Add discounted items section with promotional text ✅
- [x] Extract constants for promotional text ✅
- [ ] Add error state UI with retry button (loading states present, error states need implementation)

**Commit**: `feat(menu): :sparkles: integrate menu data fetching with backend API` *(Partially completed - API integration, loading states, and multiple card components done, error states pending)*

#### Step 1.3.3: Menu Item Modal/Popup
- [x] Create menu item modal (implemented in Menu screen) - React Native Modal component ✅
- [x] Design modal with:
  - [x] Item image display ✅
  - [x] Full description and details ✅
  - [x] Price and nutritional info (kcal, price, rating) ✅
  - [x] Tags display ✅
  - [x] Availability status ✅
  - [ ] Customization options (if applicable) - Not implemented
  - [x] Add to cart button with quantity selector - Implemented with cart store integration ✅
- [x] Integrate modal with MenuItemCard click handler (`onPress` prop) ✅
- [x] Add smooth animations for modal open/close (slide animation) ✅
- [x] Modal loading state with ActivityIndicator ✅

**Commit**: `feat(menu): :sparkles: implement menu item detail modal with interactions` *(Completed - Modal UI and cart integration done)*

#### Step 1.3.4: Enhanced Menu Scrolling & Category Navigation
- [x] Basic sticky category tabs animation implemented (with opacity interpolation on scroll) ✅
- [x] CategoryTabs component updated to work with API data (number IDs, category.name) ✅
- [x] MenuItemCard component updated with Pressable and onPress handler ✅
- [x] FlatList implementation with proper keyExtractor and renderItem ✅
- [x] Implement scroll-to-category functionality (category tabs click scrolls to section) ✅
- [x] Add category section detection during scroll (syncs active category based on scroll position) ✅
- [x] Ensure category tabs sync with scroll position (bidirectional sync implemented) ✅
- [x] Auto-scroll category tabs when active category changes (via ref-based control) ✅
- [x] Optimize FlatList performance with getItemLayout using measured heights ✅
- [x] Extract layout constants to theme for consistent spacing and calculations ✅
- [ ] Improve sticky category tabs animation (refine scroll thresholds - currently hardcoded)

**Commit**: `feat(menu): :sparkles: enhance category navigation and scroll synchronization` *(Completed - scroll-to-category, bidirectional sync, auto-scroll tabs, and FlatList optimization implemented)*

#### Step 1.3.5: Restaurant Information Section
- [x] Restaurant header implemented with:
  - [x] Restaurant image/banner (using `mainMenuItem?.imageUri`) ✅
  - [x] Restaurant name (using `mainMenuItem?.name` from API) ✅
  - [x] Price display (using `mainMenuItem?.price` from API) ✅
  - [x] Rating, delivery time, minimum order (shown in pills - currently hardcoded values) ✅
  - [x] Back button with smooth interaction (round back button in ListHeaderComponent) ✅
- [x] Restaurant info fetched from API via `useRestaurant` hook ✅
- [x] Loading state for restaurant info (ActivityIndicator) ✅
- [x] Restaurant info section styled and responsive ✅
- [x] Restaurant info uses API data (name, description, cuisineType, deliveryTime, minimumOrder, deliveryFee, averageRating, ratingCount) ✅
- [ ] Add distance calculation (requires user location) - Future enhancement

**Commit**: `feat(menu): :sparkles: enhance restaurant information section` *(Completed - API integration done, RestaurantInfo component fully functional)*

---

### Phase 1.4: Shopping Cart & Order Management

#### Step 1.4.1: Cart State Management (Zustand)
- [x] Create `src/store/cart-store.ts` - Zustand store for cart state ✅
- [x] Define cart item type: `src/types/cart.types.ts` ✅
- [x] Implement cart actions:
  - Add item ✅
  - Remove item ✅
  - Update quantity ✅
  - Clear cart ✅
  - Calculate totals (subtotal, tax, delivery fee, total) ✅
  - Get item quantity ✅
  - Get total items count ✅
- [x] Add cart persistence to AsyncStorage ✅

**Commit**: `feat(cart): :sparkles: implement cart state management with Zustand` *(Completed)*

#### Step 1.4.2: Cart UI Components
- [x] Create `src/components/FloatingActionButton.tsx` - Floating cart button with badge ✅
- [x] Create `src/screens/Cart/index.tsx` - Cart screen ✅
- [x] Design cart item list with quantity controls ✅
- [x] Add cart summary (subtotal, fees, tax, total) ✅
- [x] Create checkout button (placeholder for now) ✅
- [x] Add empty cart state UI ✅
- [x] Integrate cart button in Menu screen ✅
- [x] Add cart modal integration in Menu screen ✅
- [x] Implement dynamic fee calculation using restaurant properties ✅
- [x] Add service fee calculation (5% of subtotal) ✅
- [x] Enhance cart UI with improved tip section and layout ✅
- [x] Add "People also added" section with top-rated items ✅
- [x] Extract price formatting to utility function ✅
- [x] Extract constants for promotional text and dietary tags ✅

**Commit**: `feat(cart): :sparkles: implement cart UI components and screen` *(Completed with enhancements)*

#### Step 1.4.3: Order Placement API Integration
- [ ] Create `src/api/orders.ts` - Order API endpoints
- [ ] Define order types: `src/types/order.types.ts`
- [ ] Create `src/hooks/useOrders.ts` - Order mutations and queries
- [ ] Implement order placement mutation with:
  - Optimistic updates
  - Error handling
  - Retry logic
- [ ] Add order confirmation screen

**Commit**: `feat(orders): :sparkles: implement order placement API integration`

#### Step 1.4.4: Order History & Status
- [ ] Create `src/screens/Orders/index.tsx` - Order history screen
- [ ] Create order status types and components
- [ ] Fetch order list from API
- [ ] Design order card component with status indicators
- [ ] Add pull-to-refresh functionality

**Commit**: `feat(orders): :sparkles: implement order history and status tracking`

---

### Phase 1.5: Error Handling & Loading States

#### Step 1.5.1: Global Error Boundary
- [ ] Create `src/components/ErrorBoundary.tsx` - React Error Boundary
- [ ] Create `src/components/ErrorScreen.tsx` - Error fallback UI
- [ ] Wrap app with ErrorBoundary

**Commit**: `feat(error-handling): :sparkles: add global error boundary`

#### Step 1.5.2: Loading & Error States
- [ ] Create `src/components/LoadingSpinner.tsx`
- [ ] Create `src/components/ErrorState.tsx` - Reusable error component with retry
- [ ] Create `src/components/EmptyState.tsx` - Empty state component
- [x] Basic UI components exist (`Text`, `Icon`) - can be used in error/loading states
- [ ] Apply loading/error/empty states throughout Menu and Order screens

**Commit**: `feat(ui): :sparkles: implement comprehensive loading, error, and empty states`

#### Step 1.5.3: Network Error Handling
- [ ] Enhance API client with specific network error detection
- [ ] Create user-friendly error messages for:
  - Network timeouts
  - Connection errors
  - Server errors (5xx)
  - Client errors (4xx)
- [ ] Add retry mechanisms with exponential backoff for critical operations
- [ ] Show appropriate error messages in UI

**Commit**: `feat(error-handling): :sparkles: enhance network error handling with retry logic`

---

### Phase 1.6: Testing & Quality

#### Step 1.6.1: Unit Tests for Cart Store
- [ ] Write tests for cart store actions (add, remove, update, clear)
- [ ] Test cart calculations (totals, subtotals)
- [ ] Test cart persistence

**Commit**: `test(cart): :white_check_mark: add unit tests for cart store`

#### Step 1.6.2: Component Tests
- [ ] Test MenuItemCard component (component exists at `src/screens/Menu/components/MenuItemCard.tsx`)
- [ ] Test CategoryTabs component (component exists at `src/screens/Menu/components/CategoryTabs.tsx`)
- [ ] Test TopNavBar component (component exists at `src/screens/Menu/components/TopNavBar.tsx`)
- [ ] Test Cart components (not yet created)
- [ ] Test ErrorState and LoadingSpinner components (not yet created)

**Commit**: `test(components): :white_check_mark: add component tests`

#### Step 1.6.3: Integration Tests
- [ ] Test menu data fetching flow
- [ ] Test cart add-to-cart flow
- [ ] Test order placement flow (mock API)

**Commit**: `test(integration): :white_check_mark: add integration tests for menu and order flows`

---

## Module 2: Authentication

> **Status Note**: Phase 2.1 (Authentication Backend Integration) and Phase 2.2 (Authentication UI) are completed. Login and signup modals with form validation are fully implemented. Auth state management with secure token storage is complete. RightDrawer component for authenticated user menu is integrated. Remaining work: Session persistence on app startup (Phase 2.3.2), Route protection (Phase 2.3.1), Social login (Phase 2.2.3), and Testing (Phase 2.5).

### Phase 2.1: Authentication Backend Integration

#### Step 2.1.1: Auth API Client Setup
- [x] Create `src/services/auth.ts` - Authentication API endpoints ✅
- [x] Define auth types: `src/types/auth.types.ts` ✅
  - [x] Login request/response ✅
  - [x] Signup request/response ✅
  - [x] Token types (access, refresh) ✅
  - [x] User profile type ✅
- [x] Implement login endpoint ✅
- [x] Implement signup endpoint ✅
- [x] Implement refresh token endpoint ✅
- [x] Implement logout endpoint ✅

**Commit**: `feat(auth): :sparkles: setup authentication API client` *(Completed)*

#### Step 2.1.2: Token Management
- [x] Create `src/lib/token-storage.ts` - Secure token storage utilities ✅
- [x] Install and setup secure storage:
  - [x] iOS: Keychain ✅
  - [x] Android: EncryptedSharedPreferences ✅
  - [x] Use `react-native-keychain` ✅
- [x] Implement token storage/retrieval functions ✅
- [x] Create token refresh interceptor in axios client ✅
- [x] Implement automatic token injection in request interceptor ✅
- [ ] Implement automatic token rotation on refresh (refresh logic exists, auto-rotation pending)

**Commit**: `feat(auth): :sparkles: implement secure token storage and refresh mechanism` *(Partially completed - token storage and injection done, auto-refresh on 401 pending)*

#### Step 2.1.3: Auth State Management (Zustand)
- [x] Create `src/store/auth-store.ts` - Authentication state store ✅
- [x] Implement auth state:
  - [x] User profile ✅
  - [x] Authentication status (isAuthenticated) ✅
  - [x] Loading and error states ✅
- [x] Implement auth actions:
  - [x] Login ✅
  - [x] Signup ✅
  - [x] Logout ✅
  - [x] Refresh tokens ✅
  - [x] Update profile ✅
  - [x] Initialize auth on app start ✅
- [x] Add token persistence on login (secure storage) ✅
- [x] Add token cleanup on logout ✅

**Commit**: `feat(auth): :sparkles: implement authentication state management` *(Completed)*

---

### Phase 2.2: Authentication UI

#### Step 2.2.1: Login Screen
- [x] Create `src/screens/Auth/LoginModal.tsx` ✅
- [x] Design login form:
  - [x] Email input with validation ✅
  - [x] Password input (secure entry) ✅
  - [x] Login button ✅
  - [x] Link to signup ✅
  - [ ] Social login buttons (Google, Apple) - placeholders (pending)
- [x] Add form validation (email format, password requirements) ✅
- [x] Integrate with login API ✅
- [x] Handle loading and error states ✅
- [x] Modal-based implementation (integrated into App.tsx) ✅

**Commit**: `feat(auth): :sparkles: implement login screen with email/password` *(Completed - modal-based implementation)*

#### Step 2.2.2: Signup Screen
- [x] Create `src/screens/Auth/SignupModal.tsx` ✅
- [x] Design signup form:
  - [x] Name input ✅
  - [x] Email input ✅
  - [x] Password input (with password policy indicator) ✅
  - [x] Confirm password input ✅
  - [x] Terms & conditions checkbox ✅
  - [x] Signup button ✅
  - [x] Link to login ✅
- [x] Add comprehensive form validation ✅
- [x] Integrate with signup API ✅
- [x] Handle loading and error states ✅
- [x] Modal-based implementation (integrated into App.tsx) ✅

**Commit**: `feat(auth): :sparkles: implement signup screen with validation` *(Completed - modal-based implementation)*

#### Step 2.2.3: Social Login Integration
- [ ] Install social login packages:
  - Google: `@react-native-google-signin/google-signin` or Expo equivalent
  - Apple: `@react-native-apple-authentication/apple-authentication` or Expo equivalent
- [ ] Configure Google OAuth:
  - Setup Google OAuth credentials
  - Configure iOS (Info.plist, URL scheme)
  - Configure Android (strings.xml, build.gradle)
- [ ] Configure Apple Sign In:
  - Setup Apple Developer account
  - Configure capabilities in Xcode
  - Setup Android equivalent (if needed)
- [ ] Create `src/lib/social-auth.ts` - Social auth utilities
- [ ] Implement Google login flow with backend integration
- [ ] Implement Apple login flow with backend integration
- [ ] Update Login screen with social login buttons
- [ ] Test full round trip (app → provider → backend → app)

**Commit**: `feat(auth): :sparkles: implement Google and Apple social login`

---

### Phase 2.3: Route Protection & Session Management

#### Step 2.3.1: Route Guards
- [ ] Create `src/components/ProtectedRoute.tsx` or navigation guard
- [ ] Implement authentication check on route access
- [ ] Redirect unauthenticated users to login
- [ ] Preserve intended destination for post-login redirect
- [ ] Integrate with navigation (Expo Router or React Navigation)

**Commit**: `feat(auth): :sparkles: implement route protection and guards`

#### Step 2.3.2: Session Persistence
- [x] Implement `initializeAuth` method in auth store ✅
- [x] Validate stored tokens on app launch (via initializeAuth) ✅
- [x] Auto-refresh tokens if valid but expired ✅
- [x] Auto-logout if tokens are invalid ✅
- [ ] Call initializeAuth on app startup (App.tsx integration pending)
- [ ] Handle token expiration during app usage (401 interceptor pending)
- [ ] Show appropriate loading state during auth check (pending)

**Commit**: `feat(auth): :sparkles: implement session persistence and auto-refresh` *(Partially completed - methods exist, app startup integration pending)*

#### Step 2.3.3: Auth Flow Integration
- [x] Update App.tsx to integrate auth state ✅
- [x] Conditionally render auth modals based on user actions ✅
- [x] Add RightDrawer component for authenticated user menu ✅
- [x] Add DrawerContext for global drawer state ✅
- [x] Add logout functionality in drawer menu ✅
- [x] Clear cart and user data on logout ✅
- [ ] Handle deep linking with authentication (pending)
- [ ] Implement app startup auth check and session restoration (pending)

**Commit**: `feat(auth): :sparkles: integrate authentication flow into app navigation` *(Partially completed - auth modals and drawer integrated, session persistence pending)*

---

### Phase 2.4: User Profile Management

#### Step 2.4.1: Profile Screen (Optional Enhancement)
- [ ] Create `src/screens/Profile/index.tsx`
- [ ] Display user information (name, email)
- [ ] Add edit profile functionality
- [ ] Add logout button
- [ ] Add order history link
- [ ] Add settings section

**Commit**: `feat(profile): :sparkles: implement user profile screen`

---

### Phase 2.5: Auth Testing & Security

#### Step 2.5.1: Auth Unit Tests
- [ ] Test auth store actions (login, logout, refresh)
- [ ] Test token storage/retrieval
- [ ] Test token refresh logic

**Commit**: `test(auth): :white_check_mark: add unit tests for authentication`

#### Step 2.5.2: Auth Integration Tests
- [ ] Test login flow (success, error cases)
- [ ] Test signup flow
- [ ] Test token refresh flow
- [ ] Test route protection
- [ ] Test session persistence

**Commit**: `test(auth): :white_check_mark: add integration tests for authentication flows`

#### Step 2.5.3: Security Audit
- [ ] Verify tokens stored securely (not in plain text)
- [ ] Verify HTTPS-only API calls
- [ ] Verify no sensitive data in logs
- [ ] Review token expiration handling
- [ ] Test token rotation security

**Commit**: `chore(auth): :lock: perform security audit and fixes`

---

## Module 3: Reporting (Backend)

> **Note**: This module focuses on backend API endpoints. The implementation details here assume you have a separate backend repository. Adjust paths/structure as needed.

### Phase 3.1: Backend Setup (If Applicable)

#### Step 3.1.1: Reporting API Endpoints Structure
- [ ] Create reporting routes/controllers
- [ ] Setup reporting service layer
- [ ] Define reporting request/response types
- [ ] Setup database queries for reporting

**Commit**: `feat(backend): :sparkles: setup reporting API structure`

---

### Phase 3.2: Core Reporting Endpoints

#### Step 3.2.1: Sales Reports
- [ ] Implement `GET /api/reports/sales` endpoint
- [ ] Support time period filtering (day/week/month)
- [ ] Return total sales by period
- [ ] Add date range validation
- [ ] Add authentication/authorization (admin only if needed)

**Commit**: `feat(backend): :sparkles: implement sales reporting endpoint`

#### Step 3.2.2: Top-Selling Items Report
- [ ] Implement `GET /api/reports/top-items` endpoint
- [ ] Support sorting by quantity or revenue
- [ ] Add pagination
- [ ] Add time period filtering
- [ ] Return item details with metrics

**Commit**: `feat(backend): :sparkles: implement top-selling items reporting endpoint`

#### Step 3.2.3: Average Order Value Report
- [ ] Implement `GET /api/reports/aov` (Average Order Value) endpoint
- [ ] Support time period filtering
- [ ] Calculate AOV correctly
- [ ] Return breakdown by period

**Commit**: `feat(backend): :sparkles: implement average order value reporting endpoint`

---

### Phase 3.3: Advanced Querying & Filtering

#### Step 3.3.1: Query Parameters Support
- [ ] Implement order status filtering
- [ ] Implement sorting by priority/date/amount
- [ ] Implement date range filtering with validation
- [ ] Implement pagination (page, limit)
- [ ] Add query parameter validation

**Commit**: `feat(backend): :sparkles: add advanced querying and filtering to reports`

#### Step 3.3.2: Query Optimization
- [ ] Optimize database queries with proper indexes
- [ ] Add query result caching where appropriate
- [ ] Implement pagination efficiently
- [ ] Add query performance monitoring

**Commit**: `perf(backend): :zap: optimize reporting queries and add caching`

---

### Phase 3.4: Data Validation & Error Handling

#### Step 3.4.1: Request Validation
- [ ] Install and configure Zod (or Yup) for validation
- [ ] Create validation schemas for all report endpoints
- [ ] Validate date ranges, pagination params, filters
- [ ] Return clear validation error messages

**Commit**: `feat(backend): :sparkles: add request validation with Zod`

#### Step 3.4.2: Error Handling
- [ ] Create standardized error response format
- [ ] Implement meaningful error messages
- [ ] Handle edge cases gracefully (no data, invalid dates, etc.)
- [ ] Add error logging
- [ ] Return appropriate HTTP status codes

**Commit**: `feat(backend): :sparkles: implement comprehensive error handling for reports`

---

### Phase 3.5: API Documentation

#### Step 3.5.1: Swagger/OpenAPI Documentation
- [ ] Setup Swagger or OpenAPI documentation
- [ ] Document all reporting endpoints
- [ ] Document request/response schemas
- [ ] Document query parameters
- [ ] Add example requests/responses
- [ ] Document authentication requirements

**Commit**: `docs(backend): :memo: add Swagger documentation for reporting APIs`

#### Step 3.5.2: Postman Collection (Alternative)
- [ ] Create Postman collection for reporting endpoints
- [ ] Add example requests
- [ ] Add environment variables
- [ ] Document authentication setup

**Commit**: `docs(backend): :memo: add Postman collection for reporting APIs`

---

### Phase 3.6: Testing

#### Step 3.6.1: Reporting API Tests
- [ ] Write unit tests for reporting service logic
- [ ] Write integration tests for all report endpoints
- [ ] Test query parameters and filtering
- [ ] Test error cases
- [ ] Test pagination
- [ ] Test authorization

**Commit**: `test(backend): :white_check_mark: add comprehensive tests for reporting APIs`

---

## Cross-Module Requirements

### Code Quality & Standards

#### Code Organization & Reusability
- [x] Extract price formatting to utility function (`src/utils/format-currency.ts`) ✅
- [x] Extract constants for promotional text and dietary tags ✅
- [x] Standardize import paths (use `@theme`, `@utils`, `@constants` aliases) ✅
- [x] Add `@constants` path alias to TypeScript configuration ✅
- [x] Fix inconsistent default values in helper functions ✅
- [x] Add missing Text component size props for consistency ✅

**Commit**: `refactor(cart): :recycle: improve cart calculations and extract utilities` *(Completed)*

#### Linting & Formatting
- [ ] Ensure ESLint configuration is strict
- [ ] Setup Prettier (if not already)
- [ ] Run linting on all modules
- [ ] Fix all linting errors
- [ ] Add pre-commit hooks (optional but recommended)

**Commit**: `chore(lint): :art: configure and fix all linting issues`

#### Type Safety
- [x] Ensure strict TypeScript configuration ✅
- [x] Review and fix any `any` types ✅
- [x] Add proper type definitions for all API responses ✅
- [ ] Add JSDoc comments for complex functions

**Commit**: `chore(types): :sparkles: ensure strict type safety throughout codebase` *(Partially completed - type safety improved, JSDoc pending)*

---

### CI/CD Setup

#### Step CI.1: GitHub Actions / CI Pipeline
- [ ] Create `.github/workflows/ci.yml`
- [ ] Setup workflow for:
  - Linting
  - Type checking
  - Running tests
  - Building app (optional)
- [ ] Configure to run on PR and push to main/develop
- [ ] Add status badges to README

**Commit**: `chore(ci): :construction_worker: setup CI pipeline with lint, type-check, and tests`

---

### Documentation

#### Step DOC.1: README Updates
- [ ] Update README with:
  - Project description
  - Tech stack overview
  - Setup instructions
  - Running instructions
  - Environment variables
  - Testing instructions
  - Troubleshooting section
- [ ] Add architecture overview (optional but recommended)

**Commit**: `docs(readme): :memo: update README with comprehensive setup and run instructions`

#### Step DOC.2: API Documentation
- [ ] Document all API endpoints (already in Module 3)
- [ ] Document authentication flow
- [ ] Document error codes and responses
- [ ] Document data models/types

**Commit**: `docs(api): :memo: finalize API documentation`

---

## Module Completion Checklist

### Module 1: Menu & Order
- [ ] All Phase 1.1 - Foundation Setup complete
- [ ] All Phase 1.2 - Theme & UI Foundation complete
- [ ] All Phase 1.3 - Menu Screen Enhancement complete
- [ ] All Phase 1.4 - Shopping Cart & Order Management complete
- [ ] All Phase 1.5 - Error Handling & Loading States complete
- [ ] All Phase 1.6 - Testing & Quality complete
- [ ] Module 1 tested end-to-end
- [ ] Code reviewed and linted

### Module 2: Authentication
- [x] All Phase 2.1 - Authentication Backend Integration complete ✅
- [x] All Phase 2.2 - Authentication UI complete (except social login) ✅
- [ ] All Phase 2.3 - Route Protection & Session Management complete (partially - session persistence integration pending)
- [ ] All Phase 2.4 - User Profile Management complete (optional)
- [ ] All Phase 2.5 - Auth Testing & Security complete
- [ ] Module 2 tested end-to-end
- [ ] Security review completed
- [ ] Code reviewed and linted

### Module 3: Reporting
- [ ] All Phase 3.1 - Backend Setup complete
- [ ] All Phase 3.2 - Core Reporting Endpoints complete
- [ ] All Phase 3.3 - Advanced Querying & Filtering complete
- [ ] All Phase 3.4 - Data Validation & Error Handling complete
- [ ] All Phase 3.5 - API Documentation complete
- [ ] All Phase 3.6 - Testing complete
- [ ] Module 3 tested end-to-end
- [ ] API documentation published
- [ ] Code reviewed and linted

---

## Notes for Implementation

1. **Commit Strategy**: Each step should be committed independently. Use descriptive commit messages following the Conventional Commits + Gitmoji format specified in project rules.

2. **Testing**: Write tests as you implement features, not after. This ensures testability is considered during implementation.

3. **Code Review**: After completing each phase, review the code for:
   - Type safety
   - Error handling
   - Performance considerations
   - Accessibility
   - Code reusability

4. **Offline Support**: Throughout implementation, consider offline scenarios:
   - Cache API responses where appropriate
   - Queue actions for later (e.g., add to cart, place order)
   - Show appropriate UI states

5. **Performance**: 
   - Optimize images (lazy loading, proper sizing)
   - Use React.memo for expensive components
   - Optimize FlatList rendering
   - Minimize re-renders

6. **Accessibility**:
   - Add accessibility labels
   - Ensure proper contrast ratios
   - Test with screen readers
   - Support Dynamic Type (iOS)

7. **Backend Integration**: 
   - Ensure backend APIs match frontend expectations
   - Document API contracts
   - Handle API versioning if needed

---

## Next Steps

1. Review this implementation plan
2. Confirm tech stack choices (Expo Router vs React Navigation, etc.)
3. Set up backend API endpoints (if not already done)
4. Begin with **Module 1, Phase 1.1: Foundation Setup**
5. Follow steps sequentially, committing after each step

**Ready to begin? Start with Module 1, Phase 1.1, Step 1.1.1**

