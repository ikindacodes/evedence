# EVE-BRIEF

## Summary

Generates a personal standup update from recent GitHub activity in a single repo — merged PRs, open PRs, and open issues filtered to one user.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts` (same auth pattern as `0001-weather` and `0002-meal-planner`)

## Core loop

1. User: *"What should I say in standup?"*
2. Agent: Loads the `standup-format` skill → calls `fetch_standup_data` (GitHub connection) → classifies items into Shipped / In progress / Blocked per skill rules.
3. User sees: A concise standup with three sections — **Shipped** (merged PRs in the last `STANDUP_DAYS`), **In progress** (open PRs authored by or assigned to the user), **Blocked** (issues with `blocked` label + PRs with changes requested or failing checks).

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `fetch_standup_data` — single call returning all three buckets |
| skills | yes | `standup-format` — output sections, tone, classification rules |
| channels | yes | HTTP eve channel |
| connections | yes | GitHub API — auth via `GITHUB_TOKEN`, scoped to `GITHUB_REPO` |
| subagents | no | — |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `connections/github.ts` | GitHub MCP connection (Bearer auth via `GITHUB_TOKEN`) | Env: `GITHUB_TOKEN` | Remote MCP tools for ad-hoc GitHub queries | live | — |
| `fetch_standup_data.ts` | Fetch and classify standup data for one user | Env: `GITHUB_USERNAME`, `STANDUP_DAYS` (default 7) | `{ shipped, inProgress, blocked }` with PR/issue summaries | live | — |

**Shipped:** merged PRs in the last `STANDUP_DAYS` days, authored by or merged by `GITHUB_USERNAME`.

**In progress:** open PRs authored by or assigned to `GITHUB_USERNAME`.

**Blocked:**
- Open issues assigned to `GITHUB_USERNAME` with a `blocked` label (case-insensitive)
- Open PRs authored by or assigned to `GITHUB_USERNAME` with review state "changes requested" or failing required checks

## Instructions highlights

- Identity: Personal standup assistant for a single GitHub repo
- Must do: Load standup-format skill before responding; call `fetch_standup_data` before summarizing; output all three sections even when empty ("None this week")
- Must not: Post comments, merge PRs, or modify GitHub state; invent activity not returned by the tool; include other users' private work outside the filter

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:**
  - `AI_GATEWAY_API_KEY` — model inference
  - `GITHUB_TOKEN` — fine-grained or classic PAT with repo read scope
  - `GITHUB_REPO` — `owner/name` (e.g. `ikindacodes/ship-eve`)
  - `GITHUB_USERNAME` — GitHub login to filter activity
  - `STANDUP_DAYS` — lookback window for merged PRs (default `7`)

## Scope

### In v1

- Single repo, read-only GitHub access
- Personal standup filtered to `GITHUB_USERNAME`
- One `fetch_standup_data` tool backed by GitHub connection
- Authored skill for standup output format and blocked classification
- HTTP channel + TUI dev workflow
- README with clone-and-run instructions and env setup

### Out of v1

- Posting standup summaries to GitHub, Slack, or other channels
- Multi-repo or org-wide aggregation
- Commit-level digests or review-comment threads
- Per-request natural-language date ranges ("since yesterday")
- Scheduled/automatic standup generation
- User accounts or persistent preferences

## Project location

- **Path:** `agents/0003-standup-bot/`
- **Package name:** `@ship-eve/0003-standup-bot`

## Open questions

- none
