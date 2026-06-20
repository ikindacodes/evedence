# 0002-meal-planner

An eve agent that plans a single meal from a mock recipe catalog, with an authored skill for allergen-safe planning and substitutions.

## What it does

Answers meal-planning requests like *"dairy-free dinner for 4, no nuts."* The agent loads the `allergen-safe-planning` skill, searches a mock recipe catalog via `search_recipes`, and returns a full recipe with allergen notes and substitution suggestions.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/search_recipes.ts` — typed tool with in-memory mock catalog
- `agent/skills/allergen-safe-planning.md` — load-on-demand allergen workflow
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
mkdir my-meal-planner && cp -R agents/0002-meal-planner/. my-meal-planner/
cd my-meal-planner
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
cd agents/0002-meal-planner
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0002-meal-planner
```

## Try it

In the dev TUI, ask: *I need a dairy-free dinner for 4 — nothing with nuts either.*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Plan a gluten-free vegetarian dinner for 4."}'
```
