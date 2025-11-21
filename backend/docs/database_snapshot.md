# Database Snapshot API

Provides a single endpoint to retrieve every table, its columns, and current rows. Access is protected by the existing `verifyAccessToken` middleware, so clients must supply a valid access token in the `Authorization` header.

---

## Endpoint

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/db/snapshot` | `none(for now)` | Returns all non-system tables, their columns, and data. |
<!-- | `GET` | `/db/snapshot` | `Authorization: Bearer <accessToken>` | Returns all non-system tables, their columns, and data. | -->

---

## Response Shape

```json
{
  "success": true,
  "totalTables": 3,
  "tables": [
    {
      "schema": "public",
      "table": "users",
      "columns": [
        {
          "column_name": "user_id",
          "data_type": "integer",
          "is_nullable": "NO",
          "column_default": "nextval('users_user_id_seq'::regclass)"
        }
        // ...
      ],
      "rows": [
        {
          "user_id": 1,
          "email": "user@example.com",
          "role": "admin"
        }
        // ...
      ]
    }
    // ...
  ]
}
```

- `tables.columns` come directly from `information_schema.columns`.
- `tables.rows` contains the full result of `SELECT * FROM schema.table`.

---

## Example Axios Call

```js
import axios from "axios";

const { data } = await axios.get("https://api.example.com/db/snapshot", {
  headers: { Authorization: `Bearer ${accessToken}` },
  withCredentials: true
});

console.log(data.tables); // [{ schema, table, columns, rows }, ...]
```

---

## Notes & Caveats
- The endpoint queries every table sequentially; on large databases this may take time and return a large payload. Prefer running it in admin tooling, not per user session.
- Only tables outside `pg_catalog` and `information_schema` are included. Extend the service if you need additional schemas.
- Because the refresh token is stored in an HTTP-only cookie, remember to include `withCredentials: true` (Axios) or `credentials: "include"` (fetch) if you rely on cookie-based refresh workflows.

