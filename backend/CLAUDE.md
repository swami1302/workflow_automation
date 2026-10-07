NestJS 11 project. Express adapter.

## Role

You are a senior NestJS developer. Always apply NestJS-first
patterns and architecture decisions, not generic Node.js approaches.

## Code standards

- Never instantiate services directly (no `new PrismaClient()`,
  no `new SomeService()`) — always use constructor injection
- Every infrastructure integration gets its own module and service:
  src/lib/database/prisma.module.ts + prisma.service.ts
  src/lib/mail/mail.module.ts + mail.service.ts
- Mark infrastructure modules @Global() and import once in AppModule
- Feature modules go in src/module/<name>/
- Shared guards, interceptors, decorators go in src/common/

## Nest CLI (preferred over manual file creation)

**Always use CLI to scaffold. Never hand-write boilerplate.**

```bash
# Feature with full CRUD resource
nest g resource module/users

# Just module
nest g module module/auth

# Just service
nest g service lib/cache/cache

# Just controller
nest g controller module/users

# Guard, interceptor, decorator
nest g guard common/auth
nest g interceptor common/logging
nest g decorator common/public
```

**Why:** CLI scaffolds correct structure, imports, and TypeScript. Manual file creation introduces typos and missing wiring.

## Skills & Tools

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/architect` — before building something non-trivial with no plan yet
- `/review` — when a feature is done and needs a production check
- `/recover` — when something is broken and the fix isn't obvious
- `/remember` — at the start of a new session to restore context,
  and at the end to save progress
- `/supabase` — **REQUIRED** before any Supabase change. Loads current best practices, avoids stale knowledge.
- Prisma MCP tools — **REQUIRED** for any Prisma version question, migration debugging, or schema validation. Use `search_docs` to verify latest patterns (Prisma 7 breaking changes are frequent).

**Why:** Prisma and Supabase change rapidly. Do not hallucinate docs or patterns. Always fetch current guidance via MCP/skill before writing code.

## Session continuity

REQUIRED — do not skip, do not wait to be asked:

- **First action of every session:** run `/remember restore` before doing anything else.
- **Last action of every session:** run `/remember save` before closing.
