# 0003-standup-bot

An eve agent that generates a personal standup from recent GitHub activity in one repo, using a GitHub connection and a structured fetch tool.

## What it does

Answers standup requests like *"What should I say in standup?"* The agent loads the `standup-format` skill, calls `fetch_standup_data` (GitHub REST via connection auth), and returns **Shipped** / **In progress** / **Blocked** sections for the configured user.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/connections/github.ts` — GitHub MCP connection (Bearer auth)
- `agent/tools/fetch_standup_data.ts` — typed tool returning standup buckets
- `agent/skills/standup-format.md` — load-on-demand standup output format
- `agent/channels/eve.ts` — HTTP channel
- `lib/github-api.ts` — GitHub REST helpers used by the fetch tool

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `GITHUB_TOKEN` | Yes | GitHub PAT with repo read access |
| `GITHUB_REPO` | Yes | Target repo as `owner/name` |
| `GITHUB_USERNAME` | Yes | GitHub login to filter activity |
| `STANDUP_DAYS` | No | Lookback for merged PRs (default `7`) |

Create a fine-grained or classic PAT with read access to the target repository. Get an AI Gateway key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-standup-bot && cp -R agents/0003-standup-bot/. my-standup-bot/
cd my-standup-bot
pnpm install
cp .env.example .env
# Add your keys to .env
pnpm dev
```

### From the monorepo

```bash
git clone https://github.com/ikindacodes/ship-eve.git
cd ship-eve
pnpm install
cd agents/0003-standup-bot
cp .env.example .env
# Add your keys to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0003-standup-bot
```

## Try it

In the dev TUI, ask: *What should I say in standup?*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Summarize my standup for this week."}'
```
