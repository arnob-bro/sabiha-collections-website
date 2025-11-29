# Authentication Flow - Simple Explanation

## Overview
When a user logs in, we need to:
1. Verify their credentials (email/password)
2. Store their login status
3. Remember them when they refresh the page
4. Let all components know if someone is logged in

---

## 🔐 Step-by-Step Flow

### 1. **User Signs Up** (First Time)

```
User fills form → Click "Sign Up" 
    ↓
Frontend sends data to backend API
    ↓
Backend creates account in database
    ↓
Backend responds: "Success! Account created"
    ↓
User sees: "Signup successful! You can now login"
```

**What happens:**
- User data (name, email, password) is saved to database
- Password is encrypted (hashed) for security
- **No login happens yet** - user must log in separately

---

### 2. **User Logs In**

```
User enters email/password → Click "Login"
    ↓
Frontend calls: authStore.login(email, password)
    ↓
API request sent to backend: POST /auth/login
    ↓
Backend checks:
  - Does email exist?
  - Is password correct?
    ↓
If YES:
  - Backend creates 2 tokens:
    * Access Token (short-lived, for API calls)
    * Refresh Token (long-lived, stored in cookie)
  - Backend sends back:
    * Access token (in response)
    * Refresh token (in HTTP-only cookie)
    * User info (user_id, email, role)
    ↓
Frontend receives response
    ↓
authStore saves to:
  - localStorage (access token)
  - Zustand store (user data, isAuthenticated = true)
    ↓
Frontend fetches full user profile
    ↓
User is now logged in! ✅
```

**What gets stored:**
- `accessToken` → localStorage (for API calls)
- `refreshToken` → HTTP-only cookie (automatic, invisible to JavaScript)
- `user` → Zustand store + localStorage (name, email, etc.)
- `isAuthenticated` → `true`

---

### 3. **User Visits a Page (After Login)**

```
User navigates to /account page
    ↓
AccountPage component loads
    ↓
AccountPage checks: useAuthStore()
    ↓
Gets: { isAuthenticated: true, user: {...} }
    ↓
Since isAuthenticated = true
    ↓
Shows Profile component (not Login form)
```

**What happens:**
- Zustand store is already populated from localStorage
- Component immediately knows user is logged in
- No API call needed (unless refreshing token)

---

### 4. **User Refreshes the Page**

```
User presses F5 (refresh)
    ↓
Page reloads, all JavaScript resets
    ↓
Zustand store initializes
    ↓
Zustand reads from localStorage:
  - Found: accessToken, user, isAuthenticated
    ↓
Store restores: { user: {...}, isAuthenticated: true }
    ↓
AccountPage calls initAuth()
    ↓
initAuth checks:
  - Do we have accessToken? YES
  - Is it still valid? (tries to fetch profile)
    ↓
If token expired:
  - Tries to refresh using refreshToken cookie
  - Gets new accessToken
  - Updates store
    ↓
User stays logged in! ✅
```

**Why this works:**
- Zustand's `persist` middleware automatically saves/loads from localStorage
- On refresh, it restores the state instantly
- Then we verify the token is still valid

---

### 5. **Any Component Needs User Info**

```
Component wants to show user's name
    ↓
Component imports: useAuthStore
    ↓
Component calls: const { user } = useAuthStore()
    ↓
Zustand gives: user object with all info
    ↓
Component displays: user.first_name
```

**Example:**
```tsx
// Header.tsx
const { user, isAuthenticated } = useAuthStore()

// Shows "John" if logged in, "Account" if not
{isAuthenticated && user?.first_name 
  ? user.first_name 
  : "Account"}
```

**Why this works:**
- Zustand store is global (shared across all components)
- When store updates, all components using it automatically re-render
- No need to pass props down through components

---

### 6. **User Logs Out**

```
User clicks "Logout" button
    ↓
Component calls: authStore.logout()
    ↓
Frontend sends: POST /auth/logout
    ↓
Backend clears refreshToken cookie
    ↓
Frontend clears:
  - localStorage (accessToken)
  - Zustand store (user, isAuthenticated = false)
    ↓
User is logged out! ✅
    ↓
AccountPage detects: isAuthenticated = false
    ↓
Shows Login form (not Profile)
```

---

