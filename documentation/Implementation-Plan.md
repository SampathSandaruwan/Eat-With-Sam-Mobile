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
- ✅ **API Client**: Axios client with interceptors (`src/lib/api-client.ts`)
- ✅ **TanStack Query**: QueryClient configured with retry and exponential backoff (`src/lib/query-client.ts`)
- ✅ **Environment Config**: react-native-dotenv setup for API configuration
- ✅ **Service Layer**: Menu API service functions (`src/services/menu.ts`)
- ✅ **Custom Hooks**: 
  - `useMenuCategories` - Menu categories hook
  - `useMenuItems` - Menu items hook  
  - `useMenuItem` - Single menu item hook

### UI Components
- ✅ **Menu Screen**: Fully integrated with API (`src/screens/Menu/index.tsx`)
- ✅ **Menu Components**: 
  - MenuItemCard component with onPress handler (`src/screens/Menu/components/MenuItemCard.tsx`)
  - CategoryTabs component updated for API data (`src/screens/Menu/components/CategoryTabs.tsx`)
  - TopNavBar component (`src/screens/Menu/components/TopNavBar.tsx`)
- ✅ **Menu Item Modal**: Full-screen modal with item details, image, price, rating, tags, availability
- ✅ **UI Components**: 
  - Text component (`src/components/Text.tsx`)
  - Icon component (`src/components/Icon.tsx`) using Phosphor icons
- ✅ **Theme System**: 
  - Basic color palette (`src/theme/colors.ts`)
  - Layout constants (`src/theme/layout.ts`)

### Types & Data
- ✅ **Type Definitions**: 
  - Menu types (`src/types/menu.types.ts` - MenuCategory, MenuItem)
  - Restaurant types (`src/types/restaurant.types.ts`)
  - Environment variable types (`src/types/env.d.ts`)

### Features
- ✅ **Loading States**: ActivityIndicator for main item and selected item
- ✅ **Restaurant Info**: Fetched from API via useMenuItem hook
- ✅ **Category Navigation**: Category tabs with sticky animation on scroll
- ✅ **Assets**: Logo image (`src/assets/images/Logo.png`)
- ✅ **App Branding**: App icons, bundle IDs, and splash screen configured

**Next Steps**: 
- Complete remaining dependencies (Zustand, Navigation, AsyncStorage, NetInfo)
- Add error state handling with retry buttons
- Implement network awareness
- Add shopping cart functionality
- Complete remaining menu enhancements

---

## Module 1: Menu & Order

> **Status Note**: Basic menu UI components and screen structure are already implemented with sample data. The following phases will enhance and integrate with backend APIs.

### Phase 1.1: Foundation Setup (Tech Stack)

#### Step 1.1.1: Install Core Dependencies
- [ ] Install Zustand for state management: `npm install zustand`
- [x] Install TanStack Query (React Query): `npm install @tanstack/react-query` ✅
- [x] Install Axios: `npm install axios` ✅
- [x] Install react-native-dotenv: `npm install react-native-dotenv` ✅
- [ ] Install Expo Router OR React Navigation (based on preference):
  - Option A: `npx expo install expo-router` (Expo Router)
  - Option B: `npm install @react-navigation/native @react-navigation/native-stack` (React Navigation)
- [ ] Install React Native AsyncStorage: `npm install @react-native-async-storage/async-storage`
- [ ] Install Network info library: `npm install @react-native-community/netinfo`

**Commit**: `feat(setup): :package: add core dependencies (zustand, tanstack-query, axios, navigation)` *(Partially completed - TanStack Query, Axios, dotenv installed)*

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
- [ ] Add error state UI with retry button (loading states present, error states need implementation)

**Commit**: `feat(menu): :sparkles: integrate menu data fetching with backend API` *(Partially completed - API integration and loading states done, error states pending)*

