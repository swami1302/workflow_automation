# Memory — Project State Snapshot + AWS EC2 Migration Plan

Last updated: 2026-10-06

## What was built (project state as of today)

### Stack
- **Frontend** (`frontend/`, pnpm): Next.js 16.1, React 19, Tailwind 4, shadcn/radix, `@xyflow/react` (canvas), Zustand (`store/useWorkflowStore.ts`), TanStack Query, axios (`context/AxiosContext.tsx`), zod + react-hook-form, `@vercel/analytics` + `@vercel/speed-insights`.
  - Routes: `/`, `/about`, `/features`, `/blogs`, `/settings`, `/auth/{login,forgot-password,reset-password,verify-email,verify-email-pending}`, `/workflows`, `/workflows/[id]`, `/workflows/demo` (public, `MobileViewGuard`).
  - Route constants centralized in `lib/constants/routes.ts` (`ROUTES`). Query keys in `lib/constants/queryKeys.ts`.
  - Node types: trigger, http, delay, log, binary, exit (`components/nodes/*`), custom edge + edge config dialog.
  - Providers: `AppProviders`, `RouteGuard`, `UserSync` (refetches `/users/me` when authed to keep `isEmailVerified` fresh), `QueryErrorBoundary`, `app/error.tsx`.
  - Env: `NEXT_PUBLIC_API_URL` (build-time inlined).
- **Backend** (`backend/`, npm): NestJS 11 (Express), Prisma 7 with `@prisma/adapter-pg` (config in `prisma.config.ts`), JWT access+refresh, bcrypt, nodemailer (Mailtrap SMTP) + mailgen, `@nestjs/bullmq` + ioredis.
  - Modules: `auth`, `users`, `workflows`, `mail`, `database` (Prisma), `redis` (global, BullMQ root connection — no queues/processors registered yet).
  - `main.ts`: CORS origin = `FRONTEND_URL`, global `ValidationPipe` (whitelist + forbidNonWhitelisted), global prefix `/api` excluding `/` and `/health`, port = `PORT`.
  - `GET /health` → `{status, uptime, timestamp}` (use for LB/uptime checks).
  - Env keys (names only): `DATABASE_URL`, `PORT`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `MAILTRAP_SMTP_HOST`, `MAILTRAP_SMTP_PORT`, `MAILTRAP_SMTP_USER`, `MAILTRAP_SMTP_PASSWORD`, `MAIL_FROM`, `APP_URL`, `FRONTEND_URL`, `REDIS_URL`.
- **Schema** (`backend/prisma/schema.prisma`, Postgres):
  - `User` (email unique, password hash, `isEmailVerified`, single hashed `refreshToken`, forgot-password + email-verification token/expiry).
  - `Workflow` (userId FK cascade, title, `status` DRAFT|ACTIVE, `definition` Json `{nodes,edges}`, `version` Int, index `[userId, updatedAt]`).
  - `WorkflowExecution` (workflowId FK cascade, `status` RUNNING|SUCCEEDED|FAILED, startedAt/finishedAt, output Json, error; index `[workflowId, startedAt]`).
  - Migrations: `init`, `add_auth_fields`, `workflow_schema_added`, `rename_workflow_run_to_execution` (uncommitted; drops `WorkflowRun` table + `RunStatus` enum, creates `WorkflowExecution`).

### Hosting today
- Frontend → **Vercel**. Backend → **Render**. Postgres → **Neon** (us-east-1, pooled endpoint). Redis → **Upstash**.

### Uncommitted work since last save (on `main`, not committed)
- Email verification enforced: `login()` throws 403 for unverified users; JWT payload now carries `isEmailVerified`; `JwtAuthGuard` returns 403 unless handler has `@AllowUnverified()` (`src/common/decorators/allow-unverified.decorator.ts`), used on `POST /auth/resend-verification`.
- Schema drift fixed via new migration (above).
- `RedisModule` + BullMQ deps added; `/health` endpoint; `ROUTES` constants replacing hardcoded paths; `UserSync`.
- Prior-session work also still uncommitted: `error.tsx`, `QueryErrorBoundary`, canvas lockdown in `WorkflowBuilder.tsx`, hydrate-once guard in `workflows/[id]/page.tsx`, `resetWorkflow()` + demo-page reset, edge `animated` persisted.

