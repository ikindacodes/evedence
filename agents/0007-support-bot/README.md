# 0007-support-bot

An eve agent that answers TaskFlow product-support questions from bundled docs, with a regression eval suite.

## What it does

Answers support questions like *"How do I invite a teammate?"* or *"How much is Pro?"* The agent loads the `support-format` skill, searches bundled TaskFlow help articles via `search_docs`, and returns **Answer**, **Source**, and optional **Next steps** sections. Out-of-scope questions (AWS refunds, legal advice) get a polite refusal instead of invented policy.

Twelve eval cases under `evals/` check in-scope answers, refusals, response format, and greeting behavior.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/search_docs.ts` — keyword search over bundled docs
- `agent/skills/support-format.md` — workflow, output format, refusal rules
- `agent/channels/eve.ts` — HTTP channel
- `lib/docs.ts` — doc loading and search helpers
- `data/product-docs/` — fictional TaskFlow help articles
- `evals/` — deterministic regression evals + `evals.config.ts`

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `DOCS_PATH` | No | Path to help docs (default `./data/product-docs`) |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-support-bot && cp -R agents/0007-support-bot/. my-support-bot/
cd my-support-bot
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
cd agents/0007-support-bot
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter 0007-support-bot
```

## Try it

In the dev TUI, ask: *How do I invite a teammate to TaskFlow?*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"How much does TaskFlow Pro cost per user?"}'
```

## Run evals

Evals drive the same HTTP surface as interactive chat. With `AI_GATEWAY_API_KEY` set:

```bash
pnpm eval
```

Useful flags:

```bash
pnpm eval --list              # discover eval ids
pnpm eval answers             # in-scope answer cases only
pnpm eval refusals            # refusal and greeting cases
pnpm eval --strict            # fail on soft assertion thresholds too
pnpm eval --junit .eve/junit.xml
```

Eval artifacts land under `.eve/evals/` after each run.

## Bundled docs

Fictional TaskFlow articles in `data/product-docs/`:

| File | Topics |
|------|--------|
| `getting-started.md` | Invites, plans overview, projects, workspace deletion |
| `billing.md` | Pro pricing, Free limits, refunds, invoices |
| `integrations.md` | Slack, GitHub, webhooks |
| `sso.md` | Enterprise SAML SSO |
| `exports.md` | Project/workspace export, API rate limits |

Point at your own corpus:

```bash
DOCS_PATH=./my-docs pnpm dev
```

## Troubleshooting

**`Expected eval target "@ship-eve/…" but "0007-support-bot" is responding`**

`eve eval` compares against full `package.json` `name`, but the dev server reports the folder basename. Until [vercel/eve#168](https://github.com/vercel/eve/pull/168) lands, this agent uses `"name": "0007-support-bot"` (not `@ship-eve/0007-support-bot`).

**Eval failures after prompt changes**

Re-run `pnpm eval --verbose` and inspect artifacts under `.eve/evals/` for the failing assertion and full event stream.

**Empty search results**

Confirm `DOCS_PATH` points at a directory of `.md` files. The default is `./data/product-docs` relative to the agent package root.

**Model errors in CI**

Evals call a live model — provide `AI_GATEWAY_API_KEY` in the CI environment.
