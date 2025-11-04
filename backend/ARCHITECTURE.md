# OAuth Backend Architecture (Axum + Tokio + SeaORM)

Goal: provide a high‑performance, highly‑available OAuth 2.1/OIDC authorization service for multiple sites, with modular single‑responsibility design.

## Crate layout

- `src/config`: configuration loading (env + optional file), typed config structs
- `src/infra`: host‑level concerns
  - `tracing`: structured logging setup
  - `db`: PostgreSQL connection setup (`sea-orm`)
  - `redis`: Redis connection setup
  - `metrics`: Prometheus text exposition at `/metrics`
- `src/state`: `AppState` (config + pools + metrics)
- `src/error`: unified error and `Result` alias
- `src/web`:
  - `router`: axum router assembly, middlewares
  - `middleware`: custom layers (rate limit, request id, etc.) – placeholder
  - `handlers`: HTTP handlers
    - `health`: `/api/healthz`
    - `well_known`: `/.well-known/openid-configuration`
    - `oauth`: `/api/oauth/*` endpoints (authorize/token/userinfo/introspect/revoke)
- `src/domain`: business entities (User, Client, OAuth types)
- `src/repo`: persistence boundary (ClientRepo/UserRepo/TokenRepo) - SeaORM-based (+ limited raw SQL where needed)
- `src/service`: application services (OAuth, User, Client, Token)

All HTTP side effects go through services, and services use repositories; handlers stay thin.

## Startup order

1. Load env + config (`config::AppConfig`)
2. Init tracing
3. Init PostgreSQL/Redis
4. Build `AppState`
5. Build Router (API + `/metrics`) and `axum::serve`

## OAuth surface

- `GET /api/oauth/authorize` – issue auth code (with PKCE support)
- `POST /api/oauth/token` – exchange code/refresh token, mint access & refresh tokens
- `GET /api/oauth/userinfo` – OIDC userinfo
- `POST /api/oauth/introspect` – RFC 7662 token introspection
- `POST /api/oauth/revoke` – RFC 7009 token revocation
- `GET /.well-known/openid-configuration` – discovery

Handlers are stubbed; implement logic in `service::oauth_service` and repositories.

## Observability

- Tracing via `tracing` + `tracing-subscriber`
- Prometheus text format at `/metrics` (attach counters/histograms as needed)

## Configuration

Environment variables supported (either **namespaced** or **classic**):

- `SERVER__HOST` (or `SERVER_ADDR` like `127.0.0.1:1314`)
- `SERVER__PORT`
- `DATABASE__URL` or `DATABASE_URL`
- `REDIS__URL` or `REDIS_URL`
- `SECURITY__JWT_SECRET` or `JWT_SECRET`
- `OAUTH__ISSUER`, `OAUTH__ACCESS_TOKEN_TTL_SECS`, `OAUTH__REFRESH_TOKEN_TTL_SECS`

Optionally set `APP_CONFIG` to a YAML/TOML file consumed by `config`.
