# PostgreSQL overview

PostgreSQL is a full-featured, client/server relational database with a rich SQL dialect, extensibility, and strong consistency guarantees.

## Strengths

- **Concurrent workloads:** MVCC handles many simultaneous readers and writers well.
- **Advanced SQL:** CTEs, window functions, JSONB, full-text search, and custom types.
- **Extensibility:** Extensions (PostGIS, pgvector, etc.) without forking the core.
- **Operational maturity:** Replication, backups, connection pooling, and managed cloud offerings.
- **Data integrity:** Robust constraints, foreign keys, and transactional DDL in modern versions.

## Tradeoffs

- **Operational overhead:** Requires running and maintaining a database server (or paying for managed Postgres).
- **Resource footprint:** Higher memory and CPU baseline than embedded SQLite for tiny apps.
- **Complexity for simple apps:** Connection strings, migrations, and pool tuning add early-project friction.
- **Local dev setup:** Docker or native install needed unless using a cloud dev instance.

## Good fit

- Web apps expected to grow beyond a single machine or a handful of concurrent users.
- Products needing row-level security, multiple schemas, or complex relational models.
- Teams already standardized on Postgres for staging and production parity.
- Workloads mixing relational data with JSON documents or geospatial/vector search via extensions.

## Poor fit

- Throwaway prototypes where even Docker feels like too much ceremony.
- Fully offline-first clients with no sync server (SQLite in the client is simpler).
- Environments that forbid network services and shared infrastructure entirely.
