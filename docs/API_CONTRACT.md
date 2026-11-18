# CSA API Contract

Base path: `/api/v1`

Success: `{ "data": ..., "meta"?: { "page", "pageSize", "total" } }`
Error: `{ "error": { "code", "message", "details"? } }`

## Health
- `GET /health` (public) -> `{ data: { status: "ok", time } }`
