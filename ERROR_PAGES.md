# Custom Error Pages Documentation

This document describes the custom error and loading pages implemented for StableBank frontend.

## Overview

Custom error pages have been created to provide a consistent, branded user experience when errors occur or content is loading. All pages follow the StableBank design system with the brand colors (purple #4649d6, black #030204, white #fef8f1).

## Error Pages

### 1. Global Error (`/src/app/global-error.tsx`)
- **Purpose**: Catches critical errors that occur outside the React component tree
- **Features**:
  - Inline styles (no external dependencies)
  - Error digest display for debugging
  - "Try Again" and "Go Home" actions
  - Critical error badge indicator

### 2. Root Error (`/src/app/error.tsx`)
- **Purpose**: Catches errors in the main application
- **Features**:
  - Full-page layout matching get-started page design
  - Two-column layout (content + illustration on desktop)
  - Error digest for support reference
  - Branded error messaging
  - "Try Again" and "Go Home" buttons

### 3. 404 Not Found (`/src/app/not-found.tsx`)
- **Purpose**: Displays when a page doesn't exist
- **Features**:
  - Full-page layout with StableBank branding
  - Large "404" illustration on desktop
  - "Go Home" and "Sign In" action buttons
  - Friendly, reassuring messaging

### 4. Dashboard Error (`/src/app/(dashboard)/u/error.tsx`)
- **Purpose**: Catches errors within the dashboard route group
- **Features**:
  - Card-based layout (fits within dashboard UI)
  - Alert icon with destructive color scheme
  - Error digest display
  - "Try Again" and "Back to Dashboard" actions
  - Reassurance about fund safety

### 5. Auth Error (`/src/app/(auth)/error.tsx`)
- **Purpose**: Catches errors during authentication flows
- **Features**:
  - Full-page layout matching auth pages
  - Authentication-specific messaging
  - "Try Again" and "Go Home" buttons
  - Error digest for debugging

## Loading States

### 1. Root Loading (`/src/app/loading.tsx`)
- **Purpose**: Global loading state
- **Features**:
  - Centered spinner with brand purple color
  - Animated dots
  - Minimal, clean design

### 2. Dashboard Loading (`/src/app/(dashboard)/u/loading.tsx`)
- **Purpose**: Loading state for dashboard pages
- **Features**:
  - Skeleton screens for:
    - Balance card
    - Quick actions grid
    - Recent transactions list
  - Pulse animations
  - Maintains dashboard layout structure

### 3. Auth Loading (`/src/app/(auth)/loading.tsx`)
- **Purpose**: Loading state for authentication pages
- **Features**:
  - Full-page skeleton matching auth layout
  - Form field skeletons
  - Animated loading dots
  - Two-column layout on desktop

## Design Patterns

### Color Scheme
- **Primary**: `#4649d6` (brand-purple)
- **Background**: `#030204` (brand-black)
- **Foreground**: `#fef8f1` (brand-white)
- **Destructive**: Red for errors
- **Muted**: `#999999` for secondary text

### Typography
- **Font**: Darker Grotesque (via `font-grotesque` class)
- **Headings**: Extrabold, large sizes (4xl to 7xl)
- **Body**: Normal weight, responsive sizes

### Layout
- **Mobile**: Single column, full-width
- **Desktop**: Two-column grid (content + illustration)
- **Spacing**: Consistent gap system (gap-3, gap-4, gap-6, etc.)
- **Borders**: Rounded corners (rounded-3xl, rounded-[40px])

### Buttons
- **Primary**: Purple background, white text, rounded-[40px]
- **Secondary**: Transparent with purple border
- **Sizes**: Responsive padding (px-6 to px-8, py-6 to py-7)

## Error Handling Flow

```
User Action
    ↓
Error Occurs
    ↓
Next.js Error Boundary
    ↓
├─ Critical Error → global-error.tsx
├─ App Error → error.tsx
├─ 404 Error → not-found.tsx
├─ Dashboard Error → (dashboard)/u/error.tsx
└─ Auth Error → (auth)/error.tsx
```

## Usage Examples

### Triggering Errors (for testing)
```typescript
// In any component
throw new Error("Test error");

// For 404
// Navigate to any non-existent route like /this-does-not-exist
```

### Error Digest
All error pages display an error digest (when available) for debugging:
```typescript
error.digest // e.g., "abc123def456"
```

## Best Practices

1. **Always log errors**: All error pages use `console.error(error)` for debugging
2. **Provide context**: Error messages explain what happened and what users can do
3. **Reassure users**: Especially for financial app, mention fund safety
4. **Offer actions**: Always provide "Try Again" and navigation options
5. **Match design**: Error pages follow the same design system as the rest of the app
6. **Responsive**: All pages work on mobile, tablet, and desktop
7. **Accessible**: Use semantic HTML and proper ARIA labels

## Testing

To test error pages locally:

1. **404 Page**: Navigate to `/non-existent-page`
2. **Error Page**: Add `throw new Error("test")` to any component
3. **Loading States**: Add artificial delays to data fetching
4. **Dashboard Error**: Throw error in dashboard component
5. **Auth Error**: Throw error in auth flow

## Future Enhancements

- Add error reporting integration (e.g., Sentry)
- Implement retry logic with exponential backoff
- Add more specific error types (network, auth, validation)
- Create error page variants for different error codes
- Add animations and transitions
- Implement error recovery strategies
