# SQLite overview

SQLite is a self-contained, serverless, zero-configuration SQL database engine stored in a single file on disk.

## Strengths

- **Zero ops:** No separate database server process; the app opens a file directly.
- **Portable:** Copy the `.db` file to move or back up the database.
- **Fast for read-heavy workloads:** Excellent for local caching, embedded apps, and prototypes.
- **ACID compliant:** Full transactions with rollback support in a compact library.
- **Wide language support:** Bindings for virtually every platform and language.

## Tradeoffs

- **Single-writer concurrency:** Writes are serialized; not ideal for many concurrent writers.
- **No built-in replication:** High availability requires application-level patterns or external tools.
- **Limited user/role management:** File-system permissions replace server-side GRANT/REVOKE models.
- **Network access:** Not a network database — clients must run on the same machine or mount shared storage.

## Good fit

- Side projects and MVPs where deployment simplicity matters more than scale.
- Mobile apps, CLI tools, and desktop software with local persistence.
- Development and test environments mirroring production SQL without infrastructure cost.
- Read-mostly workloads with occasional writes (settings, offline sync queues).

## Poor fit

- Multi-tenant SaaS with heavy concurrent writes from many users.
- Teams needing managed backups, point-in-time recovery, and replication out of the box.
- Analytics pipelines requiring parallel query workers across a cluster.
