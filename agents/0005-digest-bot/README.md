# 0005-digest-bot

An eve agent that compiles a weekday tech digest from a single RSS feed, on a cron schedule and on demand over HTTP.

## What it does

Reads the feed configured in `DIGEST_SOURCES` (default: [Hacker News front page](https://hnrss.org/frontpage) via hnrss.org). On weekday mornings — or when you ask — it loads the `digest-format` skill, fetches up to 30 items via `fetch_rss_items`, and returns **Highlights** / **Skim** / **Skip** sections with linked headlines and one-line blurbs.

Scheduled runs call `log_digest` so the formatted digest appears in process stdout (dev terminal or production logs).

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/fetch_rss_items.ts` — live RSS fetch and parse
- `agent/tools/log_digest.ts` — stdout logging for scheduled runs
- `agent/skills/digest-format.md` — ranking rules and output format
- `agent/schedules/weekday-digest.ts` — weekday cron (default `0 8 * * 1-5`)
- `agent/channels/eve.ts` — HTTP channel
- `lib/rss.ts` — RSS fetch and XML parsing helpers

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `DIGEST_SOURCES` | Yes | RSS feed URL (default in `.env.example`: Hacker News front page) |
| `CRON_EXPRESSION` | No | Cron for `weekday-digest` (default `0 8 * * 1-5`) |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-digest-bot && cp -R agents/0005-digest-bot/. my-digest-bot/
cd my-digest-bot
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
cd agents/0005-digest-bot
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0005-digest-bot
```

## Try it

In the dev TUI, ask: *What's in today's digest?*

Or over HTTP (with `pnpm dev` running — check its startup line for the port, usually **2000**):

```bash
curl -X POST http://127.0.0.1:2000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"What should I read from the feed today?"}'
```

### Trigger the schedule in dev

Keep `pnpm dev` running in one terminal. In a **second** terminal:

`eve dev` does **not** fire crons automatically. Trigger the weekday digest once:

```bash
curl -X POST http://127.0.0.1:2000/eve/v1/dev/schedules/weekday-digest
```

Watch the terminal for `[digest-bot] ... [/digest-bot]` stdout from `log_digest`.

### Production schedule

`eve start` runs the cron while that process is alive. On Vercel, cron expressions are evaluated in **UTC** — adjust `CRON_EXPRESSION` if you deploy there.

Swap feeds by changing `DIGEST_SOURCES`, for example:

```bash
DIGEST_SOURCES=https://www.reddit.com/r/programming/.rss pnpm dev
```

## Troubleshooting

**Empty or failed fetch**

Confirm `DIGEST_SOURCES` is a valid RSS/Atom URL reachable from your network. Some feeds block unknown user agents or require HTTPS.

**Schedule never runs locally**

Expected in dev — use the dispatch route above. Keep `pnpm dev` or `pnpm start` running for automatic cron ticks in production-like mode.

**No stdout on interactive HTTP requests**

Interactive sessions return the digest in chat only. Stdout logging is for scheduled runs via `log_digest`.
