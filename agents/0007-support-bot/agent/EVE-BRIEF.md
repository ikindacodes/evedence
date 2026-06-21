# EVE-BRIEF

## Summary

Answers TaskFlow product-support questions from bundled docs, with a regression eval suite for answer quality, refusals, and response format.

## Users & channels

- **Who:** Developer on localhost (TUI, HTTP client, or CI running `pnpm eval`)
- **Channel(s):** HTTP via `agent/channels/eve.ts`

## Core loop

1. User: *"How do I invite a teammate to my workspace?"*
2. Agent: Loads `support-format` skill → calls `search_docs` → answers from returned doc excerpts only.
3. User sees: **Answer**, **Source**, and optional **Next steps** sections citing `data/product-docs/…`.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `search_docs` — keyword search over bundled TaskFlow docs |
| skills | yes | `support-format` — workflow, output shape, refusal rules |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | no | — |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | yes | ~12 cases: in-scope answers, out-of-scope refusals, format, no-tool greetings |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `search_docs.ts` | Search TaskFlow help articles by keywords | `query` (string), `limit` (optional) | Matching articles with id, title, source path, excerpt | bundled `data/product-docs/` | Fictional product corpus keeps agent clone-and-run with zero extra secrets |

## Instructions highlights

- Identity: TaskFlow product support assistant
- Must do: Load support skill before answering; call `search_docs` before factual answers; cite doc source paths; use Answer / Source / Next steps format
- Must not: Invent policies or features; answer non-TaskFlow topics as if authoritative; skip search for product how-to questions

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY`; optional `DOCS_PATH` (default `./data/product-docs`)

## Scope

### In v1

- Bundled TaskFlow docs (getting started, billing, integrations, SSO, exports)
- `search_docs` keyword search
- `support-format` skill with refusal guidance
- ~12 deterministic eval cases under `evals/`
- `pnpm eval` / `eve eval` workflow documented in README

### Out of v1

- Live help-center API or CMS
- Ticket creation or escalation tools
- Connections (Zendesk, Intercom, etc.)
- LLM judge evals or Braintrust reporters
- Multi-turn HITL evals

## Project location

- **Path:** `agents/0007-support-bot/`
- **Package name:** `0007-support-bot` (unscoped — required until [vercel/eve#168](https://github.com/vercel/eve/pull/168) ships)

## Open questions

- none