## Decisions made

- Canvas is read-only for connect/drag by design; nodes are inserted only by dropping onto an edge.
- Demo-page store leak fixed by reset-on-mount, not a store-factory refactor.
- `QueryErrorBoundary` handles error state only; loading is the skeleton in `app/workflows/layout.tsx`.
- Unverified users: signup still returns tokens (so they can hit resend-verification), but every other guarded route 403s and login 403s.
- `/code-review` only when user explicitly asks.
- **Planned:** move off Vercel + Render onto AWS EC2 (checklist below). DB/Redis hosting choice (keep Neon/Upstash vs move into AWS) not yet decided.

## Problems solved

- Builder recursion crash (cyclic edges in `calculateWidth`/`assignPositions`) closed at UI level via `nodesConnectable={false}`; function itself still unguarded.
- Unsaved edits overwritten by differing background refetch → hydrate-once guard.
- Old memory listed "login/guard never check isEmailVerified" and "migration/schema drift" as critical — both now fixed (uncommitted).
- `rtk` shell-hook issue from last session: did not reproduce this session (bare commands worked).

## Current state

**Works:** auth (signup/login/refresh/verify/forgot/reset/change-password), workflow CRUD + builder canvas, demo page, health check.

**Still open — Frontend** (carried from last audit, not re-verified today):
- `calculateWidth`/`assignPositions` lacks cycle guard (mitigated only).
- Orphan-node regression: dropping a node on empty canvas creates an unconnectable node — undecided (block empty drop vs re-enable connect).
- 401-retry queue missing `_retry` flag; `logout()` clears query cache while queries mounted; tokens in `localStorage`; icon-only delete buttons lack `aria-label`; `HttpConfig.tsx` mutates header array in place; `reconnectable:false` may not apply to hydrated edges (unverified).

**Still open — Backend:**
- No rate limiting on auth endpoints; signup awaits email send in write path; single refresh-token column (new device login kills other sessions); no env validation at bootstrap; `MailModule` not `@Global()`.
- **No optimistic concurrency on `WorkflowsService.update()`** despite `version` column (last write wins).
- `findOne()` returns 403 not 404 for other users' workflows; redundant `JwtModule` import in `WorkflowsModule`.

**Execution engine:** not built. Redis/BullMQ wired at root only — no queue, worker, node interpreter, per-node executors, triggers (webhook/cron), or run-history UI.

## AWS EC2 migration checklist (Vercel + Render → EC2)

### 0. Decide first
- [ ] One EC2 box running frontend + backend, or split? (Default: one box, nginx in front, both apps via PM2 or Docker Compose.)
- [ ] Postgres: keep Neon, or move to RDS / self-hosted on EC2? (Neon is us-east-1 — keeping it is lowest effort; put EC2 in us-east-1 for latency.)
- [ ] Redis: keep Upstash, or ElastiCache / Redis on the box? (BullMQ workers poll constantly once the engine exists — Upstash per-request pricing may hurt; local Redis likely cheaper.)
- [ ] PM2 vs Docker Compose for process management.
- [ ] Domain + DNS (Route 53 or existing). E.g. `app.<domain>` + `api.<domain>`, or one domain with `/api` proxied.

### 1. Provision
- [ ] Launch EC2 (Ubuntu 24.04 LTS, t3.small min — Next build is memory-hungry; add 2 GB swap).
- [ ] Elastic IP attached.
- [ ] Security group: 22 (your IP only), 80, 443. Do NOT expose app ports / 5432 / 6379 publicly.
- [ ] SSH key pair; disable password login; non-root deploy user.
- [ ] `ufw` + unattended-upgrades.

