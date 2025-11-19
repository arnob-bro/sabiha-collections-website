# Auth API – Signup & Login

This guide serves two audiences:
- **Backend Flow Readers** understand what happens inside the API when each endpoint is hit.
- **Frontend Integrators** learn what to send, what comes back, and how to handle auth tokens.

---

## Endpoint Summary

| Action | Method | Path | Auth | Tokens |
| --- | --- | --- | --- | --- |
| Signup | `POST` | `/auth/create-user` | None | – |
| Login | `POST` | `/auth/login` | None | Access token (JSON) + refresh token (HTTP-only cookie) |

---

## Signup (`POST /auth/create-user`)

### Backend Flow
- Validates required fields: `email`, `password`, `role`, `first_name`, `last_name` (optional `phone` passes through if provided).
- Enforces email format via regex and trims password, requiring ≥6 characters.
- Converts email to lowercase, checks for existing user via `userService.getUserByEmail`.
- Hashes the password (`bcrypt`) and stores the user via `userService.createUser`, which inserts into `users` table with the provided profile data.
- Responds with success message; currently no welcome email or tokens are issued.

### Request Body
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "role": "admin",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

### Successful Response
```json
{
  "success": true,
  "message": "User created successfully"
}
```

### Error Responses
- `400`: missing fields, invalid email, password under 6 chars.
- `409`: email already exists.
- `400`: generic failure (e.g., database errors).

### Integration Notes
- Send JSON with required fields; ensure passwords aren’t pre-trimmed to avoid mismatched hash comparisons later.
- The backend lowercases the email; align this on the client to avoid surprises.
- Handle `409` to display “account already exists”.
- No tokens or session are created here; users must log in after signup.

---

## Login (`POST /auth/login`)

### Backend Flow
- Validates `email` and `password` presence, email format, and password length (≥6 after trimming).
- Fetches the user via `userService.getUserByEmail(email.toLowerCase())`.
- Compares plaintext password with stored hash using `bcrypt.compare`.
- Generates `accessToken` and `refreshToken` via `generateAccessToken(user.user_id)` and `generateRefreshToken(user.user_id)`.
- Stores the refresh token in an HTTP-only cookie named `refreshToken` (7-day lifetime, `sameSite: "none"`, `secure: false` by default – adjust for production).
- Responds with JSON containing success message, access token, and lightweight user info: `user_id`, `email`, `role`.

### Request Body
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Successful Response
HTTP-only cookie:
- `refreshToken=<JWT>; HttpOnly; Max-Age=604800; SameSite=None; Secure=false`

JSON payload:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "<JWT>",
  "user": {
    "user_id": 42,
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Error Responses
- `400`: missing fields, invalid email format, short password, or wrong password.
- `404`: user not found (invalid credentials).
- `400`: generic login failure (caught exceptions).

### Integration Notes
- Send JSON body; set `credentials: "include"` (fetch) or `withCredentials: true` (Axios) so the refresh-token cookie is stored.
- Store the returned access token client-side (memory or secure storage) and include it in `Authorization: Bearer <token>` headers for protected routes.
- Expect HTTP-only cookies; they are invisible to JS but automatically sent on same-origin/specified CORS requests.

### Example Axios Call
```js
import axios from "axios";

const { data } = await axios.post(
  "https://api.example.com/auth/login",
  { email, password },
  { withCredentials: true }
);

const accessToken = data.accessToken;
// store access token, redirect user, etc.
```

---

## After Login
- **Profile**: call `GET /auth/profile` with the `Authorization: Bearer <accessToken>` header. Backend pulls user and permissions via `userService.getUserPermissionsWithCodes`.
- **Refresh Token**: `POST /auth/refresh` reads `refreshToken` cookie, issues a new access token, and returns it in JSON.
- **Logout**: `POST /auth/logout` clears the refresh token cookie.

Ensure frontend state management knows when to refresh tokens, handle expiration (`401`), and clear local state on logout. In production, set `secure: true` for cookies and serve over HTTPS.