#### Step 1.3.3: Menu Item Modal/Popup
- [x] Create menu item modal (implemented in Menu screen) - React Native Modal component ✅
- [x] Design modal with:
  - [x] Item image display ✅
  - [x] Full description and details ✅
  - [x] Price and nutritional info (kcal, price, rating) ✅
  - [x] Tags display ✅
  - [x] Availability status ✅
  - [ ] Customization options (if applicable) - Not implemented
  - [ ] Add to cart button - Not implemented (needs cart store)
- [x] Integrate modal with MenuItemCard click handler (`onPress` prop) ✅
- [x] Add smooth animations for modal open/close (slide animation) ✅
- [x] Modal loading state with ActivityIndicator ✅

**Commit**: `feat(menu): :sparkles: implement menu item detail modal with interactions` *(Partially completed - Modal UI done, cart integration pending)*

#### Step 1.3.4: Enhanced Menu Scrolling & Category Navigation
- [x] Basic sticky category tabs animation implemented (with opacity interpolation on scroll) ✅
- [x] CategoryTabs component updated to work with API data (number IDs, category.name) ✅
- [x] MenuItemCard component updated with Pressable and onPress handler ✅
- [x] FlatList implementation with proper keyExtractor and renderItem ✅
- [ ] Improve sticky category tabs animation (refine scroll thresholds - currently hardcoded at 295-300)
- [ ] Implement scroll-to-category functionality (tabs don't auto-scroll to section yet)
- [ ] Add smooth category section detection during scroll (currently only filters by activeCategoryId)
- [ ] Ensure category tabs sync with scroll position (needs reverse sync)
- [ ] Optimize FlatList performance (removeItemLayout, getItemLayout if needed)

**Commit**: `feat(menu): :sparkles: enhance category navigation and scroll synchronization` *(Partially completed - basic structure and component updates done)*

#### Step 1.3.5: Restaurant Information Section
- [x] Restaurant header implemented with:
  - [x] Restaurant image/banner (using `mainMenuItem?.imageUri`) ✅
  - [x] Restaurant name (using `mainMenuItem?.name` from API) ✅
  - [x] Price display (using `mainMenuItem?.price` from API) ✅
  - [x] Rating, delivery time, minimum order (shown in pills - currently hardcoded values) ✅
  - [x] Back button with smooth interaction (round back button in ListHeaderComponent) ✅
- [x] Restaurant info fetched from API via `useMenuItem` hook ✅
- [x] Loading state for restaurant info (ActivityIndicator) ✅
- [x] Restaurant info section styled and responsive ✅
- [ ] Update hardcoded rating/delivery time/minimum order to use API data

**Commit**: `feat(menu): :sparkles: enhance restaurant information section` *(Partially completed - API integration done, some hardcoded values remain)*

---

### Phase 1.4: Shopping Cart & Order Management

#### Step 1.4.1: Cart State Management (Zustand)
- [ ] Create `src/store/cart-store.ts` - Zustand store for cart state
- [ ] Define cart item type: `src/types/cart.types.ts`
- [ ] Implement cart actions:
  - Add item
  - Remove item
  - Update quantity
  - Clear cart
  - Calculate totals
- [ ] Add cart persistence to AsyncStorage

**Commit**: `feat(cart): :sparkles: implement cart state management with Zustand`

#### Step 1.4.2: Cart UI Components
- [ ] Create `src/components/CartButton.tsx` - Floating cart button with badge
- [ ] Create `src/screens/Cart/index.tsx` - Cart screen
- [ ] Design cart item list with quantity controls
- [ ] Add cart summary (subtotal, fees, total)
- [ ] Create checkout button (placeholder for now)

**Commit**: `feat(cart): :sparkles: implement cart UI components and screen`

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

### Phase 2.1: Authentication Backend Integration

#### Step 2.1.1: Auth API Client Setup
- [ ] Create `src/api/auth.ts` - Authentication API endpoints
- [ ] Define auth types: `src/types/auth.types.ts`
  - Login request/response
  - Signup request/response
  - Token types (access, refresh)
  - User profile type
- [ ] Implement login endpoint
- [ ] Implement signup endpoint
- [ ] Implement refresh token endpoint
- [ ] Implement logout endpoint (if needed)

**Commit**: `feat(auth): :sparkles: setup authentication API client`

#### Step 2.1.2: Token Management
- [ ] Create `src/lib/token-storage.ts` - Secure token storage utilities
- [ ] Install and setup secure storage:
  - iOS: Keychain
  - Android: EncryptedSharedPreferences
  - Use `react-native-keychain` or `expo-secure-store`
- [ ] Implement token storage/retrieval functions
- [ ] Create token refresh interceptor in axios client
- [ ] Implement automatic token rotation on refresh

**Commit**: `feat(auth): :sparkles: implement secure token storage and refresh mechanism`

#### Step 2.1.3: Auth State Management (Zustand)
- [ ] Create `src/store/auth-store.ts` - Authentication state store
- [ ] Implement auth state:
  - User profile
  - Authentication status (isAuthenticated)
  - Tokens (access, refresh)
- [ ] Implement auth actions:
  - Login
  - Signup
  - Logout
  - Refresh tokens
  - Update profile
- [ ] Add token persistence on login
- [ ] Add token cleanup on logout

**Commit**: `feat(auth): :sparkles: implement authentication state management`

---

### Phase 2.2: Authentication UI

#### Step 2.2.1: Login Screen
- [ ] Create `src/screens/Auth/Login.tsx`
- [ ] Design login form:
  - Email input with validation
  - Password input (secure entry)
  - Login button
  - Link to signup
  - Social login buttons (Google, Apple) - placeholders
- [ ] Add form validation (email format, password requirements)
- [ ] Integrate with login API
- [ ] Handle loading and error states
- [ ] Navigate to app on successful login

**Commit**: `feat(auth): :sparkles: implement login screen with email/password`

#### Step 2.2.2: Signup Screen
- [ ] Create `src/screens/Auth/Signup.tsx`
- [ ] Design signup form:
  - Name input
  - Email input
  - Password input (with strength indicator)
  - Confirm password input
  - Terms & conditions checkbox
  - Signup button
  - Link to login
- [ ] Add comprehensive form validation
- [ ] Integrate with signup API
- [ ] Handle loading and error states
- [ ] Navigate to app or email verification screen

**Commit**: `feat(auth): :sparkles: implement signup screen with validation`

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
- [ ] Implement app startup authentication check
- [ ] Validate stored tokens on app launch
- [ ] Auto-refresh tokens if valid but expired
- [ ] Auto-logout if tokens are invalid
- [ ] Handle token expiration during app usage
- [ ] Show appropriate loading state during auth check

**Commit**: `feat(auth): :sparkles: implement session persistence and auto-refresh`

#### Step 2.3.3: Auth Flow Integration
- [ ] Update App.tsx to check auth state on mount
- [ ] Conditionally render auth screens or app screens
- [ ] Handle deep linking with authentication
- [ ] Add logout functionality throughout app
- [ ] Clear cart and user data on logout

**Commit**: `feat(auth): :sparkles: integrate authentication flow into app navigation`

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

#### Linting & Formatting
- [ ] Ensure ESLint configuration is strict
- [ ] Setup Prettier (if not already)
- [ ] Run linting on all modules
- [ ] Fix all linting errors
- [ ] Add pre-commit hooks (optional but recommended)

**Commit**: `chore(lint): :art: configure and fix all linting issues`

#### Type Safety
- [ ] Ensure strict TypeScript configuration
- [ ] Review and fix any `any` types
- [ ] Add proper type definitions for all API responses
- [ ] Add JSDoc comments for complex functions

**Commit**: `chore(types): :sparkles: ensure strict type safety throughout codebase`

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
- [ ] All Phase 2.1 - Authentication Backend Integration complete
- [ ] All Phase 2.2 - Authentication UI complete
- [ ] All Phase 2.3 - Route Protection & Session Management complete
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

