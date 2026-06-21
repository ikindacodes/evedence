# 0006-research-router

An eve agent that orchestrates research and writing through two declared subagents, returning a structured brief with Summary, Findings, and Sources.

## What it does

Answers research requests like *"Compare SQLite vs Postgres for a side project."* The root agent loads the `research-orchestration` skill, delegates to the `researcher` subagent (bundled sources + optional live URL), then to the `writer` subagent (formatting skill), and renders **Summary / Findings / Sources** from structured subagent output.

## Eve surfaces

- `agent/agent.ts` — root model config (orchestrator, no root tools)
- `agent/instructions.md` — delegation workflow
- `agent/skills/research-orchestration.md` — orchestration procedure and outputSchema shapes
- `agent/channels/eve.ts` — HTTP channel
- `agent/subagents/researcher/` — source reading specialist with `read_bundled_source` and `fetch_url`
- `agent/subagents/writer/` — brief formatter with `brief-format` skill
- `lib/sources.ts` — bundled source I/O and optional URL fetch
- `data/sources/` — SQLite vs Postgres reference markdown

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `SOURCE_URL` | No | Optional live URL fetched by `fetch_url` in the researcher subagent |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-research-router && cp -R agents/0006-research-router/. my-research-router/
cd my-research-router
pnpm install
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

### From the monorepo

```bash
git clone https://github.com/ikindacodes/ship-eve.git
cd ship-eve
pnpm install
cd agents/0006-research-router
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0006-research-router
```

## Try it

In the dev TUI, ask: *Compare SQLite vs Postgres for a side project.*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Compare SQLite vs Postgres for a side project."}'
```

Optional live source:

```bash
SOURCE_URL=https://example.com/article pnpm dev
```

## Subagent architecture

| Subagent | Role | Tools / skills |
|----------|------|----------------|
| `researcher` | Read sources, extract findings | `read_bundled_source`, `fetch_url` |
| `writer` | Format user-facing brief | `brief-format` skill |

The root agent calls each subagent in task mode with `outputSchema` for structured handoff. Declared subagents have isolated tool surfaces — the root cannot read bundled files directly.

## Bundled sources

| File | Content |
|------|---------|
| `sqlite-overview.md` | SQLite strengths, tradeoffs, fit |
| `postgres-overview.md` | PostgreSQL strengths, tradeoffs, fit |
| `choosing-a-database.md` | Neutral decision framework |

## Troubleshooting

**Researcher returns empty findings**

Confirm `data/sources/` exists relative to the agent working directory. Run from the agent package root (`agents/0006-research-router`).

**fetch_url reports not configured**

Expected when `SOURCE_URL` is unset. Bundled sources still work.

**Subagent errors in dev**

Watch the dev terminal for child session logs. The parent stream shows `subagent.called` / `subagent.completed` events only.
