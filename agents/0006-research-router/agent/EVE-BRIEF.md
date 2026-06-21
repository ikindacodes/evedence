# EVE-BRIEF

## Summary

Orchestrates research and writing by delegating to two declared subagents, then returns a structured brief with Summary, Findings, and Sources.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts` (same auth pattern as sibling agents)

## Core loop

1. User: *"Compare SQLite vs Postgres for a side project."*
2. Root agent: Loads `research-orchestration` skill → calls `researcher` subagent with the question and `outputSchema` for `{ findings, sources }` → calls `writer` subagent with extracted material and `outputSchema` for `{ summary, findings, sources }`.
3. User sees: Markdown sections **Summary**, **Findings**, and **Sources** with linked or named citations.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | Authored under `researcher` subagent only — root has no tools |
| skills | yes | Root: `research-orchestration`; writer subagent: `brief-format` |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | yes | `researcher` (read sources), `writer` (format brief) |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `subagents/researcher/tools/read_bundled_source.ts` | Read a bundled markdown source by filename | `filename` (string) | `{ filename, title, content }` | bundled `data/sources/*.md` | — |
| `subagents/researcher/tools/fetch_url.ts` | Fetch optional live source URL | none (reads `SOURCE_URL` env) | `{ url, content, contentType }` or skip when unset | live HTTP (`SOURCE_URL`) | — |

### Subagent contracts

**`researcher`** (`agent/subagents/researcher/`)

- **Description:** Reads bundled and optional live sources; extracts factual findings with citations.
- **Tools:** `read_bundled_source`, `fetch_url`
- **Task output (`outputSchema`):** `{ findings: string[], sources: { name: string, url?: string }[] }`

**`writer`** (`agent/subagents/writer/`)

- **Description:** Formats research material into a user-facing brief.
- **Tools:** none
- **Skill:** `brief-format.md` — section layout, tone, citation rules
- **Task output (`outputSchema`):** `{ summary: string, findings: string[], sources: { name: string, url?: string }[] }`

### Bundled sources (`data/sources/`)

| File | Role |
|------|------|
| `sqlite-overview.md` | SQLite strengths, tradeoffs, fit |
| `postgres-overview.md` | Postgres strengths, tradeoffs, fit |
| `choosing-a-database.md` | Neutral decision framework |

## Instructions highlights

- **Root identity:** Research orchestrator — delegate, do not read sources directly
- **Root must do:** Load orchestration skill before delegating; call `researcher` then `writer`; pass full context in subagent `message`; render final **Summary / Findings / Sources** from writer output
- **Root must not:** Invent findings; read bundled files without delegating; call subagents in parallel in v1
- **Researcher must do:** Read all relevant bundled sources; call `fetch_url` when `SOURCE_URL` is set; cite source names in findings
- **Researcher must not:** Fabricate stats or URLs; skip bundled sources when answering comparison questions
- **Writer must do:** Load `brief-format` skill; produce concise summary and bullet findings; preserve source list from researcher
- **Writer must not:** Add claims not present in researcher output

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY` (required); `SOURCE_URL` (optional — live URL fetched by `fetch_url`)

## Scope

### In v1

- Two declared subagents with distinct prompts and tool surfaces
- Structured subagent returns via `outputSchema` (task mode)
- Bundled SQLite vs Postgres source trio
- Optional `SOURCE_URL` live fetch
- Sequential flow: one researcher pass, one writer pass
- HTTP on-demand only

### Out of v1

- Web search APIs or multi-URL crawling
- Nested subagents or parallel fan-out
- Root-level tools
- Schedules, hooks, sandbox, evals
- Brief persistence or export

## Project location

- **Path:** `agents/0006-research-router/`
- **Package name:** `@ship-eve/0006-research-router`

## Open questions

- none