### 2. Runtime setup
- [ ] Node 20+ (nvm or NodeSource), `pnpm` (frontend) + `npm` (backend).
- [ ] `build-essential` + `python3` (bcrypt native build).
- [ ] PM2 (`pm2 startup` + `pm2 save`) or Docker + Compose.
- [ ] nginx.
- [ ] (If self-hosting) Postgres / Redis bound to localhost, with passwords.

### 3. Backend deploy
- [ ] `cd backend && npm ci && npx prisma generate && npm run build`.
- [ ] Create `backend/.env` on server (never commit) with all keys above; update `FRONTEND_URL`, `APP_URL` to new public URLs; `PORT` to internal port.
- [ ] Back up DB, then `npx prisma migrate deploy` (applies `rename_workflow_run_to_execution` — drops `WorkflowRun`).
- [ ] Run under PM2: `pm2 start dist/main.js --name api`.
- [ ] Verify `curl localhost:<PORT>/health`.

### 4. Frontend deploy
- [ ] Set `NEXT_PUBLIC_API_URL` to new API URL **before** `pnpm build` (baked in at build time).
- [ ] `cd frontend && pnpm install --frozen-lockfile && pnpm build`.
- [ ] Run `next start -p 3000` under PM2. Optional: `output: 'standalone'` in `next.config.ts`.
- [ ] `@vercel/analytics` / `@vercel/speed-insights` only report on Vercel — remove or replace.

### 5. nginx + TLS
- [ ] Server blocks: frontend → `127.0.0.1:3000`, API → `127.0.0.1:<backend PORT>` (keep `/api` prefix and `/health`).
- [ ] Proxy headers `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`; set Express `trust proxy` when rate limiting is added.
- [ ] Certbot (Let's Encrypt) + auto-renew; redirect 80 → 443.
- [ ] gzip + sane `client_max_body_size`.

### 6. App config for new URLs
- [ ] CORS `FRONTEND_URL` = exact new frontend origin (single origin today — update `main.ts` if both old + new origins needed during cutover).
- [ ] Email links use `APP_URL` / `FRONTEND_URL` — point to new domain.
- [ ] Prod email: Mailtrap sandbox won't deliver to real inboxes — switch to SES/other; set SPF/DKIM.

### 7. CI/CD (replaces Vercel/Render auto-deploy)
- [ ] GitHub Actions on push to `main`: SSH → `git pull` → install → build → `prisma migrate deploy` → `pm2 reload`.
- [ ] SSH key + host as GitHub secrets.
- [ ] Zero-downtime: `pm2 reload` or build in new dir + symlink swap.

### 8. Ops
- [ ] Logs: `pm2-logrotate` or CloudWatch agent.
- [ ] Uptime check on `/health`.
- [ ] Backups: Neon PITR, or nightly `pg_dump` → S3 if self-hosted.
- [ ] EBS snapshot schedule.
- [ ] AWS billing alert.

### 9. Cutover
- [ ] Smoke-test on EC2 via temp subdomain: signup → verify email → login → create/save/load workflow → token refresh.
- [ ] Lower DNS TTL a day ahead; point DNS to Elastic IP.
- [ ] Watch logs + `/health` 24–48h.
- [ ] Decommission Render service + Vercel project only after stable.

## Next session starts with

1. Commit the large uncommitted change set (incl. new migration) — all sitting in `main` working tree.
2. Answer section 0 of the EC2 checklist, then work steps 1–9.
3. Still pending: orphan-node decision; optimistic concurrency on `workflows.update()`.

## Open questions

- Keep Neon + Upstash or move DB/Redis into AWS?
- PM2 or Docker Compose?
- Prod email provider (SES?).
- Orphan-node: block empty-canvas drop or re-enable connect for that case?
- Per-page Zustand isolation (store factory) — needed if more public pages are added.
