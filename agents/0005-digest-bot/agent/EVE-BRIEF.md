# EVE-BRIEF

## Summary

Fetches a single tech RSS feed on a weekday cron (and on demand) and produces a Highlights / Skim / Skip digest.

## Users & channels

- **Who:** Developer on localhost (TUI, HTTP client, or production logs when scheduled)
- **Channel(s):** HTTP via `agent/channels/eve.ts`

## Core loop

1. User: *"What's in today's digest?"* — or the weekday schedule fires at 08:00 local when `eve start` is running.
2. Agent: Loads `digest-format` skill → calls `fetch_rss_items` → ranks ~30 items into Highlights / Skim / Skip → returns formatted digest (and calls `log_digest` on scheduled runs for stdout).
3. User sees: Markdown sections **Highlights**, **Skim**, **Skip** with linked headlines and one-line blurbs.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `fetch_rss_items`, `log_digest` |
| skills | yes | `digest-format` — ranking rules and output shape |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | no | — |
| schedules | yes | `weekday-digest` — cron from `CRON_EXPRESSION` |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `fetch_rss_items.ts` | Fetch and parse RSS from configured URL | `limit` (optional, max 30) | Feed metadata + array of items (title, link, pubDate, summary) | live RSS (`DIGEST_SOURCES`) | — |
| `log_digest.ts` | Write formatted digest to stdout for scheduled runs | `markdown` (string) | `{ logged: true }` | n/a | — |

## Instructions highlights

- Identity: Weekday tech digest assistant for a single RSS feed
- Must do: Load digest skill before digest work; call `fetch_rss_items` before ranking; follow Highlights / Skim / Skip counts; call `log_digest` when the schedule prompt asks for it
- Must not: Invent headlines; fetch without the tool; add Slack/email delivery in v1

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY`, `DIGEST_SOURCES` (default `https://hnrss.org/frontpage`), optional `CRON_EXPRESSION` (default `0 8 * * 1-5`)

## Scope

### In v1

- Single RSS URL via `DIGEST_SOURCES`
- Fetch cap 30 items; ~5 Highlights, ~5 Skim, rest Skip
- Weekday schedule + on-demand HTTP
- Stdout via `log_digest` on scheduled runs
- Dev schedule trigger via `POST /eve/v1/dev/schedules/weekday-digest`

### Out of v1

- Bundled fixture data
- Multiple feeds / merge logic
- Slack, email, or file persistence
- Dedupe across days or read-state tracking

## Project location

- **Path:** `agents/0005-digest-bot/`
- **Package name:** `@ship-eve/0005-digest-bot`

## Open questions

- none
