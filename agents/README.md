# Agent index

Living index of shipped agents. Update this when adding a new agent — it feeds ideation and helps avoid repeating the same patterns.

| # | Slug | Summary | Eve surfaces |
|---|------|---------|--------------|
| 0001 | weather | Weather assistant with mock `get_weather` tool | `tools`, `channels` |
| 0002 | meal-planner | Single-meal planner with mock catalog and allergen skill | `tools`, `channels`, `skills` |
| 0003 | standup-bot | Personal standup from GitHub PRs and issues | `tools`, `channels`, `skills`, `connections` |
| 0004 | csv-analyst | CSV data Q&A with Python sandbox analysis | `tools`, `channels`, `skills`, `sandbox` |

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
