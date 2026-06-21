# Choosing a database for a side project

Use this framework when picking between embedded SQLite and server PostgreSQL for a personal or early-stage product.

## Decision questions

1. **Will more than one process write at the same time?** If yes, lean Postgres. SQLite handles one writer at a time.
2. **Do you need remote access from multiple hosts?** Postgres listens on the network; SQLite is file-local unless you add sync layers.
3. **How much ops time do you want to spend?** SQLite is file + library. Postgres needs install, backups, and upgrades (or a managed bill).
4. **Will you outgrow a single file soon?** If user count or write volume may spike in months, starting on Postgres avoids a migration crunch.
5. **Is offline-first required?** SQLite excels on-device; Postgres assumes a reachable server.

## Heuristic

| Signal | Lean toward |
|--------|-------------|
| Solo dev, single deploy, mostly reads | SQLite |
| Web app with auth, multiple users, background jobs | PostgreSQL |
| Prototype you might throw away in a week | SQLite |
| Prototype you expect to ship publicly | PostgreSQL (or SQLite with a planned migration) |

## Migration path

Many teams start on SQLite and migrate to Postgres when traffic or team size demands it. Schema tools (Prisma, Drizzle, Rails migrations) ease the jump if you avoid SQLite-only SQL features early.

## Bottom line

Choose SQLite when simplicity and speed-to-first-commit dominate. Choose PostgreSQL when concurrent users, network access, or production parity matter from the start.
