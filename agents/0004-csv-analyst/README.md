# 0004-csv-analyst

An eve agent that answers natural-language questions about a CSV dataset by previewing the file and running Python analysis in an isolated sandbox.

## What it does

Answers data questions like *"What's the average order value by region?"* The agent loads the `csv-analysis` skill, inspects the CSV via `preview_csv`, writes Python with the stdlib `csv` module, executes it in the sandbox via `run_analysis`, and returns **Answer**, **Evidence**, and **Method** sections.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/preview_csv.ts` — schema and sample rows from the configured CSV
- `agent/tools/run_analysis.ts` — execute Python in the sandbox
- `agent/skills/csv-analysis.md` — analysis workflow, safety guardrails, output format
- `agent/sandbox/sandbox.ts` — Python sandbox with deny-all network policy
- `agent/channels/eve.ts` — HTTP channel
- `lib/csv.ts` — CSV path resolution and preview helpers
- `data/sample-orders.csv` — bundled e-commerce orders dataset

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `DATA_PATH` | No | Path to CSV (default `./data/sample-orders.csv`) |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-csv-analyst && cp -R agents/0004-csv-analyst/. my-csv-analyst/
cd my-csv-analyst
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
cd agents/0004-csv-analyst
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0004-csv-analyst
```

## Try it

In the dev TUI, ask: *What's the average order value by region?*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Which region has the highest total revenue?"}'
```

Point at your own CSV:

```bash
DATA_PATH=./my-orders.csv pnpm dev
```

## Sample dataset

Bundled `data/sample-orders.csv` contains e-commerce orders with columns:

| Column | Description |
|--------|-------------|
| `order_id` | Unique order identifier |
| `region` | West, East, Central, or South |
| `product` | Product name |
| `quantity` | Units ordered |
| `unit_price` | Price per unit (USD) |
| `order_date` | ISO date (YYYY-MM-DD) |

Order value for analysis is typically `quantity × unit_price`.

## Troubleshooting

**Sandbox bootstrap or Python errors**

Restart dev (`Ctrl+C`, then `pnpm dev`) after sandbox changes so the template rebuilds. The agent uses Python 3 stdlib only — no pip or pandas required.

Use a real sandbox backend (Docker Desktop, OrbStack, or microsandbox). The just-bash fallback has no real Python.

For **inspection only** (columns, sample rows), the agent should call `preview_csv`, which does not use Python.
