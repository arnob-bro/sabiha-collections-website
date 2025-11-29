# How to Access Logged-In User Info in Components

Any component can access the currently logged-in user's information using the `useAuthStore` hook from Zustand.

## Basic Usage

```tsx
import { useAuthStore } from "../store/authStore"

export default function MyComponent() {
    // Get user data and auth state
    const { user, isAuthenticated, isLoading } = useAuthStore()

    // Check if user is logged in
    if (!isAuthenticated) {
        return <div>Please log in</div>
    }

    // Access user properties
    return (
        <div>
            <p>
                Welcome, {user?.first_name} {user?.last_name}!
            </p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
        </div>
    )
}
```

## Available Properties from useAuthStore

```tsx
const {
    user, // User object (null if not logged in)
    accessToken, // JWT access token (null if not logged in)
    isAuthenticated, // boolean - true if user is logged in
    isLoading, // boolean - true during auth operations
    error, // string | null - error message if any

    // Actions (if needed)
    logout, // Function to log out
    setUser, // Function to update user data
    clearAuth, // Function to clear auth state
} = useAuthStore()
```

## Common Use Cases

### 1. Display User Name in Header

```tsx
import { useAuthStore } from "../store/authStore"

export default function Header() {
    const { user, isAuthenticated } = useAuthStore()

    return (
        <header>
            {isAuthenticated ? (
                <div>
                    <span>Welcome, {user?.first_name}!</span>
                    <button>Logout</button>
                </div>
            ) : (
                <a href="/account">Login</a>
            )}
        </header>
    )
}
```

### 2. Conditional Rendering Based on Auth Status

```tsx
import { useAuthStore } from "../store/authStore"

export default function ProtectedContent() {
    const { isAuthenticated, isLoading } = useAuthStore()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <div>Please log in to view this content</div>
    }

    return <div>Protected content here</div>
}
```

### 3. Check User Role for Permissions

```tsx
import { useAuthStore } from "../store/authStore"
import { Roles } from "../types/user"

export default function AdminPanel() {
    const { user, isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <div>Access denied</div>
    }

    if (user?.role !== Roles.admin) {
        return <div>Admin access required</div>
    }

    return <div>Admin panel content</div>
}
```

### 4. Access User ID for API Calls

```tsx
import { useAuthStore } from "../store/authStore"
import { useEffect } from "react"

export default function UserOrders() {
    const { user, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated && user?.user_id) {
            // Fetch orders for this user
            fetchOrders(user.user_id)
        }
    }, [user?.user_id, isAuthenticated])

    return <div>Orders for user {user?.user_id}</div>
}
```

### 5. Show Loading State During Auth Check

```tsx
import { useAuthStore } from "../store/authStore"

export default function UserDashboard() {
    const { user, isLoading, isAuthenticated } = useAuthStore()

    if (isLoading) {
        return <div>Loading user data...</div>
    }

    if (!isAuthenticated || !user) {
        return <div>Not logged in</div>
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Email: {user.email}</p>
            <p>
                Name: {user.first_name} {user.last_name}
            </p>
            {user.phone && <p>Phone: {user.phone}</p>}
        </div>
    )
}
```

### 6. Logout Functionality

```tsx
import { useAuthStore } from "../store/authStore"

export default function LogoutButton() {
    const { logout, isLoading } = useAuthStore()

    const handleLogout = async () => {
        await logout()
        // User will be logged out and state cleared
    }

    return (
        <button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
        </button>
    )
}
```

## User Object Structure

The `user` object has the following structure (from `types/user.ts`):

```typescript
interface User {
    user_id?: number
    first_name: string
    last_name: string
    email: string
    password?: string // Only present during signup, not in API responses
    role: Role // "user" | "admin"
    phone?: string // Optional
}
```

## Important Notes

1. **Always check `isAuthenticated`** before accessing `user` properties
2. **Use optional chaining (`user?.property`)** to safely access user data
3. **The store is reactive** - components automatically re-render when auth state changes
4. **State persists** - user data is saved to localStorage and restored on page refresh
5. **Loading states** - Check `isLoading` to show spinners during auth operations

## Example: Complete Component

```tsx
import { useAuthStore } from "../store/authStore"
import { Link } from "react-router-dom"

export default function UserMenu() {
    const { user, isAuthenticated, logout, isLoading } = useAuthStore()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <div>
                <Link to="/account">Login</Link>
            </div>
        )
    }

    return (
        <div>
            <div>
                <p>Hello, {user?.first_name}!</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Link to="/account">My Account</Link>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}
```
