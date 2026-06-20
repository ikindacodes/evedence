# 0001-weather

A minimal eve agent with one typed tool — the hello world of agents.

## What it does

Answers weather questions by calling `get_weather`. The tool returns mock data (no external API) so you can focus on the eve mechanics: path-derived tool identity, the model loop, and durable sessions.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/get_weather.ts` — typed tool (`defineTool` + Zod)
- `agent/channels/eve.ts` — HTTP channel

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-weather-agent && cp -R agents/0001-weather/. my-weather-agent/
cd my-weather-agent
pnpm install
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

### From the monorepo

```bash
git clone https://github.com/ikindacodes/evedence.git
cd evedence
pnpm install
cd agents/0001-weather
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @evedence/0001-weather
```

## Try it

In the dev TUI, ask: *What's the weather in Brooklyn?*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"What is the weather in Brooklyn?"}'
```