## 🗂️ Where Data is Stored

### **localStorage** (Browser Storage)
- `accessToken` - JWT token for API calls
- `auth-storage` - Zustand's persisted state (user, isAuthenticated)

### **HTTP-only Cookie** (Automatic)
- `refreshToken` - Long-lived token for refreshing access token
- **Invisible to JavaScript** (more secure)
- Automatically sent with requests

### **Zustand Store** (In-Memory)
- `user` - Current user object
- `isAuthenticated` - Login status
- `isLoading` - Loading state
- `error` - Error messages

---

## 🔄 How Components Stay Updated

```
User logs in
    ↓
authStore updates: isAuthenticated = true
    ↓
Zustand notifies ALL components using useAuthStore()
    ↓
Components automatically re-render with new data
    ↓
Header shows user's name
AccountPage shows Profile
Everything updates instantly! ✨
```

**This is called "Reactive State":**
- When store changes → components update automatically
- No manual refresh needed
- No need to pass data through props

---

## 🛡️ Security Flow

### **Access Token (Short-lived)**
- Used for API calls
- Stored in localStorage
- Sent in `Authorization: Bearer <token>` header
- Expires quickly (for security)

### **Refresh Token (Long-lived)**
- Used to get new access tokens
- Stored in HTTP-only cookie (more secure)
- Can't be accessed by JavaScript
- Expires after 7 days

### **Token Refresh Flow**
```
API call fails (401 Unauthorized)
    ↓
Interceptor detects: token expired
    ↓
Automatically calls: POST /auth/refresh
    ↓
Backend checks refreshToken cookie
    ↓
If valid: Returns new accessToken
    ↓
Store updates with new token
    ↓
Original API call retries with new token
    ↓
User doesn't notice anything! ✨
```

---

## 📊 Visual Flow Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Login Request
       ▼
┌─────────────────┐
│  Login.tsx      │
│  Component      │
└──────┬──────────┘
       │
       │ 2. authStore.login()
       ▼
┌─────────────────┐
│  authStore      │
│  (Zustand)      │
└──────┬──────────┘
       │
       │ 3. API Call
       ▼
┌─────────────────┐
│  Backend API    │
│  /auth/login    │
└──────┬──────────┘
       │
       │ 4. Returns tokens + user
       ▼
┌─────────────────┐
│  authStore      │
│  Updates State  │
└──────┬──────────┘
       │
       │ 5. Saves to localStorage
       │ 6. Notifies components
       ▼
┌─────────────────┐
│  All Components │
│  Re-render      │
│  (Header, etc.) │
└─────────────────┘
```

---

## 🎯 Key Concepts

### **1. Zustand Store (Global State)**
- Like a shared box that all components can access
- When you put something in, everyone can see it
- When it changes, everyone gets notified

### **2. Persist Middleware**
- Automatically saves store to localStorage
- Automatically loads from localStorage on refresh
- Makes data "survive" page refreshes

### **3. Reactive Updates**
- Components "subscribe" to store changes
- When store updates → components re-render
- No manual refresh needed

### **4. Token-Based Auth**
- Access token = temporary key (like a day pass)
- Refresh token = permanent key (like a membership card)
- When access token expires, use refresh token to get a new one

---

## 💡 Simple Analogy

Think of it like a **gym membership**:

1. **Sign Up** = You register at the gym (create account)
2. **Login** = You show your ID, get a day pass (access token) and membership card (refresh token)
3. **Using the App** = You show your day pass to enter different areas (API calls)
4. **Day Pass Expires** = You show your membership card to get a new day pass (token refresh)
5. **Logout** = You return your passes and leave
6. **Refresh Page** = You come back next day, show your membership card, get a new day pass

The **Zustand store** is like the **reception desk** - everyone can check there to see if you're a member and what your details are.

---

## 🚀 Quick Reference

**To check if user is logged in:**
```tsx
const { isAuthenticated } = useAuthStore()
```

**To get user info:**
```tsx
const { user } = useAuthStore()
// user.first_name, user.email, etc.
```

**To log out:**
```tsx
const { logout } = useAuthStore()
await logout()
```

**To check loading state:**
```tsx
const { isLoading } = useAuthStore()
```

That's it! The store handles everything else automatically. 🎉

