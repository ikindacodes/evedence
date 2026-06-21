# Agent index

Living index of shipped agents. Update this when adding a new agent — it feeds ideation and helps avoid repeating the same patterns.

| # | Slug | Summary | Eve surfaces | Eve capabilities demonstrated |
|---|------|---------|--------------|-------------------------------|
| 0001 | weather | Weather assistant with mock `get_weather` tool | `tools`, `channels` | default harness, typed tool, HTTP channel |
| 0002 | meal-planner | Single-meal planner with mock catalog and allergen skill | `tools`, `channels`, `skills` | context control (load-on-demand skills) |
| 0003 | standup-bot | Personal standup from GitHub PRs and issues | `tools`, `channels`, `skills`, `connections` | MCP connections, live external API |
| 0004 | csv-analyst | CSV data Q&A with Python sandbox analysis | `tools`, `channels`, `skills`, `sandbox` | sandbox execution |
| 0005 | digest-bot | Weekday tech digest from a single RSS feed | `tools`, `channels`, `skills`, `schedules` | schedules (cron) |
| 0006 | research-router | Research brief via researcher and writer subagents | `tools`, `channels`, `skills`, `subagents` | subagent delegation, structured output (`outputSchema`) |
| 0007 | support-bot | TaskFlow support Q&A with regression eval suite | `tools`, `channels`, `skills`, `evals` | evals (regression suite) |

## Eve surfaces key

Track which authored slots each agent uses:

- `tools` — `agent/tools/`
- `skills` — `agent/skills/`
- `channels` — `agent/channels/`
- `connections` — `agent/connections/`
- `subagents` — `agent/subagents/`
- `schedules` — `agent/schedules/`
- `hooks` — `agent/hooks/`
- `sandbox` — `agent/sandbox/`
- `evals` — `evals/`

## Eve capabilities key

Track which **runtime and framework behaviors** each agent showcases — not just which folders exist. Use short, consistent labels from this list when updating the table above.

**Authoring & context**

- context control (load-on-demand skills)
- typed tool
- default harness
- HTTP channel
- `instructions.ts`

**Integration & isolation**

- MCP connections
- live external API
- sandbox execution
- schedules (cron)

**Delegation & orchestration**

- subagent delegation
- structured output (`outputSchema`)
- dynamic capabilities (`defineDynamic`)
- dynamic workflows (`ExperimentalWorkflow`)
- remote agents

**Runtime & durability**

- session context (`ctx.session`)
- durable state (`defineState`)
- human-in-the-loop (`needsApproval`)
- hooks

**Quality & production**

- evals (regression suite)
- route auth (custom channel auth)
- client SDK / frontend integration
- instrumentation
- deployment patterns

All agents use the default channel auth scaffold (`localDev`, `vercelOidc`) unless the capabilities column calls out **route auth** explicitly.

When adding agent `NNNN`, update this table **and** the agent table in the repo root [README.md](../README.md).
